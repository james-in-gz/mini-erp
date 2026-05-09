import  request  from './request';
import { BatchCheckResponse, Inventory, InventoryLog } from '@/types/inventory';

export const inventoryApi = {
  getBySKU: (skuId: number) => 
    request.get<Inventory>(`/inventory/${skuId}`),
  
  batchGet: (skuIds: number[]) => 
    request.post<Record<number, Inventory>>('/inventory/batch', { skuIds }),
  
  batchCheck: (items: { skuId: number; quantity: number }[]) => 
    request.post<BatchCheckResponse>('/inventory/batch-check', { items }),
  
  adjustStock: (skuId: number, quantity: number, remark: string) => 
    request.post('/inventory/adjust', { skuId, quantity, remark }),
  
  getLogs: (skuId: number, page: number = 1, pageSize: number = 20) => 
    request.get<{ items: InventoryLog[]; total: number }>(`/inventory/logs/${skuId}`, {
      params: { page, pageSize }
    }),
};