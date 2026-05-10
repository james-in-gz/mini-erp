import { Shipment, ShipmentItem } from "./shipment";

export interface Order  {
    id: number;
    orderNo: string;
    customer: {
        id: number;
        name: string;
    };
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    paidAmount: number;
    createAt: Date;
    nextDeliveryAt?: Date;

    items: OrderItem[];

    defaultName?: string;
    defaultPhone?: string;

    defaultProvince?: string;
    defaultCity?: string;
    defaultDistrict?: string;
    defaultAddress?: string;

    shipments?: Shipment[];
}


export interface OrderItem {
	id: number;
	orderId: number;
	skuId: number;
	sku: string;
	skuCode: string;
	skuName: string;
	quantity: number;
	price: number;
	subtotal: number;
	shippedQuantity: number;
	createAt: Date;
}
