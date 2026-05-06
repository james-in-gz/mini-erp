/**
 * auth.ts - 认证相关的API请求
 * 包含登录接口的实现
 */
import request from "./request";

export const login = (username: string, password: string) => {
    return request.post("/login", { username, password })
        .then(res => {
            if (res.data.code === 0) {
                return res.data.data;
            } else {
                throw new Error(res.data.message);
            }
        });
};