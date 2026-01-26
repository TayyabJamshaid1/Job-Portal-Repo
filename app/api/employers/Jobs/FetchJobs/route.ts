import { getCurrentUser } from "@/lib/auth";
import { ConnectToDatabase } from "@/lib/db";
import Job from "@/models/Jobs";
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

    await ConnectToDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const jobType = searchParams.get("jobType");
    const page = Number(searchParams.get("page")) || 1;
    const sortByPrice = searchParams.get("sortByPrice"); // asc | desc

    // ✅ Build filters dynamically
    const filters: any = {};
    if (search) {
      filters.title = {
        $regex: search,
        $options: "i", //for both capital & small
      };
    }
    if (jobType) {
      filters.jobType = jobType;
    }
    let limit = 2;
    let skip = (page - 1) * limit;
    let sortOption: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    if (sortByPrice) {
      if (sortByPrice === "lowToHigh") {
        sortOption = {
          minSalary: 1,
        };
      } else if (sortByPrice === "highToLow") {
        sortOption = {
          maxSalary: -1,
        };
      }
    }
    let jobs = await Job.find(filters)
      .sort(sortOption)
      .limit(limit)
      .skip(skip);
    const newJobs = await Job.find().sort("-createdAt").limit(4);
const totalDocuments = await Job.countDocuments(filters);
    
    const totalPages = Math.ceil(totalDocuments / limit);

    return NextResponse.json({
      success: true,
      jobs,
      totalPages,
      newJobs,
      message: "Job Fetch Successfully",
      status: 200,
    });
  } catch (error) {
    console.log(error, "error in Job creation");

    return NextResponse.json({
      success: false,
      message: "Job fetch  failed",
      status: 400,
    });
  }
}
