import axiosAPI from "../api.main";

export const getAllMessageByUser = async () => {
  return await axiosAPI.get("/message");
};
