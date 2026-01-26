"use client";
import { deleteJob, getAllJobs } from "@/lib/EmployerActions";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Label } from "@/components/ui/label";
import debounce from "lodash.debounce";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Building2,
  Edit,
  Loader,
  Locate,
  ShoppingBasket,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { JOB_TYPE } from "@/lib/constant";
import { queryClient } from "@/app/components/Providers";
import { toast } from "react-toastify";
const ListProducts = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Number(searchParams.get("page")) || 1;
  const q = searchParams.get("q") || "";
  const jobType = searchParams.get("jobType") || "";
  const price = searchParams.get("price") || "";
  const { control } = useForm({
    defaultValues: {
      jobType: "",
      priceRange: "",
    },
  });
  const { data: jobs, isPending } = useQuery({
    queryKey: ["jobs", { page, q, jobType, price }],
    queryFn: () => getAllJobs({ page, q, jobType, price }),
  });
    const {
      mutate: deleteJobAction,
      isPending:JobDeletionPending,
    } = useMutation({
      mutationFn: (id:string)=>deleteJob(id),
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
  const updateSearchParams = (
    updates: Record<string, string | number | null>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };
  const nextPage = () => {
    updateSearchParams({
      page: page + 1,
    });
  };

  const prevPage = () => {
    updateSearchParams({
      page: page - 1,
    });
  };
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        updateSearchParams({
          q: value,
          page: 1,
        });
      }, 1000),
    [updateSearchParams],
  );

  if (isPending ||JobDeletionPending) return <Loader className="w-4 h-4 animate-spin" />;
  return (
    <div>
      ListProducts
      <h1 className="text-xl text-blue-500 my-2">Apply Filters</h1>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="jobType">Job Type *</Label>

          <Controller
            name="jobType"
            control={control}
            render={({ field }) => (
              <div className="relative my-3">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value == "all" ? "" : value);
                    updateSearchParams({
                      jobType: value == "all" ? null : value,
                      page: 1, // reset page on new search
                    });
                  }}
                >
                  <SelectTrigger className="pl-10 w-full ">
                    <SelectValue placeholder="Select job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"All"} value={"all"}>
                      All
                    </SelectItem>
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
        </div>
        <div>
          <Label htmlFor="priceRange">Price Range</Label>

          <Controller
            name="priceRange"
            control={control}
            render={({ field }) => (
              <div className="relative my-3">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value == "all" ? "" : value);
                    updateSearchParams({
                      price: value === "all" ? null : value, // 🔥 remove from URL
                      page: 1, // reset page on new search
                    });
                  }}
                >
                  <SelectTrigger className="pl-10 w-full ">
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"All"} value={"all"}>
                      All
                    </SelectItem>
                    <SelectItem key={"lowToHigh"} value={"lowToHigh"}>
                      Low to High
                    </SelectItem>
                    <SelectItem key={"highToLow"} value={"highToLow"}>
                      High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
      </div>
      <div className="space-y-2 my-4">
        <Label htmlFor="title">Job Title *</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="title"
            type="text"
            placeholder="Enter job name"
            className="pl-10"
            defaultValue={q} // 🔥 keep input in sync with URL
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {jobs?.jobs.length > 0 ? (
          jobs?.jobs.map((item: any, index: any) => {
            return (
              <div className="shadow-md shadow-gray-400 p-3" key={index}>
                <div className="flex justify-between items-center">
                  <h1>{item.title}</h1>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>router.push(`/employer/jobs/${item._id}/edit`)}>
                    <Edit size={15} />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <ShoppingBasket size={15} color="red" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your job and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={()=>deleteJobAction(item._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center gap-2 py-3">
                  <div className="bg-gray-300 flex items-center px-2 py-1 text-[8px] rounded-md">
                    {item.jobType}
                  </div>
                  <div className="bg-gray-300 flex items-center px-2 py-1 text-[8px] rounded-md">
                    {item.jobLevel}
                  </div>
                  <div className="bg-gray-300 flex items-center px-2 py-1 text-[8px] rounded-md">
                    {item.workType}
                  </div>
                </div>
                {item?.location && (
                  <div className="flex items-center  gap-2">
                    <Locate size={15} />
                    <span className="text-[14px] text-gray-500">
                      {item?.location}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <h1>NO DATA FOUND</h1>
          </div>
        )}
      </div>
      <div className="mt-2 mb-3">
        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem className="cursor-pointer" onClick={prevPage}>
                <PaginationPrevious />
              </PaginationItem>
            )}
            {jobs?.totalPages !== 0 && (
              <h1>
                page {page && page} of {jobs?.totalPages}
              </h1>
            )}
            {jobs?.totalPages !== 0 && page !== jobs?.totalPages && (
              <PaginationItem className="cursor-pointer" onClick={nextPage}>
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ListProducts;
