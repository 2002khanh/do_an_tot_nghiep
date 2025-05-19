import { loginAuthApi, logoutAuthApi } from "@/apis/modules/api.auth";
import { getUserById } from "@/apis/modules/api.user";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";

const moduleAuth = {
  state: () => ({
    userLogin: {},
    isLogin: false,
    userId: "",
  }),
  mutations: {
    delUserLoginMutation(state) {
      state.userLogin = {};
      state.isLogin = false;
      state.userId = "";
    },

    setUserLogin(state, data) {
      const { id, username, email, role, avatar } = data;
      state.userLogin = {
        id,
        username,
        email,
        role,
        avatar,
      };
    },

    setUserLoginFromToken(state, data) {
      const { userId, user } = data;
      if (userId) {
        state.userLogin = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
        state.isLogin = true;
        state.userId = userId;
      } else {
        state.isLogin = false;
        state.userLogin = {};
        state.userId = "";
      }
    },
  },
  actions: {
    async loginAction({ dispatch }, { data, router }) {
      try {
        const { access_token } = await loginAuthApi(data);

        displayToast(dispatch, typeAlertBox.SUCCESS, "Đăng nhập thành công");

        localStorage.setItem("accessToken", access_token);

        dispatch("cart/setCartAction", null, { root: true });

        router.push("/home");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          "Thông tin tài khoản không chính xác"
        );
      }
    },

    async loginOauthAction({ dispatch }, { access_token, router }) {
      try {
        displayToast(dispatch, typeAlertBox.SUCCESS, "Đăng nhập thành công");

        localStorage.setItem("accessToken", access_token);

        dispatch("cart/setCartAction", null, { root: true });
        dispatch("wishList/setWishListAction", null, { root: true });

        router.push("/home");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          "Thông tin tài khoản không chính xác"
        );
      }
    },

    async logoutAction({ commit, dispatch }, router) {
      try {
        await logoutAuthApi();

        displayToast(dispatch, typeAlertBox.SUCCESS, "Đăng xuất thành công");

        localStorage.removeItem("accessToken");

        commit("delUserLoginMutation");

        dispatch("cart/setCartAction", null, { root: true });
        commit("wishList/clearCart", null, { root: true });

        router.push("/home");
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          "Đăng xuất không thành công"
        );
      }
    },

    async loadUserLoginByToken({ commit }) {
      let userId = null;
      let user = null;
      if (localStorage.getItem("accessToken")) {
        const res = await getUserById();
        userId = res.id || null;
        user = res;
      }
      commit("setUserLoginFromToken", {
        userId,
        user,
      });
    },
  },
};

export default moduleAuth;
