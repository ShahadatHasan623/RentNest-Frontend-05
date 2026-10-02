"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProperty, deleteProperty, getMyProperties, togglePropertyAvailability, updateProperty } from "../services/landlord.service";



export const useLandlordProperties = () => {
  return useQuery({
    queryKey: ["landlord-properties"],
    queryFn: getMyProperties,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["landlord-properties"],
      });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateProperty>[1];
    }) => updateProperty(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["landlord-properties"],
      });

      queryClient.invalidateQueries({
        queryKey: ["landlord-property", variables.id],
      });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["landlord-properties"],
      });
    },
  });
};

export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isAvailable,
    }: {
      id: string;
      isAvailable: boolean;
    }) => togglePropertyAvailability(id, isAvailable),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["landlord-properties"],
      });
    },
  });
};