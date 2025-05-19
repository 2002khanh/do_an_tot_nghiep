import axiosAPI from "../api.main";

export const getAllSubcategory = async (params) => {
  return await axiosAPI.get("/subcategory", {
    params: params,
  });
};

export const getAllSubcateByCategorySlug = async (categoryId) => {
  return await axiosAPI.get(`/subcategory/find-subcate/${categoryId}`);
};

export const deleteASubcategory = async (subcategoryId) => {
  return await axiosAPI.delete(`/subcategory/${subcategoryId}`);
};

export const createASubcategory = async (data) => {
  return await axiosAPI.post(`/subcategory`, data);
};

export const updateASubcategory = async (subcategoryId, data) => {
  return await axiosAPI.patch(`/subcategory/${subcategoryId}`, data);
};

export const getASubcategory = async (subcategoryId) => {
  return await axiosAPI.get(`/subcategory/${subcategoryId}`);
};
