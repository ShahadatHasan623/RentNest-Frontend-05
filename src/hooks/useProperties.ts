"use client";

import { useQuery } from "@tanstack/react-query";
import { getProperties, PropertyQuery } from "../services/property.service";



export const useProperties = (
  params?: PropertyQuery
) => {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => getProperties(params),
  });
};