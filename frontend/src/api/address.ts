import request from "./request";

export const getAddresses = async (customerId: number) => {
  const res = await request.get(`/customers/${customerId}/addresses`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const createAddress = async (customerId: number, data: any) => {
  const res = await request.post(`/customers/${customerId}/addresses`, data);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const setDefaultAddress = async (id: number) => {
  const res = await request.post(`/addresses/${id}/default`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};