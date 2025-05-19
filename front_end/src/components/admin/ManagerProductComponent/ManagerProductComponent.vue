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
              <a-form-item label="Tên sản phẩm">
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
              title="Thêm mới sản phẩm"
              @ok="onOkAdd"
              ok-text="Thêm mới"
              cancel-text="Hủy bỏ"
              :width="800"
            >
              <a-form
                ref="formRef"
                :model="formState"
                layout="vertical"
                name="form_in_modal"
              >
                <a-row :gutter="16">
                  <a-col :span="12" style="padding-right: 12px">
                    <a-form-item
                      name="productName"
                      label="Tên sản phẩm"
                      :rules="[
                        {
                          required: true,
                          message: 'Tên sản phẩm là bắt buộc!',
                        },
                      ]"
                    >
                      <a-input v-model:value="formState.productName" />
                    </a-form-item>
                  </a-col>

                  <a-col :span="12">
                    <a-form-item
                      name="image"
                      label="Ảnh sản phẩm"
                      :rules="[
                        {
                          validator: checkImage,
                          required: true,
                          message: 'Ảnh sản phẩm là bắt buộc!',
                        },
                      ]"
                    >
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
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item
                      name="subcategory"
                      label="Danh mục"
                      :rules="[
                        {
                          required: true,
                          message: 'Danh mục là bắt buộc!',
                        },
                      ]"
                    >
                      <a-select
                        v-model:value="formState.subcategory"
                        placeholder="Chọn danh mục"
                        allowClear
                      >
                        <a-select-option
                          v-for="category in categories"
                          :key="category.id"
                          :value="category.id"
                        >
                          {{ category.subCategoryName }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>

                  <a-col :span="12">
                    <a-form-item
                      name="trademark"
                      label="Thương hiệu sản phẩm"
                      :rules="[
                        {
                          required: true,
                          message: 'Thương hiệu sản phẩm là bắt buộc!',
                        },
                      ]"
                    >
                      <a-input v-model:value="formState.trademark" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item
                      name="content"
                      label="Tên option (Mặc định)"
                      :rules="[
                        {
                          required: true,
                          message: 'Tên option là bắt buộc!',
                        },
                      ]"
                    >
                      <a-input v-model:value="formState.content" />
                    </a-form-item>
                  </a-col>

                  <a-col :span="12">
                    <a-form-item
                      name="price"
                      label="Giá option (Mặc định)"
                      :rules="[
                        {
                          required: true,
                          message: 'Giá option là bắt buộc!',
                        },
                        {
                          validator: (rule, value, callback) => {
                            if (isNaN(value)) {
                              callback(new Error('Giá option phải là một số!'));
                            } else {
                              callback();
                            }
                          },
                        },
                      ]"
                    >
                      <a-input v-model:value="formState.price" />
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item
                      name="quantity"
                      label="Số lượng trong kho"
                      :rules="[
                        {
                          required: true,
                          message: 'Số lượng trong kho là bắt buộc!',
                        },
                        {
                          validator: (rule, value, callback) => {
                            if (isNaN(value)) {
                              callback(
                                new Error('Số lượng trong kho phải là một số!')
                              );
                            } else {
                              callback();
                            }
                          },
                        },
                        {
                          validator: (rule, value, callback) => {
                            if (value < 0) {
                              callback(
                                new Error(
                                  'Số lượng trong kho không được là số âm!'
                                )
                              );
                            } else {
                              callback();
                            }
                          },
                        },
                      ]"
                    >
                      <a-input v-model:value="formState.quantity" />
                    </a-form-item>
                  </a-col>

                  <a-col :span="12">
                    <a-form-item name="description" label="Mô tả sản phẩm">
                      <a-textarea
                        v-model:value="formState.description"
                        :rows="6"
                        placeholder="Nhập mô tả chi tiết về sản phẩm..."
                        :auto-size="{ minRows: 8, maxRows: 12 }"
                        style="color: #000; opacity: 1"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
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
                    @click="handleGetProductDetail(record.productId)"
                    class="m-04"
                  >
                    <EditOutlined />
                  </a-button>
                  <a-modal
                    v-model:open="open"
                    title="Thông tin sản phẩm"
                    @ok="handleSubmitChangeProduct(record.productId)"
                    ok-text="Cập nhật"
                    cancel-text="Hủy bỏ"
                    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
                    :contentWrapperStyle="{ boxShadow: 'none' }"
                    v-if="productSelected.productId === record.productId"
                    width="800px"
                  >
                    <a-form
                      ref="formRefEdit"
                      :model="productSelected"
                      layout="vertical"
                      name="form_in_modal_edit"
                    >
                      <a-row :gutter="16">
                        <a-col :span="8">
                          <a-form-item
                            name="productNameEdit"
                            label="Tên sản phẩm"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                message: 'Tên sản phẩm không được để trống!',
                              },
                            ]"
                          >
                            <a-input
                              v-model:value="productSelected.productNameEdit"
                            />
                          </a-form-item>
                        </a-col>

                        <a-col :span="8">
                          <a-form-item
                            name="trademark"
                            label="Thương hiệu"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                message: 'Thương hiệu không được để trống!',
                              },
                            ]"
                          >
                            <a-input
                              v-model:value="productSelected.trademark"
                            />
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="16">
                        <a-col :span="8">
                          <a-form-item
                            name="detailProductName"
                            label="Chọn option sản phẩm"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                validator: customValidatorRadioButton,
                                trigger: 'change',
                              },
                            ]"
                          >
                            <a-radio-group v-model:value="selectedOption">
                              <div
                                class="option"
                                v-for="(
                                  item, index
                                ) in productSelected.detailProducts"
                                :key="index"
                              >
                                <a-radio
                                  style="padding: 8px 0"
                                  :value="item.content"
                                  @change="handleOptionChange(item)"
                                >
                                  {{ item.content }}
                                </a-radio>
                              </div>
                            </a-radio-group>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row :gutter="16">
                        <a-col :span="8">
                          <a-form-item
                            name="content"
                            label="Tên option"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                message: 'Tên option không được để trống!',
                              },
                            ]"
                          >
                            <a-input v-model:value="productSelected.content" />
                          </a-form-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-item
                            label="Giá sản phẩm"
                            name="priceEdit"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                message: 'Giá sản phẩm không được để trống!',
                              },
                              {
                                validator: (rule, value, callback) => {
                                  if (isNaN(value)) {
                                    callback(
                                      new Error('Giá sản phẩm phải là một số!')
                                    );
                                  } else {
                                    callback();
                                  }
                                },
                              },
                            ]"
                          >
                            <a-input
                              v-model:value="productSelected.priceEdit"
                            />
                          </a-form-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-item
                            label="Số lượng trong kho"
                            name="quantity"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                message:
                                  'Số lượng sản phẩm trong kho không được để trống!',
                              },
                              {
                                validator: (rule, value, callback) => {
                                  if (isNaN(value)) {
                                    callback(
                                      new Error(
                                        'Số lượng sản phẩm trong kho phải là một số!'
                                      )
                                    );
                                  } else {
                                    callback();
                                  }
                                },
                              },
                            ]"
                          >
                            <a-input v-model:value="productSelected.quantity" />
                          </a-form-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-item
                            name="subcategoryEdit"
                            label="Danh mục"
                            :rules="[
                              {
                                required: true,
                                message: 'Danh mục là bắt buộc!',
                              },
                            ]"
                          >
                            <a-select
                              v-model:value="productSelected.subcategoryEdit"
                              placeholder="Chọn danh mục"
                              allowClear
                            >
                              <a-select-option
                                v-for="category in categories"
                                :key="category.id"
                                :value="category.id"
                              >
                                {{ category.subCategoryName }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-item
                            label="Trạng thái"
                            name="isActive"
                            class="form-item"
                            :rules="[
                              {
                                required: true,
                                message: 'Trạng thái chưa được chọn!',
                              },
                            ]"
                          >
                            <a-switch
                              v-model:checked="productSelected.isActive"
                            />
                          </a-form-item>
                        </a-col>
                        <a-col :span="8">
                          <a-form-item
                            name="imageEdit"
                            label="Ảnh sản phẩm"
                            :rules="[
                              {
                                required: true,
                                message: 'Ảnh sản phẩm là bắt buộc!',
                              },
                            ]"
                          >
                            <img
                              v-if="productSelected.imageEdit"
                              :src="
                                `${config.MINIO_URL}` +
                                productSelected.imageEdit
                              "
                              alt="avatar"
                              style="
                                width: 20%;
                                margin-top: 8px;
                                border-radius: 4px;
                              "
                            />
                            <br />
                            <div style="margin-top: 8px"></div>
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
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-form-item
                        name="description"
                        label="Mô tả"
                        class="form-item"
                        style="width: 100%"
                      >
                        <a-textarea
                          v-model:value="productSelected.description"
                          :rows="6"
                          placeholder="Nhập mô tả chi tiết về sản phẩm..."
                          :auto-size="{ minRows: 8, maxRows: 12 }"
                          style="color: #000; opacity: 1"
                        />
                      </a-form-item>
                    </a-form>
                  </a-modal>
                  <!-- Kết thúc xử lý sửa -->

                  <!-- Xử lý thay đổi danh sách options -->
                  <a-button
                    @click="handleGetProductDetail(record.productId, true)"
                    class="m-04"
                  >
                    <EllipsisOutlined />
                  </a-button>

                  <a-modal
                    v-model:open="openMore"
                    title="Danh sách option"
                    @ok="handleSubmitChangeListOptions(record.productId)"
                    ok-text="Cập nhật"
                    cancel-text="Hủy bỏ"
                    :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
                    :contentWrapperStyle="{ boxShadow: 'none' }"
                    v-if="productSelected.productId === record.productId"
                  >
                    <a-list
                      item-layout="horizontal"
                      :data-source="productSelected.detailProducts"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item>
                          <a-list-item-meta>
                            <template #title>
                              {{ item.content }}
                            </template>
                            <template #description>
                              <div
                                style="
                                  display: flex;
                                  justify-content: space-between;
                                  padding-top: 12px;
                                "
                              >
                                <div class="price-text">
                                  Giá:
                                  {{ formatNumberWithDots(item.price) }} VND
                                </div>
                                <div
                                  class="price-text"
                                  style="padding-right: 40px"
                                >
                                  Số lượng trong kho:
                                  {{ formatNumberWithDots(item.quantity) }}
                                </div>
                              </div>
                            </template>
                          </a-list-item-meta>
                          <MinusCircleOutlined
                            @click="showConfirmDeleteDetailProduct(item.id)"
                          />
                        </a-list-item>
                      </template>
                    </a-list>
                    <a-form
                      ref="formRefListOptions"
                      name="dynamic_form_nest_item"
                      :model="dynamicValidateForm"
                      @finish="onFinish"
                      class="ml-4"
                    >
                      <a-space
                        v-for="(option, index) in dynamicValidateForm.options"
                        :key="option.id"
                        style="display: flex; margin-bottom: 8px"
                        align="baseline"
                      >
                        <a-form-item
                          :name="['options', index, 'content']"
                          :rules="{
                            required: true,
                            message: 'Trường này không được để trống!',
                          }"
                        >
                          <a-input
                            v-model:value="option.content"
                            placeholder="Tên option"
                          />
                        </a-form-item>
                        <a-form-item
                          :name="['options', index, 'price']"
                          :rules="[
                            {
                              required: true,
                              message: 'Trường này không được để trống!',
                            },
                            {
                              validator: validatePrice,
                              message: 'Giá không hợp lệ!',
                            },
                          ]"
                        >
                          <a-input
                            v-model:value="option.price"
                            placeholder="Giá"
                          />
                        </a-form-item>
                        <a-form-item
                          :name="['options', index, 'quantity']"
                          :rules="[
                            {
                              required: true,
                              message: 'Trường này không được để trống!',
                            },
                            {
                              validator: validateQuantity,
                              message: 'Số lượng trong kho không hợp lệ!',
                            },
                          ]"
                        >
                          <a-input
                            v-model:value="option.quantity"
                            placeholder="Số lượng trong kho"
                          />
                        </a-form-item>
                        <MinusCircleOutlined @click="removeOption(option)" />
                      </a-space>
                      <a-form-item>
                        <a-button type="dashed" block @click="addUser">
                          <PlusOutlined />
                          Thêm mới option
                        </a-button>
                      </a-form-item>
                    </a-form>
                  </a-modal>
                  <!-- Kết thúc xử lý thay đổi danh sách options -->
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
import config from "@/configs/config";
import {
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons-vue";
import {
  createAProduct,
  deleteAProduct,
  getAllProductByAmin,
  getDetailProduct,
  updateAProduct,
  uploadImageProduct,
} from "@/apis/modules/api.product";

import {
  createDetailProduct,
  deleteADetailProduct,
} from "@/apis/modules/api.detail_product";
import { formatDate } from "@/utils/formatDate";
import { getAllSubcategory } from "@/apis/modules/api.subcategory";

const formRef = ref();
const visible = ref(false);
const formState = reactive({
  productName: "",
  subcategory: "",
  image: "",
  price: "",
  manufactureDate: "",
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

// Xử lý tải ảnh sản phẩm
const beforeUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await uploadImageProduct(formData);
    formState.image = response.urlImage;
  } catch (err) {
    message.error(err?.response?.data?.message || "Có lỗi xảy ra");
  }
  return false;
};

const checkImage = (rule, value, callback) => {
  if (fileList.value.length === 0) {
    callback(new Error("Vui lòng chọn ảnh sản phẩm!"));
  } else {
    callback();
  }
};
// Kết thúc

const onOkAdd = async () => {
  try {
    await formRef.value.validateFields();

    const data = toRaw(formState);

    try {
      data.price = +data.price;
      data.quantity = +data.quantity;
      await createAProduct(data);
      message.success("Thêm sản phẩm thành công");
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
    title: "Mã sản phẩm",
    width: 50,
    dataIndex: "productId",
    key: "productId",
    fixed: "left",
  },
  {
    title: "Tên sản phẩm",
    width: 30,
    dataIndex: "productName",
    key: "productName",
    fixed: "left",
    sorter: (a, b) => a.productName.localeCompare(b.productName),
  },
  {
    title: "Giá sản phẩm (VNĐ)",
    dataIndex: "price",
    key: "price",
    width: 30,
    sorter: (a, b) => a.price.localeCompare(b.price),
  },
  {
    title: "Danh mục",
    dataIndex: "subCategoryName",
    key: "subCategoryName",
    width: 50,
    sorter: (a, b) => a.subCategoryName.localeCompare(b.subCategoryName),
  },
  {
    title: "Trạng thái",
    dataIndex: "isActive",
    key: "isActive",
    width: 50,
    sorter: (a, b) => a.isActive.localeCompare(b.isActive),
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 50,
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
    const response = await getAllProductByAmin({
      page: page.value,
      perPage: perPage.value,
      search: searchValue.value,
    });
    categories.value = (await getAllSubcategory()).rows;

    data.value = response.rows.map((product) => {
      const prices = product.detailProducts?.map((item) => item.price) || [];
      let firstPrice = 0;
      let lastPrice = 0;
      if (prices.length > 0) {
        prices.sort((a, b) => a - b);
        firstPrice = prices[0];
        lastPrice = prices[prices.length - 1];
      }

      return {
        key: product.id,
        productId: product.id,
        productName: product.productName,
        image: product.image,
        price:
          firstPrice === lastPrice
            ? `${formatNumberWithDots(firstPrice)}đ`
            : `${formatNumberWithDots(firstPrice)}đ - ${formatNumberWithDots(
                lastPrice
              )}đ`,
        isActive: product.isActive == true ? "Đang hoạt động" : "Tạm dừng",
        subCategoryName:
          product.subcategory.category.categoryName +
          " / " +
          product.subcategory.subCategoryName,
        createdAt: formatDate(product.createdAt),
      };
    });
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

const selectedOption = ref(null);

// Xử lý sửa bản ghi
const formRefEdit = ref();
const open = ref(false);
// const size = ref("default");
const productSelected = reactive({
  productNameEdit: "",
  priceEdit: "",
  imageEdit: "",
  subcategoryEdit: "",
  quantity: "",
  trademark: "",
  description: "",
  detailProductId: "",
});

const onClose = () => {
  open.value = false;
};

const handleOptionChange = (item) => {
  selectedOption.value = item.content;

  productSelected.priceEdit = item.price;
  productSelected.quantity = item.quantity;
  productSelected.content = item.content;
  productSelected.detailProductId = item.id;
};

const handleGetProductDetail = async (productId, isHandleListOptions) => {
  setLoading(true);

  try {
    const result = await getDetailProduct(productId);
    productSelected.productId = productId;
    productSelected.productNameEdit = result.productName;
    productSelected.imageEdit = result.image;
    productSelected.subcategoryEdit = result.subcategory.id;
    productSelected.isActive = result.isActive;
    productSelected.detailProducts = result.detailProducts;
    productSelected.trademark = result.trademark;
    productSelected.description = result.description;
    if (isHandleListOptions) {
      openMore.value = true;
    } else {
      fileList.value = [];
      open.value = true;
    }
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

const customValidatorRadioButton = () => {
  if (!selectedOption.value) {
    return Promise.reject("Chưa chọn option sản phẩm!");
  }
  return Promise.resolve();
};

const handleSubmitChangeProduct = async () => {
  try {
    await formRefEdit.value.validateFields();
    const data = {
      productName: productSelected.productNameEdit,
      price: +productSelected.priceEdit,
      image: productSelected.imageEdit,
      subcategory: productSelected.subcategoryEdit,
      quantity: +productSelected.quantity,
      trademark: productSelected.trademark,
      description: productSelected.description,
      detailProductId: productSelected.detailProductId,
      content: productSelected.content,
      isActive: productSelected.isActive,
    };
    await updateAProduct(productSelected.productId, data);
    message.success("Cập nhật sản phẩm thành công");
    fetchData();
    onClose();
    handleEdit();

    // Clear data
    selectedOption.value = null;
    productSelected.quantity = null;
    productSelected.priceEdit = null;
    productSelected.content = null;
    fileList.value = [];
  } catch (err) {
    console.log(err);
  }
};

// Xử lý xóa bản ghi
async function handleDelete(productId) {
  setLoading(true);
  try {
    await deleteAProduct(productId);
    message.success("Xóa sản phẩm thành công");
  } catch (err) {
    message.error("Sản phẩm đã được sử dụng. Không thể xóa");
  }
  fetchData();
  setLoading(false);
}

import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
import { formatNumberWithDots } from "@/utils/formatStringNumber";

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

// Xử lý thay đổi danh sách options
const openMore = ref(false);

const formRefListOptions = ref();
const dynamicValidateForm = reactive({
  options: [],
});

const validatePrice = (rule, value) => {
  if (!value) return Promise.reject("Giá phải là một số và không âm");
  if (value && isNaN(value)) return Promise.reject("Giá phải là một số");
  if (value && value < 0) return Promise.reject("Giá không được là số âm");
  return Promise.resolve();
};

const validateQuantity = (rule, value) => {
  if (!value)
    return Promise.reject("Số lượng trong kho phải là một số và không âm");
  if (value && isNaN(value))
    return Promise.reject("Số lượng trong kho phải là một số");
  if (value && value < 0)
    return Promise.reject("Số lượng trong kho không được là số âm");
  return Promise.resolve();
};

const removeOption = (item) => {
  const index = dynamicValidateForm.options.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.options.splice(index, 1);
  }
};
const addUser = () => {
  dynamicValidateForm.options.push({
    content: "",
    price: "",
    quantity: "",
    id: Date.now(),
  });
};

const handleSubmitChangeListOptions = async (productId) => {
  try {
    const result = await formRefListOptions.value.validateFields();
    if (result.errorFields && result.errorFields.length > 0) {
      return;
    }
    setLoading(true);
    await createDetailProduct({
      options: dynamicValidateForm.options,
      product: productId,
    });
    openMore.value = false;
    message.success("Cập nhật danh sách options thành công");
    dynamicValidateForm.options = [];
  } catch (error) {
    if (error?.response?.data?.message) {
      message.error(error?.response?.data?.message);
    }
  } finally {
    setLoading(false);
  }
};

const showConfirmDeleteDetailProduct = (detailProductId) => {
  Modal.confirm({
    title: "Xác nhận xóa bản ghi",
    icon: createVNode(ExclamationCircleOutlined),
    content: "Bạn có chắc chắn muốn xóa option không?",
    onOk() {
      deleteDetailProduct(detailProductId);
    },
    onCancel() {},
    okText: "Xác nhận",
    cancelText: "Hủy bỏ",
  });
};

const deleteDetailProduct = async (detailProductId) => {
  try {
    await deleteADetailProduct(detailProductId);
    message.success("Xóa option thành công");
    productSelected.detailProducts = productSelected.detailProducts.filter(
      (item) => item.id !== detailProductId
    );
  } catch (error) {
    console.error("Error:", error);
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
