/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser } from "@/src/services/auth.service";



const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginUser(data);

      const user = response?.data?.user ?? response?.user;

      toast.success("Login successful!");

      if (user?.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (user?.role === "LANDLORD") {
        router.push("/dashboard/landlord");
      } else {
        router.push("/dashboard/tenant");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid email or password"
      );
    }
  };

  return (
  
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5"
      >
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="w-full rounded border p-3"
        />

        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="w-full rounded border p-3"
        />

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-black p-3 text-white"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}