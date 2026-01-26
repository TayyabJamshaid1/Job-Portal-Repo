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

    const {
      title,
      jobDescription: description,
      jobType,
      workType,
      jobLevel,
      location,
      tags,
      minSalary,
      maxSalary,
      salaryPeriod,
      salaryCurrency,
      minimumEducation,
      expiryDate: expiresAt,
    } = await request.json();

    if (!title || !jobType || !workType || !jobLevel || !description) {
      return NextResponse.json({
        success: false,
        message: "Missing fields",
        status: 400,
      });
    }
    await ConnectToDatabase();

    let job = await Job.create({
      title,
      description,
      jobType,
      workType,
      jobLevel,
      location,
      tags,
      minSalary,
      maxSalary,
      salaryPeriod,
      salaryCurrency,
      minimumEducation,
      expiresAt,
      employerId: currentUser.id,
    });
    console.log(job, "job");

    return NextResponse.json({
      success: true,
      message: "Job Created Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error, "error in job creation");

    return NextResponse.json({
      success: false,
      message: "job creation  failed",
      status: 400,
    });
  }
}
