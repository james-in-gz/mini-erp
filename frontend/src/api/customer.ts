import request from "./request";
import { Customer, CustomerDetail } from "@/types/customer";

export const getCustomerDetail = async (id: number) => {
  const res = await request.get<CustomerDetail>(`/customers/${id}`);
  return res.data;
};

export const addCustomerNote = async (
  id: number,
  data: { content: string; next_follow_up_at?: string }
) => {
  return request.post(`/customers/${id}/notes`, data);
};

export interface CustomerListResponse {
  total: number;
  list: Customer[];
}

export const getCustomers = async (page = 1, pageSize = 10) => {
  const res = await request.get<CustomerListResponse>(
    `/customers?page=${page}&page_size=${pageSize}`
  );
  return res.data;
};

export const createCustomer = async (data: {
  name: string;
  phone: string;
  source?: string;
}) => {
  return request.post("/customers", data);
};