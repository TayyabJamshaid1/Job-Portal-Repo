const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

export const UpdateEmployerProfile = async (formData: any) => {
  try {
    console.log(formData, "formData");

    const {
      description,
      organizationType,
      teamSize,
      yearOfEstablishment,
      name,
      websiteUrl,
      location,
      employerId,
      avatarUrl,
      bannerImageUrl,
    } = formData;
    const res = await fetch(`${baseUrl}/api/employers/UpdateEmployerProfile`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        employerId,
        description,
        organizationType,
        teamSize,
        yearOfEstablishment,
        name,
        websiteUrl,
        location,
        avatarUrl,
        bannerImageUrl,
      }),
    });

    const data = await res.json();
    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    console.log(data, "data in client");

    return { success: true, message: data?.message };
  } catch (err) {
    return { success: false, message: "User Registration Failed" };
  }
};

export const CreateEmployerJob = async (formData: any) => {
  try {
    console.log(formData, "formData");

    const {
      title,
      jobDescription,
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
      expiryDate,
    } = formData;
    const res = await fetch(`${baseUrl}/api/employers/Jobs/CreateJob`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        jobDescription,
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
        expiryDate,
      }),
    });

    const data = await res.json();
    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    console.log(data, "data in client");

    return { success: true, message: data?.message };
  } catch (err) {
    return { success: false, message: "Update Job Failed" };
  }
};
export const getAllJobs = async (upcomingData: {
  page: number;
  q: string;
  jobType: string;
  price: string;
}) => {
  try {
    const { page, q, jobType, price } = upcomingData;
    const res = await fetch(
      `${baseUrl}/api/employers/Jobs/FetchJobs?search=${q}&jobType=${jobType}&sortByPrice=${price}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return {
      success: true,
      message: data?.message,
      jobs: data?.jobs,
      totalPages: data?.totalPages,
      newJobs: data?.newJobs,
    };
  } catch (err) {
    return { success: false, message: "User Logout Failed" };
  }
};
export const deleteJob = async (id: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/api/employers/Jobs/DeleteJob?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, message: data?.message };
  } catch (err) {
    return { success: false, message: "Job deletion  Failed" };
  }
};
export const findJobById = async (id: string) => {
  try {
    const res = await fetch(
      `${baseUrl}/api/employers/Jobs/FindById?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      },
    );

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, message: data?.message,job:data?.job };
  } catch (err) {
    return { success: false, message: "Single Job fetched  Failed" };
  }
};

export const UpdateEmployerJob = async ({formData,id}:{
  formData:any,id:string
}) => {
  try {
    console.log(formData, "formData",id);


    const res = await fetch(`${baseUrl}/api/employers/Jobs/UpdateJob?id=${id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
      ...formData
      }),
    });

    const data = await res.json();
    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    console.log(data, "data in client");

    return { success: true, message: data?.message };
  } catch (err) {
    console.log(err);
    
    return { success: false, message: "Update employer job Failed" };
  }
};
