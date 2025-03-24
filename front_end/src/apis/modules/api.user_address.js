import axiosAPI from "../api.main";

export const createUserAddress = async (data) => {
  return await axiosAPI.post("/user-address", data);
};

export const updateUserAddress = async (data, id) => {
  return await axiosAPI.patch(`/user-address/${id}`, data);
};

export const getUserAddressByUser = async () => {
  return await axiosAPI.get("/user-address/user");
};

export const deleteUserAddressById = async (userAddressId) => {
  return await axiosAPI.delete(`/user-address/${userAddressId}`);
};
