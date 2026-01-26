import { getCurrentUser } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/db";
import Job from "@/models/Jobs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
    const data = await request.json();
    console.log(data, "data in uodate job",id);

    await ConnectToDatabase();
    const filter = { _id: id };
    const update = {
      $set: data,
    };
    console.log(update,'update');
    
    await Job.updateOne(filter, update);

    return NextResponse.json({
      success: true,
      message: "Job Updated Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error, "error in job update");

    return NextResponse.json({
      success: false,
      message: "job update  failed",
      status: 400,
    });
  }
}
