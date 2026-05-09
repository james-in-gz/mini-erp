  

  export interface Shipment  {
    id: number;
    orderId: number;
    trackingNumber: string;
    carrier: string;

    receiverName: string;
    receiverPhone: string;
    receiverProvince: string;
    receiverCity: string;
    receiverDistrict: string;
    receiverAddress: string;

    shippedAt: Date;
    status: string;

    shipmentItems?: ShipmentItem[];
}

  export interface ShipmentItem {
    id: number;
    orderItemId: number;
    quantity: number;
    name: string;
    sku: string;
  }