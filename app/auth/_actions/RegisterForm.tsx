"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { registerAction } from "./register";

const initialState = {
  success: false,
  message: "",
};

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success("Account created successfully! Please log in.");
      router.push("/auth/login");
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Create Account
        </CardTitle>
        <CardDescription>
          Join the RentNest community
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Select Account Type</Label>

            <RadioGroup
              name="role"
              defaultValue="TENANT"
              className="grid grid-cols-2 gap-3"
            >
              <Label
                htmlFor="tenant"
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"
              >
                <RadioGroupItem
                  value="TENANT"
                  id="tenant"
                />
                <span>Tenant</span>
              </Label>

              <Label
                htmlFor="landlord"
                className="flex cursor-pointer items-center gap-2 rounded-lg border p-3"
              >
                <RadioGroupItem
                  value="LANDLORD"
                  id="landlord"
                />
                <span>Landlord</span>
              </Label>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Register"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;