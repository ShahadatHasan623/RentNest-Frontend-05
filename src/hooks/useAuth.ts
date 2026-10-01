"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth.service";


export const useAuth = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: getMe,
    retry: false,
  });

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: !!user,
  };
};