import axiosAPI from "../api.main";

export const setStaffToConversation = async (data) => {
  return await axiosAPI.patch("/conversations", data);
};


export const gettAllConversationByUser = async () => {
  return await axiosAPI.get("/conversations", );
};