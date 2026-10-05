"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { registerAction } from "./register";

const initialState = {
  success: false,
  message: "",
};

/* ---------- role options ---------- */

const ROLE_OPTIONS = [
  {
    value: "TENANT",
    id: "tenant",
    icon: KeyRound,
    title: "Tenant",
    description: "Find & rent properties",
  },
  {
    value: "LANDLORD",
    id: "landlord",
    icon: Building2,
    title: "Landlord",
    description: "List & manage properties",
  },
];

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  const router = useRouter();

  // password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

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
    <Card className="w-full max-w-xl rounded-2xl border-border/70 shadow-lg shadow-black/5">
      <CardHeader className="space-y-4 pb-2 text-center">
        {/* brand icon */}
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/75 text-primary-foreground shadow-md">
          <User className="size-6" />
        </div>

        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create Account
          </CardTitle>

          <CardDescription>
            Join the RentNest community — it&apos;s free
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <form action={formAction} className="space-y-5">
          {/* ---------- name ---------- */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">
              Full Name
            </Label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                autoComplete="name"
                className="h-11 bg-background pl-9"
                required
              />
            </div>
          </div>

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
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
                className="h-11 bg-background pl-9 pr-10"
                required
              />

              {/* show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Use 8+ characters with a mix of letters & numbers
            </p>
          </div>

          {/* ---------- role selector ---------- */}
          <div className="space-y-2.5">
            <Label className="text-sm">I want to join as</Label>

            <RadioGroup
              name="role"
              defaultValue="TENANT"
              className="grid grid-cols-2 gap-3"
            >
              {ROLE_OPTIONS.map((role) => {
                const Icon = role.icon;

                return (
                  <Label
                    key={role.value}
                    htmlFor={role.id}
                    className="group relative flex cursor-pointer flex-col gap-2 rounded-xl border border-border bg-background p-4 transition-all has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5 has-[button[data-state=checked]]:ring-2 has-[button[data-state=checked]]:ring-primary/20"
                  >
                    {/* hidden radio */}
                    <RadioGroupItem
                      value={role.value}
                      id={role.id}
                      className="sr-only"
                    />

                    {/* check indicator */}
                    <CheckCircle2 className="absolute right-3 top-3 size-4 text-primary opacity-0 transition-opacity has-[button[data-state=checked]]:opacity-100 [&:has(+*)]:hidden" />

                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">{role.title}</p>

                      <p className="text-xs leading-tight text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
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
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        {/* ---------- divider ---------- */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs text-muted-foreground">
            Already have an account?
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        {/* ---------- login CTA ---------- */}
        <Button asChild variant="outline" className="h-11 w-full">
          <Link href="/auth/login">Sign in instead</Link>
        </Button>

        {/* ---------- trust note ---------- */}
        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0 text-emerald-500" />
          Your data is safe and encrypted
        </p>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;