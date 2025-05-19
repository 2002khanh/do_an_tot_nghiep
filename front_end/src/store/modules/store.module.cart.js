import { getCartByUserId } from "@/apis/modules/api.cart";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";
import { verifyToken } from "@/utils/jsonwebtoken";
const moduleCart = {
  state: () => ({
    totalProductOfCart: 0,
    listProductOfCart: [],
  }),
  mutations: {
    setTotalMutation(state, total) {
      state.totalProductOfCart = total;
    },

    setListProductMutation(state, rows) {
      state.listProductOfCart = rows;
    },

    setQuantityOfProduct(state, { quantity, productId }) {
      const product = state.listProductOfCart.find(
        (item) => item.detailProduct.id === productId
      );

      if (product) {
        product.quantity = quantity;
      }
    },

    clearCart(state) {
      state.totalProductOfCart = 0;
      state.listProductOfCart = [];
    },
  },
  actions: {
    async setCartAction({ commit, dispatch }) {
      try {
        if (localStorage.getItem("accessToken")) {
          const userDecoded = verifyToken();
          const result = await getCartByUserId(userDecoded.id);

          commit("setTotalMutation", result.total);
          commit("setListProductMutation", result.rows);
        } else {
          commit("setTotalMutation", 0);
          commit("setListProductMutation", []);
        }
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          `Có lỗi xảy ra ${err.message}`
        );
      }
    },
  },
};

export default moduleCart;
