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
/**
 * 获取SKU详情
 */
export const getSKUDetail = (id: string) => {
    return request.get(`/skus/${id}`).then(res => {
        if (res.data.code === 0) {
            var sku = res.data.data;
            const specsObject =
                typeof sku.specs === "string"
                    ? JSON.parse(sku.specs)
                    : sku.specs || {};
            const specs = Object.entries(specsObject || {}).map(([name, value]) => ({
                name: name,
                value:value
            }));
            return { ...res.data.data, specs };
        } else {
            throw new Error(res.data.message);
        }
    });
};

/**
 * 更新SKU
 */
export const updateSKU = (
    id: string,
    data: any
) => {
    return request.put(`/skus/${id}`, data).then(res => {
        if (res.data.code === 0) {
            return res.data.data;
        } else {
            throw new Error(res.data.message);
        }
    });
};

export function deleteSKU(id: string | number) {
  return request.delete(`/skus/${id}`);
}