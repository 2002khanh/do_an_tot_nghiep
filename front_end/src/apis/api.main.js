import config from "@/configs/config";
import axios from "axios";

const axiosAPI = axios.create({
  baseURL: config.BACKEND_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  },
});

// Lưu trạng thái loading vào localStorage
const setLoading = (isLoading) => {
  localStorage.setItem("isLoading", JSON.stringify(isLoading));
};

// Interceptors: trước khi gửi data, header, ... thì phải chạy qua interceptors.
axiosAPI.interceptors.request.use(
  function (config) {
    // Bật loading trước khi gọi API
    setLoading(true);

    // Thêm Bearer token vào header của request
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Tắt loading khi có lỗi
    setLoading(false);
    return Promise.reject(error);
  }
);

// Set up để chỉ lấy về data trong response
axiosAPI.interceptors.response.use(
  function (response) {
    // Tắt loading khi nhận được response
    setLoading(false);
    return response.data.data;
  },
  function (error) {
    // Tắt loading khi có lỗi
    setLoading(false);
    return Promise.reject(error);
  }
);

export default axiosAPI;
