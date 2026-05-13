import request from "./request";

export const getWaybillLabel = (waybillNo: string) => {
  return request.get(`/shipments/express/label`, {
    params: { waybillNo },
  });
};