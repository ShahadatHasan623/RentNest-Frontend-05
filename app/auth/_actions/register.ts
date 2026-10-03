"use server";

import { registerUser } from "@/services/auth";
import { RegisterPayload } from "@/services/auth";

export const registerAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "");

  if (!name || !email || !password || !role) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters",
    };
  }

  if (role !== "TENANT" && role !== "LANDLORD") {
    return {
      success: false,
      message: "Please select a valid role",
    };
  }

  const payload: RegisterPayload = {
    name,
    email,
    password,
    role,
  };

  try {
    const result = await registerUser(payload);

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: result.message || "Registration successful",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong during registration",
    };
  }
};