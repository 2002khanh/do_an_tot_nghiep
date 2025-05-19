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
          <CreateDiscountComponent
            :showListDiscountByProduct="showListDiscountByProduct"
            :setLoading="setLoading"
            :fetchData="fetchData"
          ></CreateDiscountComponent>
          <!-- Kết thúc thêm mới -->
        </a-row>

        <a-spin :spinning="loading" style="z-index: 11000">
          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="false"
            size="middle"
          >
            <template #bodyCell="{ record, column }">
              <template v-if="column.key === 'operation'">
                <a style="display: flex">
                  <ListDiscountComponent
                    :discountId="record.discountId"
                    :setLoading="setLoading"
                    :discount="record"
                    :products="record.products.map((product) => product.id)"
                    :fetchData="fetchData"
                  ></ListDiscountComponent>
                  <DeleteDiscountComponent
                    :fetchData="fetchData"
                    :setLoading="setLoading"
                    :discountId="record.discountId"
                  ></DeleteDiscountComponent>
                  <EditDiscountComponent
                    :fetchData="fetchData"
                    :setLoading="setLoading"
                    :discountId="record.discountId"
                    :discount="record.originalDiscount"
                  ></EditDiscountComponent>
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
import { ref } from "vue";
import { onMounted } from "vue";
import { getAllDiscount } from "@/apis/modules/api.discount";
import CreateDiscountComponent from "./CreateDiscountComponent.vue";
import ListDiscountComponent from "./ListDiscountComponent.vue";
import EditDiscountComponent from "./EditDiscountComponent.vue";
import DeleteDiscountComponent from "./DeleteDiscountComponent.vue";
import { SearchOutlined } from "@ant-design/icons-vue";
import { formatDate } from "@/utils/formatDate";

const loading = ref(false);
const iconLoading = ref(false);
const data = ref([]);
const searchValue = ref("");

const page = ref(1);
const perPage = ref(10);
const total = ref(0);

const columns = ref([
  {
    title: "Mã lịch giảm giá",
    width: 50,
    dataIndex: "discountId",
    key: "discountId",
    fixed: "left",
  },
  {
    title: "Ngày bắt đầu",
    width: 50,
    dataIndex: "startDate",
    key: "startDate",
    fixed: "left",
    sorter: (a, b) => a.startDate.localeCompare(b.startDate),
  },
  {
    title: "Ngày kết thúc",
    width: 50,
    dataIndex: "endDate",
    key: "endDate",
    fixed: "left",
    sorter: (a, b) => a.endDate.localeCompare(b.endDate),
  },
  {
    title: "Giảm giá (%)",
    width: 30,
    dataIndex: "discount",
    key: "discount",
    fixed: "left",
    sorter: (a, b) => a.discount.localeCompare(b.discount),
  },
  {
    title: "Ngày khởi tạo",
    width: 50,
    dataIndex: "createdAt",
    key: "createdAt",
    fixed: "left",
    sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
  },
  {
    title: "Hành động",
    key: "operation",
    fixed: "right",
    width: 100,
  },
]);

onMounted(async () => {
  await fetchData();
});

async function fetchData() {
  try {
    loading.value = true;
    const response = await getAllDiscount({
      page: page.value,
      perPage: perPage.value,
      search: searchValue.value,
    });

    data.value = response.rows.map((discount) => ({
      key: discount.id,
      discountId: discount.id,
      startDate: formatDate(new Date(discount.startDate)),
      endDate: formatDate(new Date(discount.endDate)),
      createdAt: formatDate(new Date(discount.createdAt)),
      discount: `${discount.discount}%`,
      products: discount.products,
      originalDiscount: {
        endDate: discount.endDate,
        startDate: discount.startDate,
        discount: discount.discount,
      },
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
</script>

<style scoped>
.ant-modal-wrap {
  overflow: hidden !important;
}

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
