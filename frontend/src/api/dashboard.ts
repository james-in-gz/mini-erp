import request from "./request";

export const getDashboard = async () => {
  return (await request.get("/dashboard")).data;
};

export default getDashboard;