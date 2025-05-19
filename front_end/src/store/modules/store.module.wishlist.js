import { getProductWishListApi } from "@/apis/modules/api.wish_list";

const moduleWishlist = {
  state: () => ({
    totalProductOfWishList: 0,
  }),
  mutations: {
    setQuantityOfProduct(state, quantity) {
      state.totalProductOfWishList = quantity;
    },

    clearCart(state) {
      state.totalProductOfWishList = 0;
    },
  },
  actions: {
    async setWishListAction({ commit }) {
      try {
        if (localStorage.getItem("accessToken")) {
          const result = await getProductWishListApi();
          commit("setQuantityOfProduct", result.total);
        } else {
          commit("clearCart");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};

export default moduleWishlist;
