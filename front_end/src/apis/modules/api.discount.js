import axiosAPI from "../api.main";

export const createADiscount = async (data) => {
  return await axiosAPI.post("/discount", data);
};

export const deleteADiscount = async (discountId) => {
  return await axiosAPI.delete(`/discount/${discountId}`);
};

export const getAllDiscount = async (params) => {
  return await axiosAPI.get("/discount", {
    params,
  });
};

export const updateADiscount = async (data, discountId) => {
  return await axiosAPI.patch(`/discount/${discountId}`, data);
};
