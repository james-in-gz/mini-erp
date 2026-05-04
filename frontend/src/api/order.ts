import request from "./request";

export const getOrders = async () => {
  return request.get("/orders").then((res) => res.data);
};

export const createShipment = async (orderId: number, shipmentData: any) => {
  return request.post(`/orders/${orderId}/shipments`, shipmentData).then((res) => res.data);
};

export const listShipments = async (orderId: number) => {
  return request.get(`/orders/${orderId}/shipments`).then((res) => res.data);
};

export const getOrderDetail = async (orderId: number) => {
  return request.get(`/orders/${orderId}`).then((res) => res.data);
}

export const createOrder = async (orderData: any) => {
  return request.post("/orders", orderData).then((res) => res.data);
};