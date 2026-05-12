
export interface Warehouse  {
  id: number;

  name: string;

  contactName: string;

  phone: string;

  province: string;

  city: string;

  district: string;

  address: string;
};


export interface CreateWarehouseDto {
  name: string;
  contactName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
}

export type UpdateWarehouseDto = Partial<CreateWarehouseDto>;