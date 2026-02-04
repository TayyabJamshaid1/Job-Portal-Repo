"use client";
import EmployerSettingForm from "@/app/components/Employer-Setting-Form";
import { UserProfile } from "@/lib/AuthActions";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const SettingEmployer = () => {
  const { data: user } = useQuery({
    queryKey: ["userInfo"],
    queryFn: UserProfile,
    staleTime: 1000 * 60 * 5,
  });  
  if (!user?.profileData) return <Loader className="w-4 h-4 animate-spin" />;

  return (
    <div>
      <EmployerSettingForm
        key={user.profileData._id}
        initialData={user?.profileData}
      />
    </div>
  );
};

export default SettingEmployer;
