import request from "./request";

export const getAddresses = (customerId: number) => {
  return request.get(`/customers/${customerId}/addresses`).then(r => r.data);
};

export const createAddress = (customerId: number, data: any) => {
  return request.post(`/customers/${customerId}/addresses`, data);
};

export const setDefaultAddress = (id: number) => {
  return request.post(`/addresses/${id}/default`);
};