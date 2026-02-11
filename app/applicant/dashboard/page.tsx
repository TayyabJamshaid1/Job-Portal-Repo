"use client";

import { logoutAction } from "@/app/(auth)/server/action";
import { handleLogout, UserProfile } from "@/lib/AuthActions";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ApplicantDashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: UserProfile,
    staleTime: 1000 * 60 * 5,
  });
  const router = useRouter();
  const {
    mutate: LogoutUser,
    isPending,
  } = useMutation({
    mutationFn: logoutAction,
    onSuccess: async (res) => {
      if (res?.error) {
                toast.error(res?.message);

        
      } else {
        toast.success(res?.message);
        router.replace("/login");
      }
    },
  });

  return (
    <div>
      {isPending && (
        <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      )}
      <h1>Hello i am in a Applicant Dashboard</h1>
      <button onClick={() => LogoutUser()}>
        {" "}
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            Logging out account...
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          </div>
        ) : (
          "Logout Account"
        )}
      </button>
    </div>
  );
};

export default ApplicantDashboard;
