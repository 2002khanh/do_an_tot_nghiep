import { createStore } from "vuex";
import moduleAuth from "@/store/modules/store.module.auth";
import moduleUser from "@/store/modules/store.module.user";
import moduleProduct from "@/store/modules/store.module.product";
import moduleCart from "@/store/modules/store.module.cart";
import moduleWishList from "@/store/modules/store.module.wishlist";
import moduleUserAddress from "@/store/modules/store.module.user_address";
export default createStore({
  state: {
    toasts: [],
    isAdminRoute: false,
  },
  mutations: {
    addToast: (state, toast) => {
      state.toasts.push(toast);
    },

    removeToast(state, id) {
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },

    setIsAdminRoute(state, bool) {
      state.isAdminRoute = bool;
    },
  },
  actions: {
    addToast({ commit }, toast) {
      commit("addToast", toast);
      setTimeout(() => {
        commit("removeToast", toast.id);
      }, 3000);
    },
  },
  getters: {
    getToasts: (state) => state.toasts,
  },
  modules: {
    product: {
      ...moduleProduct,
      namespaced: true,
    },
    auth: {
      ...moduleAuth,
      namespaced: true,
    },
    user: {
      ...moduleUser,
      namespaced: true,
    },
    cart: {
      ...moduleCart,
      namespaced: true,
    },
    userAddress: {
      ...moduleUserAddress,
      namespaced: true,
    },
    wishList: {
      ...moduleWishList,
      namespaced: true
    }
  },
});
