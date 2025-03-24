import axiosAPI from "../api.main";

export const addProductToWishListApi = async (data) => {
  return await axiosAPI.post("/wishlist", data);
};

export const getProductWishListApi = async () => {
  return await axiosAPI.get("/wishlist");
};

export const deleteProductWishListApi = async (productId) => {
  return await axiosAPI.delete(`/wishlist/${productId}`);
};
