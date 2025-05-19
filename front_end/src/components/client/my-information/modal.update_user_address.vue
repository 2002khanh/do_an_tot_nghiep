<template>
  <div>
    <span type="primary" @click="showModal">Thay đổi</span>
    <a-modal
      v-model:open="open"
      title="Thông báo"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      ok-text="Xác nhận"
      cancel-text="Hủy bỏ"
    >
      <div style="margin: 24px 0" />
      <label>Họ tên</label>
      <a-textarea
        v-model:value="username"
        placeholder="Lưu Tuấn Thành"
        auto-size
      />
      <div v-if="errors.username" style="color: red">{{ errors.username }}</div>
      <div style="margin: 24px 0" />

      <label>Số điện thoại</label>
      <a-textarea v-model:value="phone" placeholder="123456789" auto-size />
      <div v-if="errors.phone" style="color: red">{{ errors.phone }}</div>
      <div style="margin: 24px 0" />

      <label>Địa chỉ nhận hàng</label>
      <a-textarea
        v-model:value="address"
        placeholder="Minh Khai, Bắc Từ Liêm, Hà Nội"
        :auto-size="{ minRows: 2, maxRows: 5 }"
      />
      <div v-if="errors.address" style="color: red">{{ errors.address }}</div>
    </a-modal>
  </div>
</template>
<script setup>
import { updateUserAddress } from "@/apis/modules/api.user_address";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";
import { defineProps, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  userAddress: {
    type: Object,
    required: true,
  },
});

const username = ref(props.userAddress.username);
const phone = ref(props.userAddress.phone);
const address = ref(props.userAddress.address);

const errors = ref({
  username: "",
  phone: "",
  address: "",
});

const open = ref(false);
const store = useStore();
const confirmLoading = ref(false);
const showModal = () => {
  open.value = true;
};
const handleOk = async () => {
  errors.value = { username: "", phone: "", address: "" };
  let valid = true;

  if (!username.value) {
    errors.value.username = "Họ tên là bắt buộc.";
    valid = false;
  }

  if (!phone.value) {
    errors.value.phone = "Số điện thoại là bắt buộc.";
    valid = false;
  } else if (!/^\d+$/.test(phone.value)) {
    errors.value.phone = "Số điện thoại không hợp lệ.";
    valid = false;
  }

  if (!address.value) {
    errors.value.address = "Địa chỉ nhận hàng là bắt buộc.";
    valid = false;
  }

  if (valid) {
    try {
      confirmLoading.value = true;
      await updateUserAddress(
        {
          username: username.value,
          phone: phone.value,
          address: address.value,
        },
        props.userAddress.id
      );

      setTimeout(() => {
        open.value = false;
        confirmLoading.value = false;
        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Cập nhật thành công"
        );

        store.dispatch("userAddress/setListUserAddressAction");

        username.value = "";
        phone.value = "";
        address.value = "";
      }, 1000);
    } catch (error) {
      displayToast(
        store.dispatch,
        typeAlertBox.ERROR,
        "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setTimeout(() => {
        open.value = false;
        confirmLoading.value = false;
        store.dispatch("userAddress/setListUserAddressAction");
      }, 1000);
    }
  }
};
</script>
