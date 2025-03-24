import VueJwtDecode from "vue-jwt-decode";

export const verifyToken = () => {
  let token = localStorage.getItem("accessToken");
  if (token) {
    let decoded = VueJwtDecode.decode(token);
    return decoded;
  }

  return false;
};
