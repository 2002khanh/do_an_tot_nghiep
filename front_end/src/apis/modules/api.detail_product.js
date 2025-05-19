import axiosAPI from "../api.main";

export const createDetailProduct = async (data) => {
  return await axiosAPI.post("/detail-product", data);
};

export const deleteADetailProduct = async (productId) => {
  return await axiosAPI.delete(`/detail-product/${productId}`);
};
