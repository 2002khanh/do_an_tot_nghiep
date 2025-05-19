<template>
  <div class="dashboard-content">
    <div class="row">
      <!-- Profile -->
      <div class="col-lg-6 col-md-12">
        <div class="dashboard-list-box margin-top-0">
          <h4 class="gray">Thông tin cá nhân</h4>
          <div class="dashboard-list-box-static">
            <!-- Details -->

            <div class="my-profile">
              <!-- upload file -->
              <label>Ảnh đại diện</label>
              <a-upload
                v-model:file-list="fileList"
                :before-upload="beforeUpload"
                list-type="picture"
                :max-count="1"
              >
                <a-button>
                  <upload-outlined></upload-outlined>
                  Tải ảnh lên
                </a-button>
              </a-upload>
            </div>

            <div class="my-profile">
              <label>Email</label>
              <input
                class="input-custom"
                :value="userLogin.email"
                type="text"
                readonly
              />

              <label>Họ tên</label>
              <input class="input-custom" v-model="username" type="text" />

              <!-- <label>Email</label>
              <input class="input-custom" value="tom@example.com" type="text" /> -->

              <button
                class="btn btn-primary btn-lg btn-block"
                type="submit"
                @click="handleSaveChangeInfo"
              >
                <span class="fs-15">Lưu lại thay đổi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Change password -->
      <div class="col-lg-6 col-md-12">
        <div class="dashboard-list-box margin-top-0">
          <h4 class="gray">Cập nhật mật khẩu</h4>
          <div class="dashboard-list-box-static">
            <div class="my-profile">
              <label>Nhập mật khẩu cũ</label>
              <input class="input-custom" type="text" />

              <label>Nhập mật khẩu mới</label>
              <input class="input-custom" type="text" />

              <label>Nhập lại mật khẩu mới</label>
              <input class="input-custom" type="text" />

              <!-- <label>Email</label>
              <input class="input-custom" value="tom@example.com" type="text" /> -->

              <button
                class="btn btn-primary btn-lg btn-block"
                type="submit"
                @click="handleSaveChange"
              >
                <span class="fs-15">Cập nhật mật khẩu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import {
  getUserById,
  updateUserApi,
  uploadAvatarApi,
} from "@/apis/modules/api.user";
import displayToast from "@/utils/handleToast";
import { typeAlertBox } from "@/constants/enum";

export default {
  components: {},

  setup() {
    const store = useStore();

    const urlImage = ref("");
    const username = ref("");
    const fileList = ref([]);

    const userLogin = computed(() => store.state.auth.userLogin);

    const listUserAddressByUser = computed(
      () => store.state.userAddress.listUserAddressByUser
    );

    const fetchData = async () => {
      const response = await getUserById();
      store.commit("auth/setUserLogin", response);
    };

    onMounted(() => {
      fetchData();
    });

    const handleSaveChangeInfo = async () => {
      try {
        const requestData = {};

        if (urlImage.value !== "") {
          requestData.avatar = urlImage.value;
        }

        if (username.value !== "") {
          requestData.username = username.value;
        }

        const response = await updateUserApi(requestData);

        if (response.urlImage) {
          urlImage.value = response.urlImage;
        }

        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Cập nhật thông tin thành công"
        );

        fetchData();
      } catch (err) {
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          err?.response?.data?.message || "Có lỗi xảy ra"
        );
      }
    };

    const beforeUpload = async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await uploadAvatarApi(formData);

        if (response.urlImage) {
          urlImage.value = response.urlImage;
          fileList.value = [{ ...file, url: response.urlImage }];
        }

        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Upload ảnh thành công"
        );
      } catch (err) {
        console.error("Upload Error:", err);
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          err?.response?.data?.message || "Có lỗi xảy ra trong quá trình upload"
        );
      }

      // Ngăn chặn việc upload tự động
      return false;
    };

    store.dispatch("userAddress/setListUserAddressAction");

    return {
      listUserAddressByUser,
      beforeUpload,
      handleSaveChangeInfo,
      username,
      userLogin,
      fileList,
    };
  },
};
</script>

<style scoped>
.button-custom {
  margin: 0 8px;
}

.button-custom:hover {
  color: blue;
}
</style>
