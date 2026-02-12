import { getCurrentUser } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/db";
import Jobs from "@/models/Jobs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser?.user.role !== "employer") {
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

    await Jobs.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Job Deleted Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error, "error in job deletion");

    return NextResponse.json({
      success: false,
      message: "job deletion  failed",
      status: 400,
    });
  }
}
