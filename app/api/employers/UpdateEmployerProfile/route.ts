import { NextRequest, NextResponse } from "next/server";
import { ConnectToDatabase } from "@/lib/db";
import Employer from "@/models/Employer";

export async function POST(request: NextRequest) {
  try {
    const upcomingData = await request.json();

    const {
      employerId,
      description,
      organizationType,
      teamSize,
      yearOfEstablishment,
      name,
      websiteUrl,
      location,
      avatarUrl,bannerImageUrl
    } = upcomingData; 
   console.log(avatarUrl,bannerImageUrl,' avatarUrl,bannerImageUrl');
   
    if (
      !description ||
      !organizationType ||
      !teamSize ||
      !name ||
      !yearOfEstablishment ||
      !websiteUrl ||
      !location
    ) {
      return NextResponse.json({
        success: false,
        message: "Missing fields",
        status: 400,
      });
    }
    //check user is already avaiable or not,for this hamai phly check krna pary ga k user database k sath connected ha ya ni
    await ConnectToDatabase();
    const updatedDocument = await Employer.findByIdAndUpdate(
      employerId,
      {
        description,
        organizationType,
        teamSize,
        yearOfEstablishment,
        name,
        websiteUrl,
        location,
        avatarUrl,bannerImageUrl
      },
      { new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Company Profile Updated Successfully",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
