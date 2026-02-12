// import { getCurrentUser } from "@/app/api/auth/auth-queries";
// import { redirect } from "next/navigation";
// import EmployerSidebar from "../components/Employer-Sidebar";
// export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
//    const user = await getCurrentUser();
//     if (!user) return redirect("/login");
    
//     if (user?.userId?.role !== "employer")
//       return redirect("/Applicants/Dashboard");
//   return (
// <div className="flex min-h-screen bg-background ">
//      <EmployerSidebar/>
//       <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main>
//     </div>
//   );
// }
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import EmployerSidebar from "../components/Employer-Sidebar";

export default async function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/login");
if (currentUser.user.role !== "employer") redirect("/");

  return <div className="flex min-h-screen bg-background "> <EmployerSidebar/> <main className="container mx-auto mt-5 ml-70 mr-5">{children}</main></div>;
}
