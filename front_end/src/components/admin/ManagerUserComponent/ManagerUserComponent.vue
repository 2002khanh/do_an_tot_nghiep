<template>
  <div style="flex-grow: 1">
    <a-layout-header style="background: #fff; padding: 0; height: 20px">
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <div class="form-container">
        <a-form>
          <div style="padding-top: 32px"></div>
          <a-row>
            <a-row :span="8" style="margin-left: 8px">
              <a-form-item label="Họ tên">
                <a-input
                  placeholder="nhập dữ liệu"
                  v-model:value="searchValue"
                />
              </a-form-item>
              <div style="margin: 0 8px"></div>
            </a-row>
            <a-col style="display: flex; justify-content: end">
              <a-form-item>
                <a-button
                  type="primary"
                  :loading="iconLoading"
                  @click="handleSearch"
                  style="margin-right: 12px"
                >
                  <template #icon><SearchOutlined /></template>
                  Tìm kiếm
                </a-button>
                <a-button @click="resetData">Làm mới</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="table-container">
        <a-row
          style="display: flex; justify-content: space-between; padding: 0 16px"
        >
          <a-label
            style="
              display: block;
              margin-left: 8px;
              margin-bottom: 16px;
              font-weight: 600;
            "
          >
            Danh sách tài khoản
          </a-label>

          <!-- Thêm mới -->
          <div>
            <a-button type="primary" @click="visible = true">
              <PlusOutlined /> Thêm mới
            </a-button>
            <a-modal
              v-model:open="visible"
              title="Thêm mới tài khoản"
              ok-text="Thêm mới"
              cancel-text="Hủy bỏ"
              @ok="onOkAdd"
            >
              <a-form
                ref="formRef"
                :model="formState"
                layout="vertical"
                name="form_in_modal"
              >
                <a-form-item
                  name="username"
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
                  name="password"
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
          </div>

          <!-- Kết thúc thêm mới -->
        </a-row>
        <a-spin :spinning="loading">
          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="false"
            size="middle"
            @change="handleChangeData"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'operation'">
                <a>
                  <a-button @click="showConfirm" class="m-04"
                    ><DeleteOutlined class="fs-16 m-04"
                  /></a-button>

                  <!-- Xử lý sửa -->
                  <a-button
                    @click="handleGetUserDetail(record.userId)"
                    class="m-04"
                  >
                    <EditOutlined />
                  </a-button>
                  <a-modal
                    v-model:open="open"
                    title="Thông tin tài khoản"
                    @ok="handleSubmitChangeSubcategory(record.userId)"
                    ok-text="Cập nhật"
                    cancel-text="Hủy bỏ"
                    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
                    :contentWrapperStyle="{ boxShadow: 'none' }"
                  >
                    <a-form
                      ref="formRefEdit"
                      :model="userDetailCurrent"
                      layout="vertical"
                      name="form_in_modal_edit"
                    >
                      <a-form-item
                        name="usernameEdit"
                        label="Họ tên"
                        class="form-item"
                        :rules="[
                          {
                            required: true,
                            message: 'Họ tên không được để trống!',
                          },
                        ]"
                      >
                        <a-input
                          v-model:value="userDetailCurrent.usernameEdit"
                        />
                      </a-form-item>

                      <a-form-item
                        label="Email"
                        name="emailEdit"
                        class="form-item"
                        :rules="[
                          {
                            required: true,
                            message: 'Email không được để trống!',
                          },
                        ]"
                      >
                        <a-input v-model:value="userDetailCurrent.emailEdit" />
                      </a-form-item>
                    </a-form>
                  </a-modal>
                  <!-- Kết thúc xử lý sửa -->
                </a>
              </template>
            </template>
          </a-table>
          <a-pagination
            style="position: absolute; right: 0; margin: 24px 0"
            v-model:current="page"
            v-model:page-size="perPage"
            :total="total"
            :show-total="
              (total, range) => `${range[0]}-${range[1]} of ${total} items`
            "
            @change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </a-spin>
      </div>
    </a-layout-content>
  </div>
</template>

<script setup>
import { PlusOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { reactive, ref, toRaw } from "vue";
import { onMounted } from "vue";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import {
  createUserAdminApi,
  getAllUserApi,
  getUserAdminById,
  updateUserAdminApi,
} from "@/apis/modules/api.user";
import { formatDate } from "@/utils/formatDate";

const formRef = ref();
const visible = ref(false);
const formState = reactive({
  username: "",
  email: "",
  role: "",
  password: "",
});
const loading = ref(false);
const iconLoading = ref(false);
const data = ref([]);
const searchValue = ref("");

const page = ref(1);
const perPage = ref(10);
const total = ref(0);

const onOkAdd = async () => {
  try {
    await formRef.value.validateFields();

    const data = toRaw(formState);

    try {
      await createUserAdminApi(data);
      message.success("Thêm tài khoản thành công");
      formRef.value.resetFields();
      fetchData();
      visible.value = false;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra");
    }
  } catch (error) {
    console.log(error);
  }
};

const columns = ref([
  {
    title: "Mã tài khoản",
    width: 50,
    dataIndex: "userId",
    key: "userID",
    fixed: "left",
  },
  {
    title: "Họ tên",
    width: 30,
    dataIndex: "fullName",
    key: "fullName",
    fixed: "left",
    sorter: (a, b) => a.fullName.localeCompare(b.fullName),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    width: 30,
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 50,
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
  },
  {
    title: "Thời gian cập nhật",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 50,
    sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
  },
  {
    title: "Hành động",
    key: "operation",
    fixed: "right",
    width: 20,
  },
]);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    loading.value = true;
    const response = await getAllUserApi({
      page: page.value,
      perPage: perPage.value,
      search: searchValue.value,
    });

    data.value = response.rows.map((user) => ({
      key: user.id,
      userId: user.id,
      fullName: user.username,
      email: user.email,
      role: user.role,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
      lastActiveAt: formatDate(user.lastActive),
    }));
    total.value = response.total;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    loading.value = false;
  }
}

function handleDelete() {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);
}

function handleSearch() {
  setLoading(true);
  setTimeout(() => {
    fetchData();
    setLoading(false);
  }, 2000);
}

function handleEdit() {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 2000);
}

function resetData() {
  setLoading(true);
  setTimeout(() => {
    page.value = 1;
    perPage.value = 10;
    searchValue.value = "";
    setLoading(false);
    fetchData();
  }, 2000);
}

function setLoading(value) {
  loading.value = value;
}

function handlePageChange(newPage) {
  page.value = newPage;
  fetchData();
}

function handleSizeChange(newPerPage) {
  perPage.value = newPerPage;
  fetchData();
}

// Xủ lý modal xác nhận xóa
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
const showConfirm = () => {
  Modal.confirm({
    title: "Xác nhận xóa bản ghi",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Bạn có chắc chắn muốn xóa tài khoản không",
    onOk() {
      handleDelete();
    },
    onCancel() {},
  });
};

// Xử lý sửa bản ghi
const formRefEdit = ref();
const open = ref(false);
const size = ref("default");
const userDetailCurrent = reactive({
  userId: "",
  usernameEdit: "",
  emailEdit: "",
  roleEdit: "",
});
const showDrawer = (val) => {
  size.value = val;
  open.value = true;
};
const onClose = () => {
  open.value = false;
};

const handleGetUserDetail = async (userId) => {
  showDrawer("default");
  try {
    const result = await getUserAdminById(userId);
    userDetailCurrent.userId = userId;
    userDetailCurrent.usernameEdit = result.username;
    userDetailCurrent.emailEdit = result.email;
    userDetailCurrent.roleEdit = result.role;
  } catch (err) {
    console.log(err);
  }
};

const handleSubmitChangeSubcategory = async () => {
  try {
    await formRefEdit.value.validateFields();
    const data = {
      userId: userDetailCurrent.userId,
      username: userDetailCurrent.usernameEdit,
      email: userDetailCurrent.emailEdit,
      role: userDetailCurrent.roleEdit,
    };
    await updateUserAdminApi(data);
    message.success("Cập nhật tài khoản thành công");
    fetchData();
    onClose();
    handleEdit();
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.ant-drawer-mask {
  background-color: rgba(0, 0, 0, 0.2);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}

.form-container {
  background: #fff;
  padding: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
}

.m-6 {
  margin: 6px;
}

#components-table-demo-summary tfoot th,
#components-table-demo-summary tfoot td {
  background: #fafafa;
}
[data-theme="dark"] #components-table-demo-summary tfoot th,
[data-theme="dark"] #components-table-demo-summary tfoot td {
  background: #1d1d1d;
}
.fs-16 {
  font-size: 16px;
}
.m-04 {
  margin: 0 4px;
}
</style>
