import request from "./request";

const getDashboard = () => {
  return request.get("/dashboard");
};

export default getDashboard;