/**
 * 这是一个简单的 Axios 请求封装，包含了基础 URL 和请求/响应拦截器。
 * 请求拦截器会自动添加 JWT 令牌到请求头中（如果存在）。
 * 响应拦截器会处理 401 未授权错误，自动重定向到登录页面。
 */
import axios from "axios";

const request = axios.create({
  baseURL: "/api", // 你的 Go 后端
});

request.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      window.location.href = "/login";
    }
  }
);

export default request;