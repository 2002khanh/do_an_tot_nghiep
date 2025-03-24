import axiosAPI from "../api.main";

export const getAllProduct = async (params) => {
  return await axiosAPI.get("/products", {
    params: params,
  });
};

export const getDetailProduct = async (id) => {
  return await axiosAPI.get(`products/${id}`);
};

export const uploadImageProduct = async (data) => {
  return await axiosAPI.post("/products/upload-image", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createAProduct = async (data) => {
  return await axiosAPI.post("/products", data);
};

export const deleteAProduct = async (productId) => {
  return await axiosAPI.delete(`/products/${productId}`);
};

export const updateAProduct = async (productId, data) => {
  return await axiosAPI.patch(`/products/${productId}`, data);
};

export const getTotalProduct = async () => {
  return await axiosAPI.get("/products/totalProduct");
};

export const getAllProductByAmin = async (params) => {
  return await axiosAPI.get("/products/allProduct", {
    params: params,
  });
};
