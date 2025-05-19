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
              <a-form-item label="Tên danh mục">
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
            Danh sách sản phẩm
          </a-label>

          <!-- Thêm mới sản phẩm -->
          <div>
            <a-button type="primary" @click="visible = true">
              <PlusOutlined /> Thêm mới
            </a-button>
            <a-modal
              v-model:open="visible"
              title="Thêm mới danh mục"
              @ok="onOkAdd"
              ok-text="Thêm mới"
              cancel-text="Hủy bỏ"
            >
              <a-form
                ref="formRef"
                :model="formState"
                layout="vertical"
                name="form_in_modal"
              >
                <a-form-item
                  name="subCategoryName"
                  label="Tên danh mục"
                  :rules="[
                    {
                      required: true,
                      message: 'Tên danh mục là bắt buộc!',
                    },
                  ]"
                >
                  <a-input v-model:value="formState.subCategoryName" />
                </a-form-item>

                <a-form-item name="description" label="Mô tả">
                  <a-input v-model:value="formState.description" />
                </a-form-item>

                <a-form-item
                  name="category"
                  label="Danh mục"
                  :rules="[
                    {
                      required: true,
                      message: 'Danh mục là bắt buộc!',
                    },
                  ]"
                >
                  <a-select
                    v-model:value="formState.category"
                    placeholder="Chọn danh mục"
                    allowClear
                  >
                    <a-select-option
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.categoryName }}
                    </a-select-option>
                  </a-select>
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
          >
            <template #bodyCell="{ record, column }">
              <template v-if="column.key === 'operation'">
                <a>
                  <!-- Button xóa -->
                  <a-button @click="showConfirm(record.key)" class="m-04">
                    <DeleteOutlined class="fs-16 m-04" />
                  </a-button>

                  <!-- Xử lý sửa -->
                  <a-button
                    @click="handleGetSubCategoryDetail(record.subcategoryId)"
                    class="m-04"
                  >
                    <EditOutlined />
                  </a-button>
                  <a-modal
                    v-model:open="open"
                    title="Thông tin danh mục"
                    @ok="handleSubmitChangeSubcategory(record.subcategoryId)"
                    ok-text="Cập nhật danh mục"
                    cancel-text="Hủy bỏ"
                    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
                    :contentWrapperStyle="{ boxShadow: 'none' }"
                    v-if="record.subCategoryId === subcategoryDetailCurrent.id"
                  >
                    <a-form
                      ref="formRefEdit"
                      :model="subcategoryDetailCurrent"
                      layout="vertical"
                      name="form_in_modal_edit"
                    >
                      <a-form-item
                        name="subCategoryNameEdit"
                        label="Tên danh mục"
                        class="form-item"
                        :rules="[
                          {
                            required: true,
                            message: 'Tên danh mục không được để trống!',
                          },
                        ]"
                      >
                        <a-input
                          v-model:value="
                            subcategoryDetailCurrent.subCategoryNameEdit
                          "
                        />
                      </a-form-item>

                      <a-form-item
                        label="Mô tả"
                        name="descriptionEdit"
                        class="form-item"
                      >
                        <a-input
                          v-model:value="subcategoryDetailCurrent.description"
                        />
                      </a-form-item>

                      <a-form-item
                        name="categoryEdit"
                        label="Loại hàng"
                        :rules="[
                          {
                            required: true,
                            message: 'Loại hàng là bắt buộc!',
                          },
                        ]"
                      >
                        <a-select
                          v-model:value="subcategoryDetailCurrent.categoryEdit"
                          placeholder="Chọn loại hàng"
                          allowClear
                        >
                          <a-select-option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                          >
                            {{ category.categoryName }}
                          </a-select-option>
                        </a-select>
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
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import {
  createASubcategory,
  deleteASubcategory,
  getAllSubcategory,
  getASubcategory,
  updateASubcategory,
} from "@/apis/modules/api.subcategory";

const formRef = ref();
const visible = ref(false);
const formState = reactive({
  subCategoryName: "",
  description: "",
  category: "",
});

const fileList = ref([]);
const categories = ref([]);
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
      await createASubcategory(data);
      message.success("Thêm danh mục thành công");
      formRef.value.resetFields();
      fileList.value = [];
      fetchData();
      visible.value = false;
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      message.error(err?.response?.data?.message || "Có lỗi xảy ra");
    }
  } catch (error) {
    console.log(error);
  }
};

const columns = ref([
  {
    title: "Mã danh mục",
    width: 50,
    dataIndex: "subcategoryId",
    key: "subcategoryId",
    fixed: "left",
  },
  {
    title: "Tên danh mục",
    width: 30,
    dataIndex: "subcategoryName",
    key: "subcategoryName",
    fixed: "left",
    sorter: (a, b) => a.subcategoryName.localeCompare(b.subcategoryName),
  },
  {
    title: "Loại hàng",
    dataIndex: "category",
    key: "category",
    width: 50,
    sorter: (a, b) => a.category.localeCompare(b.category),
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
    const response = await getAllSubcategory({
      page: page.value,
      perPage: perPage.value,
      search: searchValue.value,
    });

    categories.value = await getAllcategory();

    data.value = response.rows.map((subcategory) => ({
      key: subcategory.id,
      subcategoryId: subcategory.id,
      subcategoryName: subcategory.subCategoryName,
      category: subcategory.category.categoryName,
      isActive: subcategory.isActive == true ? "Đang hoạt động" : "Tạm dừng",
    }));

    total.value = response.total;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  setLoading(true);
  setTimeout(() => {
    fetchData();
    setLoading(false);
  }, 500);
}

function handleEdit() {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
  }, 500);
}

function resetData() {
  setLoading(true);
  setTimeout(() => {
    page.value = 1;
    perPage.value = 10;
    searchValue.value = "";
    setLoading(false);
    fetchData();
  }, 500);
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

// Xử lý sửa bản ghi
const formRefEdit = ref();
const open = ref(false);
const size = ref("default");
const subcategoryDetailCurrent = reactive({
  subCategoryNameEdit: "",
  descriptionEdit: "",
  categoryEdit: "",
});
const showDrawer = (val) => {
  size.value = val;
  open.value = true;
};
const onClose = () => {
  open.value = false;
};

const handleGetSubCategoryDetail = async (subcategoryId) => {
  fileList.value = [];
  showDrawer("default");
  try {
    const result = await getASubcategory(subcategoryId);
    subcategoryDetailCurrent.subCategoryId = subcategoryId;
    subcategoryDetailCurrent.subCategoryNameEdit = result.subCategoryName;
    subcategoryDetailCurrent.descriptionEdit = result.description;
    subcategoryDetailCurrent.categoryEdit = result.category.id;
    subcategoryDetailCurrent.isActive = result.isActive;
  } catch (err) {
    console.log(err);
  }
};

const handleSubmitChangeSubcategory = async () => {
  try {
    await formRefEdit.value.validateFields();
    const data = {
      subCategoryName: subcategoryDetailCurrent.subCategoryNameEdit,
      description: subcategoryDetailCurrent.descriptionEdit,
      category: subcategoryDetailCurrent.categoryEdit,
      isActive: subcategoryDetailCurrent.isActive,
    };
    await updateASubcategory(subcategoryDetailCurrent.subCategoryId, data);
    message.success("Cập nhật danh mục thành công");
    fetchData();
    onClose();
    handleEdit();
    fileList.value = [];
  } catch (err) {
    console.log(err);
  }
};

// Xử lý xóa bản ghi
async function handleDelete(productId) {
  setLoading(true);
  try {
    await deleteASubcategory(productId);
    message.success("Xóa danh mục thành công");
  } catch (err) {
    message.error("Danh mục đã được sử dụng. Không thể xóa");
  }
  fetchData();
  setLoading(false);
}

import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { getAllcategory } from "@/apis/modules/api.category";

const showConfirm = (productId) => {
  Modal.confirm({
    title: "Xác nhận xóa bản ghi",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Bạn có chắc chắn muốn xóa sản phẩm không?",
    onOk() {
      handleDelete(productId);
    },
    onCancel() {},
    okText: "Xác nhận",
    cancelText: "Hủy bỏ",
  });
};
</script>

<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.ant-drawer-mask {
  background-color: rgba(0, 0, 0, 0.5);
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

.bold-label {
  font-weight: bold;
}
</style>
