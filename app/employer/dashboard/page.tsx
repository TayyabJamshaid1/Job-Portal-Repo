"use client";

// import { handleUserLogout } from '@/app/login/login.action'
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "@/lib/AuthActions";
import { StatsCards } from "@/app/components/Employer-Stats";
import { EmployerProfileCompletionStatus } from "@/app/components/Employer-Profile-Status";

const EmployerDashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: UserProfile,
    staleTime: 1000 * 60 * 5,
  });
  let isProfileCompleted =
    user?.profileData?.description &&
    // user?.profileData?.avatarUrl &&
    user?.profileData?.location &&
    user?.profileData?.organizationType &&
    user?.profileData?.teamSize &&
    user?.profileData?.yearOfEstablishment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello,{" "}
          <span className="capitalize">
            {user?.user?.userId.name.toLowerCase()}
          </span>
        </h1>
        <p className="text-muted-foreground">
          Here is your daily activities and appLications
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />
      {isProfileCompleted == null && <EmployerProfileCompletionStatus />}
    </div>
  );
};

export default EmployerDashboard;
