import axiosAPI from "../api.main";

export const createACart = async (data) => {
  const result = await axiosAPI.post("/cart", data);
  return result;
};

export const updateACart = async (data) => {
  const { cartId, quantity } = data;
  return await axiosAPI.patch(`/cart/${cartId}`, { quantity });
};

export const getCartByUserId = async (data) => {
  return await axiosAPI.get("/cart/user", data);
};

export const deleteProductOfCart = async (productId) => {
  return await axiosAPI.delete(`/cart/product/${productId}`);
};
