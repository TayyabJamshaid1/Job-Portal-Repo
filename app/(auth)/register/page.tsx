import { getCurrentUser } from "@/app/api/auth/auth-queries";
import RegisterForm from "@/app/components/RegisterForm";
import { redirect } from "next/navigation";

export default async function RegisterPage({ children }:any) {
  const session = await getCurrentUser();

  if (session) {    
    const role = session.userId.role;

    if (role === "admin") redirect("/admin/dashboard");
    if (role === "applicant") redirect("/applicant/dashboard");
    if (role === "employer") redirect("/employer/dashboard");
  }

  return <><RegisterForm/></>;
}
