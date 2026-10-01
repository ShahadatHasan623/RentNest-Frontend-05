import axiosInstance from "../lib/axios";
import { RentalRequest } from "../types/rental";


export interface CreateRentalPayload {
  propertyId: string;
  startDate: string;
  message?: string;
}

export const createRentalRequest = async (
  payload: CreateRentalPayload
) => {
  const { data } = await axiosInstance.post(
    "/rentals",
    payload
  );

  return data;
};

export const getMyRentalRequests = async (): Promise<
  RentalRequest[]
> => {
  const { data } = await axiosInstance.get(
    "/rentals"
  );

  return data?.data ?? data;
};

export const getRentalRequestById = async (
  id: string
) => {
  const { data } = await axiosInstance.get(
    `/rentals/${id}`
  );

  return data?.data ?? data;
};