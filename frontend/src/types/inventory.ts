export interface Inventory {
  id: number;
  skuId: number;
  stock: number;
  lockedStock: number;
  availableStock: number;
  updatedAt: string;
}

export interface InventoryLog {
  id: number;
  skuId: number;
  type: 'in' | 'out' | 'lock' | 'unlock' | 'adjust';
  changeValue: number;
  beforeStock: number;
  afterStock: number;
  refId?: number;
  refType?: string;
  remark: string;
  createdBy: string;
  createdAt: string;
}

export interface BatchCheckRequest {
  items: { skuId: number; quantity: number }[];
}

export interface BatchCheckResponse {
  allAvailable: boolean;
  items: Record<number, {
    available: boolean;
    stock: number;
    message?: string;
  }>;
}