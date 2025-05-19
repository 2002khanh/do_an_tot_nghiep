<!-- src/components/AddUser.vue -->
<template>
  <a-modal
    v-model:open="visible"
    title="Thêm mới tài khoản"
    ok-text="Create"
    cancel-text="Cancel"
    @ok="onOkAdd"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      name="form_in_modal"
    >
      <a-form-item
        name="Username"
        label="Họ tên"
        :rules="[
          {
            required: true,
            message: 'Họ tên là bắt buộc!',
          },
        ]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-form-item
        name="email"
        label="Email"
        :rules="[
          {
            required: true,
            type: 'email',
            message: 'Email là bắt buộc',
          },
        ]"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>
      <a-form-item
        name="Password"
        label="Mật khẩu"
        :rules="[
          {
            required: true,
            message: 'Mật khẩu là bắt buộc!',
          },
        ]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, toRaw } from "vue";
import { signUpUserApi } from "@/apis/modules/api.user";
import { message } from "ant-design-vue";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["update:visible"]);

const formRef = ref();
const formState = reactive({
  username: "",
  email: "",
  role: "USER",
  password: "",
});

const onOkAdd = async () => {
  try {
    await formRef.value.validateFields();
    emit("update:visible", false);

    const data = toRaw(formState);

    await signUpUserApi(data);
    message.success("Thêm tài khoản thành công");

    formRef.value.resetFields();
  } catch (error) {
    console.log(error);
  }
};
</script>
