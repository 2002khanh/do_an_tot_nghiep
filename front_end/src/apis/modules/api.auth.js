import axiosAPI from "../api.main";

export const loginAuthApi = async (data) => {
  return await axiosAPI.post("/auth/login", data);
};

export const loginOAuthGoogleApi = async (data) => {
  return await axiosAPI.get("/auth/google/login", data);
};

export const verifyTokenOauth = async (data) => {
  return await axiosAPI.post("/auth/verify", {
    token: data,
  });
};

export const logoutAuthApi = async () => {
  return await axiosAPI.post("/auth/logout");
};
