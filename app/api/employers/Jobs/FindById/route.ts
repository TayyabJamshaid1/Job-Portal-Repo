import { getCurrentUser } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/db";
import Jobs from "@/models/Jobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== "employer") {
      return NextResponse.json({
        success: false,
        message: "Not Valid User",
        status: 400,
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Missing Id",
        status: 400,
      });
    }
    await ConnectToDatabase();

    let job = await Jobs.findOne({ _id: id, employerId: currentUser.id });

    return NextResponse.json({
      success: true,
      job,
      message: "Single Job Fetched Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error, "error in Single Job Fetched");

    return NextResponse.json({
      success: false,
      message: "Single Job Fetched  failed",
      status: 400,
    });
  }
}
