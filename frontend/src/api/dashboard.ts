import request from "./request";

export const getDashboard = async () => {
  const res = await request.get("/dashboard");
  if (res.data.code === 0) {
    return res.data.data;
  } else {
    throw new Error(res.data.message);
  }
};

export default getDashboard;