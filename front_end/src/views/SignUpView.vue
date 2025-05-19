<template>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow-2-strong" style="border-radius: 1rem">
          <div class="card-body p-5 text-center">
            <h3 class="mb-5">Đăng ký</h3>
            <FormInput
              label="Email"
              type="email"
              v-model="userRegister.email"
              :error="validateForm.emailError"
              @blur="validateEmail"
            />
            <FormInput
              label="Tên người dùng"
              type="text"
              v-model="userRegister.username"
              :error="validateForm.nameError"
              @blur="validateUsername"
            />
            <FormInput
              label="Mật khẩu"
              type="password"
              v-model="userRegister.password"
              :error="validateForm.passwordError"
              @blur="validatePassword"
            />
            <FormInput
              label="Nhập lại mật khẩu"
              type="password"
              v-model="userRegister.rePassword"
              :error="validateForm.rePasswordError"
              @blur="validateRePassword"
            />
            <button
              class="btn btn-primary btn-lg btn-block"
              type="submit"
              @click="handleSubmitRegister"
            >
              <span class="fs-16"> Đăng ký</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { validateAllCaseFromField } from "@/utils/validateForm";
import FormInput from "@/components/client/share/FormInput.vue";

export default {
  components: {
    FormInput,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isInvalidForm = ref(false);
    const userRegister = reactive({
      email: "",
      username: "",
      password: "",
      rePassword: "",
    });

    const validateForm = reactive({
      emailError: "",
      nameError: "",
      passwordError: "",
      rePasswordError: "",
    });

    const validateEmail = () => {
      validateForm.emailError = validateAllCaseFromField(
        "email",
        userRegister.email
      );
    };

    const validateUsername = () => {
      validateForm.nameError = validateAllCaseFromField(
        "name",
        userRegister.username
      );
    };

    const validatePassword = () => {
      validateForm.passwordError = validateAllCaseFromField(
        "password",
        userRegister.password
      );
      checkPasswordMatch();
    };

    const validateRePassword = () => {
      validateForm.rePasswordError = validateAllCaseFromField(
        "rePassword",
        userRegister.rePassword
      );
      checkPasswordMatch();
    };

    const checkPasswordMatch = () => {
      if (
        !validateForm.passwordError &&
        !validateForm.rePasswordError &&
        userRegister.password &&
        userRegister.rePassword
      ) {
        validateForm.rePasswordError =
          userRegister.password !== userRegister.rePassword
            ? "Mật khẩu nhập lại không khớp"
            : "";
      }
    };

    const checkFieldsValidate = () => {
      validateUsername();
      validateEmail();
      validatePassword();
      validateRePassword();
      isInvalidForm.value = Object.values(validateForm).some(
        (error) => error !== ""
      );
    };

    const handleSubmitRegister = () => {
      checkFieldsValidate();
      if (!isInvalidForm.value) {
        if (userRegister.password === userRegister.rePassword) {
          const data = {
            username: userRegister.username,
            email: userRegister.email,
            password: userRegister.password,
          };
          store.dispatch("user/signUpAction", { data, router });
        }
      }
    };

    return {
      userRegister,
      validateForm,
      validateEmail,
      validateUsername,
      validatePassword,
      validateRePassword,
      handleSubmitRegister,
    };
  },
};
</script>

<style scoped>
.btn-block {
  display: block;
  width: 100%;
}

.msg-err {
  text-align: left;
  margin-top: 4px;
  display: block;
}
</style>
