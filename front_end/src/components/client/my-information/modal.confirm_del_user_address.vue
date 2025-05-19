<template>
  <div>
    <span type="primary" @click="showModal">Xóa</span>
    <a-modal
      v-model:open="open"
      title="Thông báo"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      ok-text="Xác nhận"
      cancel-text="Hủy bỏ"
    >
      <p>Bạn có chắc chắn muốn xóa không ?</p>
    </a-modal>
  </div>
</template>
<script setup>
import { deleteUserAddressById } from "@/apis/modules/api.user_address";
import { defineProps, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const open = ref(false);
const store = useStore();
const confirmLoading = ref(false);
const showModal = () => {
  open.value = true;
};
const handleOk = async () => {
  await deleteUserAddressById(props.id);

  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
    store.dispatch("userAddress/setListUserAddressAction");
  }, 1000);
};
</script>
