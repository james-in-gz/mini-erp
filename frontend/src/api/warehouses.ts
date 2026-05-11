import request from "./request";

export const listWareHouses = async () => {
  const res = await request.get("/warehouses");
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    alert(res.data.message);
  }
};