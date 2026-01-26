import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { ConnectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    await ConnectToDatabase();

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired token",
      });
    }
console.log(password,'password');

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
