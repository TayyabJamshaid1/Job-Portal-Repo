import { getCurrentUser } from "@/app/api/auth/auth-queries";
import LoginForm from "@/app/components/LoginForm";
import { redirect } from "next/navigation";

export default async function LoginPage({ children }:any) {
  const session = await getCurrentUser();

  if (session) {
    console.log(session,"sessionnnn in login");
    
    const role = session.userId.role;

    if (role === "admin") redirect("/admin/dashboard");
    if (role === "applicant") redirect("/applicant/dashboard");
    if (role === "employer") redirect("/employer/dashboard");
  }

  return <><LoginForm/></>;
}
