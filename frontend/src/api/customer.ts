import request from "./request";
import { Customer, CustomerDetail } from "@/types/customer";

export const getCustomerDetail = async (id: number) => {
  const res = await request.get(`/customers/${id}`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const addCustomerNote = async (
  id: number,
  data: { content: string; nextFollowUpAt: string | null }
) => {
  const res = await request.post(`/customers/${id}/notes`, data);
  if (res.data.code !== 0) {
    throw new Error(res.data.message);
  }
  return res.data.data;
};

export interface CustomerListResponse {
  total: number;
  list: Customer[];
}

export const getCustomers = async (page = 1, pageSize = 10, searchText?: string) => {
  const res = await request.get(
    `/customers?page=${page}&page_size=${pageSize}${searchText ? `&search=${searchText}` : ''}`
  );
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const createCustomer = async (data: {
  name: string;
  phone: string;
  source?: string;
}) => {
  const res = await request.post("/customers", data);
  if (res.data.code !== 0) {
    throw new Error(res.data.message);
  }
  return res.data.data;
};

export async function updateCustomerBaseInfo(id: number, data: any) {
  const res = await request.put(`/customers/${id}`, data);
  if (res.data.code !== 0) {
    throw new Error(res.data.message);
  }
  return res.data.data;
}

export async function updateCustomerStatus(
  id: number,
  data: { status: string }
) {
  const res = await request.put(`/customers/${id}/status`, data);
  if (res.data.code !== 0) {
    throw new Error(res.data.message);
  }
  return res.data.data;
}

export const getFollowUps = async () => {
  const res = await request.get("/customers/follow-ups");
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const searchCustomers = async (keyword: string) => {
  const res = await request.get("/customers/search", {
    params: { keyword },
  });
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};