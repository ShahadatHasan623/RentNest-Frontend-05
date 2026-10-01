"use client";


import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth.service";

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: !!query.data,
  };
};