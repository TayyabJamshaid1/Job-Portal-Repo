"use server";

import { ConnectToDatabase } from "@/lib/db";
import Employer from "@/models/Employer";
import crypto from "crypto";
import { cookies } from "next/headers";
import Session from "@/models/Session";
import Applicant from "@/models/Applicant";
import {
  createSessionAndSetCookies,
  invalidateSession,
} from "@/app/api/auth/use-cases/sessions";
import {
  loginUserSchema,
  registerUserSchema,
} from "@/app/api/auth/register.schema";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";
export async function registerAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      userName: formData.get("userName"),
      email: formData.get("email"),
      password: formData.get("password"),
      phoneNumber: formData.get("phoneNumber"),
      role: formData.get("role"),
    };

    const parsed = registerUserSchema.safeParse(rawData);

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, userName, email, password, phoneNumber, role } = parsed.data;

    await ConnectToDatabase();

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ userName });

    if (existingEmail || existingUsername) {
      return {
        error: existingEmail
          ? "User already registered with this email"
          : "User already registered with this username",
      };
    }

    const user = await User.create({
      name,
      userName,
      email,
      password,
      phoneNumber,
      role,
    });

    const id = user._id.toString();

    if (role === "employer") {
      await Employer.create({
        userId: id,
        name,
      });
    }

    if (role === "applicant") {
      await Applicant.create({
        userId: id,
      });
    }

    await createSessionAndSetCookies(id);

    // ✅ Server-side redirect (no flicker)
    return {
      status: "SUCCESS",
      message: "Registration Completed Successfully",
    };
  } catch (error: any) {
    if (error?.message !== "NEXT_REDIRECT") {
      console.error("Register error:", error);
      return { error: "Registration failed" };
    }
  }
}
export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const parsed = loginUserSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    await ConnectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isValid = await bcrypt.compare(password as string, user.password);

    if (!isValid) {
      return { error: "Invalid email or password" };
    }

    await createSessionAndSetCookies(user._id.toString());

    return {
      status: "SUCCESS",
      message: "Login Completed Successfully",
    };
  } catch (error) {
    console.error("Error inserting contact form data:", error);
  }
}
export async function forgotPasswordAction(formData: FormData) {
  try {
    const email = formData.get("email");

    if (!email || typeof email !== "string") {
      return { error: "Email is required" };
    }

    await ConnectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return { error: "User not found" };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    await sendResetEmail(email, resetLink);

    return {
      status: "SUCCESS",
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      error: "Password reset failed",
    };
  }
}

export async function resetPasswordAction(formData: FormData) {
  try {
    const token = formData.get("token");
    const password = formData.get("password");

    if (!token || !password) {
      return { error: "Token and password are required" };
    }

    await ConnectToDatabase();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return {
        error: "Invalid or expired token",
      };
    }

    // ✅ Hash new password

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return {
      status: "SUCCESS",
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Update password error:", error);
    return {
      error: "Password update failed",
    };
  }
}

export async function logoutAction() {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return {
        error: "Already logged out or no session found",
      };
    }

    const sessionToken = crypto
      .createHash("sha256") // ⚠ fixed from sha-256 → sha256
      .update(session)
      .digest("hex");

    const sessionStoredUser = await Session.findOne({ sessionToken });

    if (sessionStoredUser) {
      await invalidateSession(sessionStoredUser._id.toString());
    }

    cookieStore.delete("session");

    return {
      status: "SUCCESS",
      message: "Successfully logged out",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      error: "Logout failed",
    };
  }
}
