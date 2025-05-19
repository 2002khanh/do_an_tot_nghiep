<template>
  <!-- Change Password -->
  <div class="dashboard-content">
    <div class="row">
      <div
        class="col-lg-12 col-md-12"
        style="padding-left: 0; padding-right: 0"
      >
        <div class="dashboard-list-box margin-top-0">
          <h4 class="d-flex justify-content-between align-items-center">
            Danh sách địa chỉ nhận hàng
            <modal-create-user-address></modal-create-user-address>
          </h4>

          <div class="row" v-if="listUserAddressByUser.length > 0">
            <div
              v-for="(item, index) in listUserAddressByUser"
              :key="index"
              class="address-item col-md-4"
            >
              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link icon" @click.prevent>
                  <MenuOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0">
                      <modal-confirm-del-user-address
                        :id="item.id"
                      ></modal-confirm-del-user-address>
                    </a-menu-item>
                    <a-menu-item key="1">
                      <modal-update-user-address
                        :userAddress="item"
                      ></modal-update-user-address>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              <div class="d-flex">
                <div class="address-details">
                  <!-- <i class="fa-regular fa-address-card"></i> -->
                  <ul class="address-info">
                    <li class="li_header">Địa chỉ {{ index + 1 }}</li>
                    <li>{{ item.username }}</li>
                    <li>Địa chỉ: {{ item.address }}</li>
                    <li>SĐT: {{ item.phone }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div style="margin: 30px 0"></div>
          <template v-if="listUserAddressByUser.length === 0">
            <a-empty description="Bạn chưa có địa chỉ nhận hàng nào" />
            <div style="margin: 100px 0"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { MenuOutlined } from "@ant-design/icons-vue";
import ModalConfirmDelUserAddress from "@/components/client/my-information/modal.confirm_del_user_address.vue";
import ModalCreateUserAddress from "@/components/client/my-information/modal.create_user_address.vue";
import ModalUpdateUserAddress from "@/components/client/my-information/modal.update_user_address.vue";

export default {
  components: {
    ModalConfirmDelUserAddress,
    ModalCreateUserAddress,
    ModalUpdateUserAddress,
    MenuOutlined,
  },
  setup() {
    const store = useStore();

    store.dispatch("userAddress/setListUserAddressAction");

    const listUserAddressByUser = computed(
      () => store.state.userAddress.listUserAddressByUser
    );

    return {
      listUserAddressByUser,
    };
  },
};
</script>

<style scoped>
li {
  padding: 4px 0 !important;
  border: none !important;
  word-wrap: break-word; /* Đảm bảo văn bản sẽ bọc khi cần thiết */
  word-break: break-all; /* Đảm bảo văn bản sẽ bọc khi cần thiết */
}

.icon {
  z-index: 100;
  position: absolute;
  right: 18px;
  top: 12px;
  font-size: 18px;
  cursor: pointer;
}

.li_header {
  font-size: 16px;
  font-weight: 600;
}

.row {
  margin: 0 !important;
}

.title {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.address-item {
  padding: 16px;
  overflow: hidden;
  justify-content: space-between;
  border-radius: 8px;
  border: 1px double #ccc;
  flex: 0 0 calc(33.333% - 48px);
  box-sizing: border-box;
  margin: 24px;
  margin-top: 24px;
}

.address-details {
  display: flex;
}

.address-info {
  display: flex;
  flex-direction: column;
  margin-left: 8px; /* Thêm khoảng cách giữa icon và thông tin */
}

.address-actions {
  display: flex;
  flex-direction: column;
  align-items: center; /* Căn giữa các nút */
}

.spacer {
  margin-top: 12px;
}
</style>
