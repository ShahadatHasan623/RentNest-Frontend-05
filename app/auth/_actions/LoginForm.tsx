"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "./login";

const initialState: {
  success: boolean;
  message: string;
  data?: { role?: string };
} = {
  success: false,
  message: "",
};

const getDashboardPath = (role?: string) => {
  switch (role) {
    case "TENANT":
      return "/dashboard/tenant";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
  }
};

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success("Login successful!");

      const redirect = searchParams.get("redirect");
      const safeRedirect =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : getDashboardPath(state.data?.role);

      router.replace(safeRedirect);
      router.refresh();
    } else {
      toast.error(state.message);
    }
  }, [state, router, searchParams]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your RentNest account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&rsquo;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginForm;