import { getUserAddressByUser } from "@/apis/modules/api.user_address";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";
const moduleUserAddress = {
  state: () => ({
    listUserAddressByUser: [],
    userAddressCurrent: {},
  }),
  mutations: {
    setListUserAddressMutation(state, rows) {
      state.listUserAddressByUser = rows;
    },
    setUserAddressCurrent(state, data) {
      state.userAddressCurrent = data;
    },

    clearUserAddressCurrent(state) {
      state.userAddressCurrent = {};
    },
  },
  actions: {
    async setListUserAddressAction({ commit, dispatch }) {
      try {
        const result = await getUserAddressByUser();
        commit("setListUserAddressMutation", result.rows);
      } catch (err) {
        displayToast(
          dispatch,
          typeAlertBox.ERROR,
          `Có lỗi xảy ra ${err.message}`
        );
      }
    },
  },

  getters: {
    userAddressCurrent: (state) => state.userAddressCurrent,
  },
};

export default moduleUserAddress;
