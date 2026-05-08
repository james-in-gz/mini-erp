import request from "./request";

export const getOrders = async () => {
  const res = await request.get("/orders");
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
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
