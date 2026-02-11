"use client";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const UserProfile = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/auth/UserProfileData`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, message: data?.message,user:data?.user,profileData:data?.profileData };
  } catch (err) {
    return { success: false, message: "User Logout Failed" };
  }
};