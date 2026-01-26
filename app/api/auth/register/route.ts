import { ConnectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { createSessionAndSetCookies } from "../use-cases/sessions";
import Employer from "@/models/Employer";
import Applicant from "@/models/Applicant";
import { registerUserSchema } from "../register.schema";
//Steps for register
//1-Get Data
//2-Check Validation
//3-Check User already existence
//4-Create new User
//5-Return Response
export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const upcomingData = await request.json();

    const { data: validatedData, error } =
      registerUserSchema.safeParse(upcomingData);
    if (error) {
      await session.abortTransaction();

      return NextResponse.json({
        success: false,
        message: error.issues[0].message,
        status: 400,
      });
    }
    const { email, password, phoneNumber, userName, name, role } =
      validatedData; //yaha await likhna zrori ha kyu k nextjs mei may be data any me thora time lg jai while express me request k sath he data ata ha,is liye waha time ni lgta
    if (!email || !password || !userName || !name || !phoneNumber || !role) {
      await session.abortTransaction();

      return NextResponse.json({
        success: false,
        message: "Missing fields",
        status: 400,
      });
    }
    //check user is already avaiable or not,for this hamai phly check krna pary ga k user database k sath connected ha ya ni
    await ConnectToDatabase();
    const alreadyEmailRegistered = await User.findOne({ email });
    const alreadyUsernameRegistered = await User.findOne({ userName });

    if (alreadyEmailRegistered || alreadyUsernameRegistered) {
      await session.abortTransaction();

    return NextResponse.json(
  {
    success: false,
    message: alreadyEmailRegistered
      ? "User already Registered with this email"
      : alreadyUsernameRegistered
      ? "User already Registered with this username"
      : "User already Registered",
  },
  { status: 400 }
);

    }

    const user = await User.create({
      email,
      password,
      phoneNumber,
      name,
      userName,
      role,
    });
    let id = user._id.toString();
    if (user) {
      if (role == "employer") {
        await Employer.create({
          userId: id,
          name,
        });
      } else if (role == "applicant") {
        await Applicant.create({
          userId: id,
        });
      }
    }

    await createSessionAndSetCookies(id);
    await session.commitTransaction();
    session.endSession();
    return NextResponse.json(
          {
            success: true,
            role: user.role,
      message: "User Registered Successfully",
          },
          { status: 200 }
        );
   
  } catch (error) {
    console.log(error, "error");
    await session.abortTransaction();
 return NextResponse.json(
      { success: false,       message: "Registration failed",},
      { status: 500 }
    );
   
  }
}
