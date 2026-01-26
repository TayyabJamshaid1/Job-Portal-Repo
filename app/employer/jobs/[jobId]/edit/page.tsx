"use client";
import JobCreationForm from "@/app/components/Job-Creation";
import { findJobById } from "@/lib/EmployerActions";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();

  const { data, isPending } = useQuery({
    queryKey: ["jobId", jobId],
    queryFn: () => findJobById(jobId),
    enabled: !!jobId,
  });

  if (isPending) return <Loader className="w-4 h-4 animate-spin" />;

  return (
    <div>
      <h1 className="text-md">Edit Job</h1>

      <JobCreationForm initialData={data?.job} isEditMode={true} />
    </div>
  );
};

export default JobDetail;
