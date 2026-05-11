import request, { ApiResponse } from "./request";
import { Warehouse, CreateWarehouseDto, UpdateWarehouseDto } from '@/types/warehouse';

export const listWareHouses = async () => {
  const res = await request.get("/warehouses");
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    alert(res.data.message);
  }
};





export const warehouseApi = {
  // 获取所有仓库
  getAll: async (): Promise<Warehouse[]> => {
    const response = await request.get<ApiResponse<Warehouse[]>>("/warehouses");
    if(response.data.code === 0){
        return response.data.data;
    }else{
        return [];
    }
  },

  // 创建仓库
  create: async (data: CreateWarehouseDto): Promise<Warehouse> => {
    const response = await request.post<Warehouse>("/warehouses", data);
    return response.data;
  },

  // 更新仓库
  update: async (id: number, data: UpdateWarehouseDto): Promise<Warehouse> => {
    const response = await request.put<Warehouse>(`/warehouses/${id}`, data);
    return response.data;
  },

  // 删除仓库
  delete: async (id: number): Promise<void> => {
    await request.delete(`/warehouses/${id}`);
  },
};
