import request from "./request";

export const getSKUs = (productId: number) => {
  return request.get(`products/${productId}/skus`).then(res => {
    if (res.data.code === 0) {
      return res.data.data;
    } else {
      throw new Error(res.data.message);
    }
  });
}

export const createSKU = (productId: number, data: any) => {
    return request.post(`products/${productId}/skus`, data).then(res => {
        if (res.data.code === 0) {
            return res.data.data;
        } else {
            throw new Error(res.data.message);
        }
    });
}

export const generateSKUs = (productId: number, data: any) => {
    return request.post(`products/${productId}/skus/generate`, data).then(res => {
        if (res.data.code === 0) {
            return res.data.data;
        } else {
            throw new Error(res.data.message);
        }
    });
}