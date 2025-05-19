<template>
  <div>
    <a-button type="primary" @click="showModal">Địa chỉ của tôi</a-button>
    <a-modal
      v-model:open="open"
      title="Danh sách địa chỉ nhận hàng"
      @ok="handleOk"
      ok-text="Xác nhận"
      cancel-text="Hủy bỏ"
    >
      <a-radio-group v-model:value="value">
        <a-radio
          :style="radioStyle"
          v-for="(item, index) in listUserAddressByUser"
          :key="index"
          :value="item"
          class="radio-item"
        >
          <div style="margin-top: 18px"></div>
          <p>Tên người nhận: {{ item.username }}</p>
          <p>Số điện thoại: {{ item.phone }}</p>
          <p>Địa chỉ: {{ item.address }}</p>
          <div style="margin-bottom: 18px"></div>
        </a-radio>
      </a-radio-group>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
const value = ref(1);
const radioStyle = reactive({
  display: "flex",
  height: "auto",
  lineHeight: "auto",
});
import { useStore } from "vuex";
const open = ref(false);
const store = useStore();

const listUserAddressByUser = computed(
  () => store.state.userAddress.listUserAddressByUser
);

store.dispatch("userAddress/setListUserAddressAction");

const showModal = () => {
  open.value = true;
};
const handleOk = () => {
  store.commit("userAddress/setUserAddressCurrent", value.value);
  open.value = false;
};
</script>

<style scoped>
.radio-item {
  max-width: 100%;
}

.radio-item p {
  margin: 0;
  overflow-wrap: break-word;
}

.radio-item + .radio-item {
  border-top: 1px solid #ccc;
}
</style>
