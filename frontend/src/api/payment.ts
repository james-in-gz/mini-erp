import request from "./request";

export interface CreatePaymentRequest {
    amount: number;
    method: string;
    remark?: string;
}

export function createPayment(
    orderId: number,
    data: CreatePaymentRequest
) {
    return request.post(
        `/orders/${orderId}/payments`,
        data
    );
}