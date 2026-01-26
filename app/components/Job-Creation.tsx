"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Building2, ChevronDownIcon, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEmployerJob, UpdateEmployerJob } from "@/lib/EmployerActions";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "./Providers";
import { toast } from "react-toastify";
import {
  JobTypeData,
  jobValidationSchema,
} from "../api/employers/employer.schema";
import Tiptap from "./text-editor";
import {
  JOB_LEVEL,
  JOB_TYPE,
  MIN_EDUCATION,
  SALARY_CURRENCY,
  SALARY_PERIOD,
  WORK_TYPE,
} from "@/lib/constant";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";

interface JobCreationProps {
  initialData?: any;
  isEditMode?: boolean;
}
const JobCreationForm = ({
  initialData,
  isEditMode = false,
}: JobCreationProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<JobTypeData>({
    resolver: zodResolver(jobValidationSchema),
    defaultValues: 
    isEditMode
      ? {
          ...initialData,
          jobDescription: initialData?.description,
          expiryDate: initialData?.expiresAt
            ? new Date(initialData?.expiresAt)
            : undefined,
        }
      : 
    {
          title: "",
          jobDescription: "",
          jobType: undefined,
          workType: undefined,
          jobLevel: undefined,
          location: "",
          tags: "",
          minSalary: 0,
          maxSalary: 0,
          salaryPeriod: undefined,
          salaryCurrency: undefined,
          minimumEducation: undefined,
          expiryDate: undefined,
        },
  });
  const { mutate: createEmployerJobData, isPending } = useMutation({
    mutationFn: CreateEmployerJob,
    onSuccess: async (res) => {
      if (res.success) {
        console.log(res);

        toast.success(res?.message);

        await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        reset({
          title: "",
          jobDescription: "",
          jobType: undefined,
          workType: undefined,
          jobLevel: undefined,
          location: "",
          tags: "",
          minSalary: 0,
          maxSalary: 0,
          salaryPeriod: undefined,
          salaryCurrency: undefined,
          minimumEducation: undefined,
          expiryDate: undefined,
        });
      } else {
        toast.error(res?.message);
      }
    },
  });
  const { mutate: updateEmployerJobData, isPending: isJobUpdatingPending } =
    useMutation({
      mutationFn: UpdateEmployerJob,
      onSuccess: async (res) => {
        if (res.success) {
          console.log(res);

          toast.success(res?.message);

          await queryClient.invalidateQueries({ queryKey: ["jobs"] });
        } else {
          toast.error(res?.message);
        }
      },
    });
  const handleFormSubmit = async (data: JobTypeData) => {
    let updatedData = {
      ...data,
    };
    if (isEditMode) {
      updateEmployerJobData({ formData: updatedData, id: initialData._id });
    } else {
      createEmployerJobData(updatedData);
    }
  };
console.log(initialData,'initialData');

  //only use this because mjy data tab he update krwana ha jab us me koi change hu
  
// useEffect(() => {
//   if (isEditMode && initialData) {
//     reset({
//       ...initialData,
//       jobDescription: initialData.description,
//       expiryDate: initialData.expiresAt
//         ? new Date(initialData.expiresAt)
//         : undefined,
//     });
//   }
// }, [isEditMode, initialData, reset]);

const isSubmittingDisabled =
  isPending ||
  isJobUpdatingPending ||
  isSubmitting ||
  (isEditMode && !isDirty);


  return (
    <Card className="w-3/4 ">
      <CardContent>
        <form
          onSubmit={handleSubmit(
            (data) => {
              console.log("SUBMITTED DATA:", data);
              handleFormSubmit(data);
            },
            (errors) => {
              console.log("FORM ERRORS:", errors);
            },
          )}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="title"
                type="text"
                placeholder="Enter job name"
                className={`pl-10 ${errors.title ? "border-destructive" : ""} `}
                {...register("title")}
              />
            </div>
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>

              <Controller
                name="jobType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select jobType " />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobType && (
                <p className="text-sm text-destructive">
                  {errors.jobType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="workType">Work Type *</Label>

              <Controller
                name="workType"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select workType " />
                      </SelectTrigger>
                      <SelectContent>
                        {WORK_TYPE.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.workType && (
                <p className="text-sm text-destructive">
                  {errors.workType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobLevel">Job level *</Label>

              <Controller
                name="jobLevel"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="pl-10 w-full ">
                        <SelectValue placeholder="Select jobLevel " />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_LEVEL.map((type) => (
                          <SelectItem key={type} value={type}>
                            {/* {capitalizeWords(type)} */}
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              {errors.jobLevel && (
                <p className="text-sm text-destructive">
                  {errors.jobLevel.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  {...register("location")}
                  placeholder="Enter location"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  {...register("tags")}
                  placeholder="Enter tags"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter minimum salary"
                  className="pl-10"
                  {...register("minSalary", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary (Optional)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Enter maximum salary"
                  className="pl-10"
                  {...register("maxSalary", { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobLevel">Salary Period </Label>

              <Controller
                name="salaryPeriod"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) =>
                      field.onChange(val === "" ? undefined : val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary period" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_PERIOD.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency (Optional)</Label>
              <Controller
                name="salaryCurrency"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) =>
                      field.onChange(val === "" ? undefined : val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select salary Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {SALARY_CURRENCY.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minimumEducation">
                Minimum Education (Optional)
              </Label>
              <Controller
                name="minimumEducation"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) =>
                      field.onChange(val === "" ? undefined : val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum Education" />
                    </SelectTrigger>
                    <SelectContent>
                      {MIN_EDUCATION.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Controller
                name="expiryDate"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <Label>Expiry Date (Optional)</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-between font-normal"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Controller
              name="jobDescription"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <Label>Job Description *</Label>
                  <Tiptap
                    content={field.value ?? ""}
                    onChange={field.onChange}
                  />

                  {fieldState.error && (
                    <p className="text-sm text-destructive">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isSubmittingDisabled}>
              {(isPending || isJobUpdatingPending) && (
                <Loader className="w-4 h-4 animate-spin mr-2" />
              )}

              {isEditMode
                ? isJobUpdatingPending
                  ? "Updating..."
                  : "Update Changes"
                : isPending
                  ? "Saving..."
                  : "Save Changes"}
            </Button>

            {!isDirty && (
              <p className="text-sm text-muted-foreground">
                No changes to save
              </p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobCreationForm;
