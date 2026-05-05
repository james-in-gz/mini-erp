import request from "./request";
import { Customer, CustomerDetail } from "@/types/customer";

export const getCustomerDetail = async (id: number) => {
  const res = await request.get<CustomerDetail>(`/customers/${id}`);
  return res.data;
};

export const addCustomerNote = async (
  id: number,
  data: { content: string; nextFollowUpAt: string | null }
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

export async function updateCustomerBaseInfo(id: number, data: any) {
  return request.put(`/customers/${id}`, data);
}

export async function updateCustomerStatus(
  id: number,
  data: { status: string }
) {
  return request.put(`/customers/${id}/status`, data);
}

export const getFollowUps = async () => {
  const res = await request.get("/customers/follow-ups");
  return res.data;
};

export const searchCustomers = (keyword: string) =>
  request.get("/customers/search", {
    params: { keyword },
  });