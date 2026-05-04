import request from "./request";

export const getProducts = async () => {
  return request.get("/products").then((res) => res.data);
};

export const getProductDetail = async (productId: number) => {
  return request.get(`/products/${productId}`).then((res) => res.data);
};

export const createProduct = async (data: any) => {
  return request.post("/products", data);
};