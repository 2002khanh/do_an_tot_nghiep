import axiosAPI from "../api.main";

export const signUpUserApi = async (data) => {
  return await axiosAPI.post("/users/sign-up", data);
};

export const createUserAdminApi = async (data) => {
  return await axiosAPI.post("/users/create", data);
};

export const getAllUserApi = async (params) => {
  return await axiosAPI.get("/users", {
    params: params,
  });
};

export const updateUserApi = async (data) => {
  return await axiosAPI.put("/users", data);
};

export const updateUserAdminApi = async (data) => {
  return await axiosAPI.patch("/users", data);
};

export const getUserById = async () => {
  return await axiosAPI.get("/users/findOne");
};

export const getUserAdminById = async (userId) => {
  return await axiosAPI.get(`/users/${userId}`);
};

export const getTotalAccount = async () => {
  return await axiosAPI.get("/users/totalAccount");
};

export const uploadAvatarApi = async (data) => {
  return await axiosAPI.post("/users/upload-avatar", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
