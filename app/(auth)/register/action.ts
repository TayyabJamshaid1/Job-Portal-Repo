"use server";

import { redirect } from "next/navigation";
import { ConnectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Employer from "@/models/Employer";
import Applicant from "@/models/Applicant";
import bcrypt from "bcryptjs";
import { createSessionAndSetCookies } from "@/app/api/auth/use-cases/sessions";
import { registerUserSchema } from "@/app/api/auth/register.schema";

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

    const { name, userName, email, password, phoneNumber, role } =
      parsed.data;

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
}}