import request from "./request";

export const getProducts = async () => {
  const res = await request.get("/products");
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const getProductDetail = async (productId: number) => {
  const res = await request.get(`/products/${productId}`);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export const createProduct = async (data: any) => {
  const res = await request.post("/products", data);
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};