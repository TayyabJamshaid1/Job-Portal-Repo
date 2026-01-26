import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectToDatabase } from "@/lib/db";
import { createSessionAndSetCookies } from "../use-cases/sessions";
import { loginUserSchema } from "../register.schema";

export const POST = async (data: NextRequest) => {
  try {
    const upcomingData = await data.json();

    const { data: validatedData, error } =
      loginUserSchema.safeParse(upcomingData);
    if (error) return { status: "ERROR", message: error.issues[0].message };
    // console.log(formData.get("name"));
    const { email, password } = validatedData;
    // const { email, password } = data;

    //check user is already avaiable or not,for this hamai phly check krna pary ga k user database k sath connected ha ya ni
    await ConnectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid Email or Password",
        status: 400,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return NextResponse.json({
        success: false,
        message: "Invalid Email or Password",
        status: 400,
      });
let id=user._id.toString()

await createSessionAndSetCookies(id);

    return NextResponse.json({
      role:user?.role,
      success: true,
      message: "Login Successfull",
      status: 400,
    });
  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Login Failed",
      status: 400,
    });
  }
};
