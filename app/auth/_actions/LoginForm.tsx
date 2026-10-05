"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";

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
    initialState,
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  // password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

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
    <Card className="w-full max-w-md rounded-2xl border-border/70 shadow-lg shadow-black/5">
      <CardHeader className="space-y-4 pb-2 text-center">
        {/* brand icon */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-md">
          <LogIn className="size-6" />
        </div>

        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to your RentNest account
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <form action={formAction} className="space-y-5">
          {/* ---------- email ---------- */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="h-11 bg-background pl-9"
                required
              />
            </div>
          </div>

          {/* ---------- password ---------- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm">
                Password
              </Label>

              {/* optional: forgot password link */}
              {/* <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link> */}
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-11 bg-background pl-9 pr-10"
                required
              />

              {/* show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* ---------- submit ---------- */}
          <Button
            type="submit"
            className="h-11 w-full gap-2 text-sm font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        {/* ---------- divider ---------- */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs text-muted-foreground">
            New to RentNest?
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ---------- register CTA ---------- */}
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/auth/register">Create a free account</Link>
        </Button>

        {/* ---------- trust note ---------- */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
          Your credentials are encrypted and secure
        </p>
      </CardContent>
    </Card>
  );
};

export default LoginForm;