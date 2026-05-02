import request from "./request";
import { CustomerDetail } from "@/types/customer";

export const getCustomerDetail = async (id: number) => {
  const res = await request.get<CustomerDetail>(`/api/customers/${id}`);
  return res.data;
};

export const addCustomerNote = async (
  id: number,
  data: { content: string; next_follow_up_at?: string }
) => {
  return request.post(`/api/customers/${id}/notes`, data);
};
