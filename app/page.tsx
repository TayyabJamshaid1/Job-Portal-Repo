// "use client";
// import React from "react";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { UserProfile } from "@/lib/AuthActions";
// import { useRouter } from "next/navigation";

// // import { useSession, signOut } from "next-auth/react";

// const page = () => {
//   const {
//     data: user,
//   } = useQuery({
//     queryKey: ["userInfo"],
//     queryFn: UserProfile,
//   });
// const router=useRouter()
// console.log(user);

//   return (
//     <div>
//       page {user?.user?.userId?.email}{" "}
//       <button
       
        
//         className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default page;
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  if (user.role === "applicant") redirect("/applicant/dashboard");
  if (user.role === "employer") redirect("/employer/dashboard");
  if (user.role === "admin") redirect("/admin/dashboard");

  return null;
}
