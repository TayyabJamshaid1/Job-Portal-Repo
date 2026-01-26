import { NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import { cookies } from "next/headers";
import { validateSessionAndGetUser } from "../use-cases/sessions";
import Applicant from "@/models/Applicant";
import Employer from "@/models/Employer";

export async function GET() {
  try {
    await ConnectToDatabase();
    const cookiesData = await cookies();
    let session = cookiesData.get("session")?.value;
    if (!session) return null;
    const user = await validateSessionAndGetUser(session);
    let profileData;

    if (user.userId.role == "applicant") {
      profileData = await Applicant.findOne({
        userId: user?.userId?._id.toString(),
      });
    } else if (user.userId.role == "employer") {
      profileData = await Employer.findOne({
        userId: user?.userId?._id.toString(),
      });
    }

    return NextResponse.json({
      profileData,
      user,
      success: true,
      message: "User fetched successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false });
  }
}
