"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff, Github, Lock, Mail, RectangleGogglesIcon, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/app/api/auth/register.schema";
import { signIn } from "next-auth/react";
import { loginAction } from "../(auth)/server/action";
const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await loginAction(formData);
console.log(res,'res login');

    // If server returns error (redirect won't return)
    if (res?.error)  {
          toast.error(res?.message);
        }else{
        toast.success(res?.message);
        }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Join Our Job Portal</CardTitle>
          <CardDescription>
            Login your account to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`pl-10 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  Logging in...
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                </div>
              ) : (
                "Login Account"
              )}
            </Button>

            {/* Register */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
                <Link
                  href="/register"
                  className="text-primary hover:underline ml-1"
                >
                  Register here
                </Link>
              </p>
                          <div className="w-full flex justify-between items-center gap-3">
              <Button
  type="button"
  variant="outline"
  className="w-[48%] flex gap-2"
  onClick={() => signIn("google", { callbackUrl: "/employer/dashboard" })}
>
<RectangleGogglesIcon/>
  Continue with Google
</Button>
<Button
  type="button"
  variant="outline"
  className="w-[48%] flex gap-2"
  onClick={() => signIn("github", { callbackUrl: "/employer/dashboard" })}
>
<Github/>
  Continue with GitHub
</Button>
</div>
            </div>

            {/* Forgot Password */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Forgot your password?
                <Link
                  href="/forgotPassword"
                  className="text-primary hover:underline ml-1"
                >
                  Click here
                </Link>
              </p>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
