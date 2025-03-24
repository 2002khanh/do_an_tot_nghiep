import axiosAPI from "../api.main";

export const getAllcategory = async () => {
  return await axiosAPI.get("/category");
};
