import { signUpUserApi } from "@/apis/modules/api.user";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";
const moduleUser = {
  state: () => ({}),
  mutations: {},
  actions: {
    async signUpAction({ dispatch }, { data, router }) {
      try {
        await signUpUserApi(data);

        displayToast(
          dispatch,
          typeAlertBox.SUCCESS,
          "Đăng ký tài khoản thành công"
        );

        router.push("/sign-in");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          err?.response?.data?.message || "Yêu cầu không hợp lệ"
        );
      }
    },
  },
};

export default moduleUser;
