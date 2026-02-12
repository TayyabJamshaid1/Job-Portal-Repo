import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }:any) {
  const session = await getCurrentUser();

  if (session) {
    const role = session?.user?.role;

    if (role === "admin") redirect("/admin/dashboard");
    if (role === "applicant") redirect("/applicant/dashboard");
    if (role === "employer") redirect("/employer/dashboard");
  }

  return <>{children}</>;
}
