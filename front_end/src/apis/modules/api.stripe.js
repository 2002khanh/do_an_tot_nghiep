import axiosAPI from "../api.main";

export const createSessionStripe = async (data) => {
  return await axiosAPI.post("/stripe/payment", data);
};
