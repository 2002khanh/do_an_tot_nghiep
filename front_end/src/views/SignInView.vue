<template>
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow-2-strong" style="border-radius: 1rem">
          <div class="card-body p-5 text-center">
            <h3 class="mb-5">Đăng nhập</h3>

            <FormInput
              label="Email"
              type="email"
              v-model="userLogin.email"
              :error="validateForm.emailError"
              @blur="validateEmail"
            />

            <FormInput
              label="Mật khẩu"
              type="password"
              v-model="userLogin.password"
              :error="validateForm.passwordError"
              @blur="validatePassword"
            />

            <!-- Checkbox -->
            <!-- <div class="form-check d-flex justify-content-start mb-4">
              <input
                class="form-check-input ml-0"
                type="checkbox"
                value=""
                id="form1Example3"
              />
              <label class="form-check-label" for="form1Example3">
                Nhớ mật khẩu
              </label>
            </div> -->

            <button
              class="btn btn-primary btn-lg btn-block"
              type="submit"
              @click="handleSubmitLogin"
            >
              <span class="fs-15">Đăng nhập</span>
            </button>

            <hr class="my-4" />

            <GoogleLogin :callback="callback" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormInput from "@/components/client/share/FormInput.vue";
import { validateAllCaseFromField } from "@/utils/validateForm";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { loginOAuthGoogleApi, verifyTokenOauth } from "@/apis/modules/api.auth";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";

export default {
  components: {
    FormInput,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    const isInvalidForm = ref(false);

    const userLogin = reactive({
      email: "",
      password: "",
    });

    const callback = async (response) => {
      try {
        const result = await verifyTokenOauth(response.credential);
        store.dispatch("auth/loginOauthAction", {
          access_token: result.access_token,
          router,
        });
      } catch (err) {
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          err?.response?.data?.message || "Có lỗi xảy ra"
        );
      }
    };

    const validateForm = reactive({
      emailError: "",
      passwordError: "",
    });

    const validateEmail = () => {
      validateForm.emailError = validateAllCaseFromField(
        "email",
        userLogin.email
      );
    };

    const validatePassword = () => {
      validateForm.passwordError = validateAllCaseFromField(
        "password",
        userLogin.password
      );
    };

    const checkFieldsValidate = () => {
      validateEmail();
      validatePassword();
      isInvalidForm.value = Object.values(validateForm).some(
        (error) => error !== ""
      );
    };

    const handleSubmitLogin = () => {
      checkFieldsValidate();
      if (!isInvalidForm.value) {
        const data = {
          username: userLogin.email,
          password: userLogin.password,
        };

        store.dispatch("auth/loginAction", { data, router });
      }
    };

    const handleOauthGoogle = async () => {
      try {
        await loginOAuthGoogleApi();
      } catch (err) {
        console.log(err);
      }
    };

    return {
      userLogin,
      validateForm,
      validateEmail,
      validatePassword,
      handleSubmitLogin,
      handleOauthGoogle,
      callback,
    };
  },
};
</script>

<style>
.btn-block {
  display: block;
  width: 100%;
}
</style>
