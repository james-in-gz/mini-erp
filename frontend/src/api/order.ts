import request from "./request";

interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export const getOrders = async (params: GetOrdersParams) => {
  const res = await request.get("/orders", {
    params,
  });

  if (res.data.code === 0) {
    return res.data.data;
  }

  throw new Error(res.data.message);
};

export const createShipment = async (orderId: number, shipmentData: any) => {
  const res = await request.post(`/orders/${orderId}/shipments`, shipmentData);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const listShipments = async (orderId: number) => {
  const res = await request.get(`/orders/${orderId}/shipments`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const getOrderDetail = async (orderId: number) => {
  const res = await request.get(`/orders/${orderId}`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
}

export const createOrder = async (orderData: any) => {
  const res = await request.post("/orders", orderData);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const updateOrderAddress = async (orderId: number, addressData: any) => {
  const res = await request.put(`/orders/${orderId}/address`, addressData);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const cancelOrder = async (orderId: number) => {
  const res = await request.post(`/orders/${orderId}/cancel`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const updateOrderNextDeliveryTime = async (orderId: number, shipTime: string | null) => {
  const res = await request.put(`/orders/${orderId}/next-delivery-time`, { nextDeliveryAt: shipTime });
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};