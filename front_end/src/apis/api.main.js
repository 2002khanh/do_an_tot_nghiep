import config from "@/configs/config";
import axios from "axios";

const axiosAPI = axios.create({
  baseURL: config.BACKEND_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

// Interceptors: trước khi gửi data, header, ... thì phải chạy qua interceptors.
// Nó nằm trung gian từ lúc gọi API tới lúc tới server
axiosAPI.interceptors.request.use(
  function (config) {
    // Thêm Bearer token vào header của request
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Set up để chỉ lấy về data trong response
axiosAPI.interceptors.response.use(
  function (response) {
    return response.data.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosAPI;
