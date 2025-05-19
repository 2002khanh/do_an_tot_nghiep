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
              <a-form-item label="Tên khách hàng">
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
            Danh sách đơn hàng
          </a-label>
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
                <!-- Xử lý sửa -->
                <a-button
                  @click="handleGetOderDetail(record.orderId)"
                  class="m-04"
                >
                  <EditOutlined />
                </a-button>
                <a-modal
                  v-model:open="open"
                  title="Thông tin đơn hàng"
                  @ok="handleSubmitChangeStatus"
                  ok-text="Cập nhật trạng thái đơn hàng"
                  cancel-text="Hủy bỏ"
                  :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }"
                  v-if="record.orderId === orderDetailCurrent.id"
                  width="1000px"
                >
                  <template #extra>
                    <a-button style="margin-right: 8px" @click="onClose"
                      >Hủy bỏ</a-button
                    >
                    <a-button type="primary" @click="handleSubmitChangeStatus()"
                      >Cập nhật trạng thái đơn hàng</a-button
                    >
                  </template>

                  <!-- Chia layout thành 2 cột -->
                  <div style="display: flex; gap: 16px">
                    <!-- Cột 1: Thông tin đơn hàng -->
                    <div style="flex: 1">
                      <a-form :model="formState">
                        <a-form-item>
                          <template #label>
                            <span class="bold-label">Mã đơn hàng</span>
                          </template>
                          <p class="fs-14">{{ orderDetailCurrent.id }}</p>
                        </a-form-item>

                        <a-form-item>
                          <template #label>
                            <span class="bold-label">Trạng thái đơn hàng</span>
                          </template>
                          <a-dropdown>
                            <template #overlay>
                              <a-menu @click="handleMenuClick">
                                <a-menu-item key="1">
                                  <UserOutlined />
                                  Chờ xác nhận
                                </a-menu-item>
                                <a-menu-item key="2">
                                  <UserOutlined />
                                  Đã xác nhận
                                </a-menu-item>
                                <a-menu-item key="3">
                                  <UserOutlined />
                                  Đang giao hàng
                                </a-menu-item>
                                <a-menu-item key="4">
                                  <UserOutlined />
                                  Giao hàng thành công
                                </a-menu-item>
                                <a-menu-item key="5">
                                  <UserOutlined />
                                  Giao hàng thất bại
                                </a-menu-item>
                                <a-menu-item key="6">
                                  <UserOutlined />
                                  Đã hủy
                                </a-menu-item>
                              </a-menu>
                            </template>
                            <a-button>
                              {{ statusOrderCurrent }}
                              <DownOutlined />
                            </a-button>
                          </a-dropdown>
                        </a-form-item>

                        <a-form-item>
                          <template #label>
                            <span class="bold-label">Thông tin nhận hàng</span>
                          </template>
                          <p class="fs-14">{{ orderDetailCurrent.username }}</p>
                          <p class="fs-14">{{ orderDetailCurrent.address }}</p>
                          <p class="fs-14">{{ orderDetailCurrent.phone }}</p>
                        </a-form-item>

                        <a-form-item>
                          <template #label>
                            <span class="bold-label">Hình thức thanh toán</span>
                          </template>
                          <p class="fs-14">
                            {{
                              orderDetailCurrent.paymentMethod == "default"
                                ? "Thanh toán khi nhận hàng"
                                : "Thanh toán trực tuyến"
                            }}
                          </p>
                        </a-form-item>

                        <a-form-item>
                          <template #label>
                            <span class="bold-label">Tổng giá trị</span>
                          </template>
                          <p class="fs-14">
                            {{
                              orderDetailCurrent &&
                              orderDetailCurrent.totalPrice
                                ? orderDetailCurrent.totalPrice.toLocaleString(
                                    "vi-VN"
                                  )
                                : "0"
                            }}
                            đ
                          </p>
                        </a-form-item>

                        <a-form-item
                          label="Ghi chú"
                          v-if="orderDetailCurrent.note !== ''"
                        >
                          <p class="fs-14">{{ orderDetailCurrent.note }}</p>
                        </a-form-item>
                      </a-form>
                    </div>

                    <!-- Cột 2: Danh sách sản phẩm -->
                    <div style="flex: 1">
                      <span class="bold-label">Danh sách sản phẩm</span>
                      <a-table
                        :columns="columnsListProduct"
                        :data-source="dataListProduct"
                        :pagination="false"
                        style="margin-top: 8px"
                      >
                        <template #bodyCell="{ column }">
                          <template v-if="column.key === 'operation'">
                            <a>action</a>
                          </template>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </a-modal>

                <!-- Kết thúc xử lý sửa -->
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
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import {
  getAllOrder,
  getOrderByOrderIdOfAdmin,
  updateStatusOrder,
} from "@/apis/modules/api.order";
import {
  EditOutlined,
  SearchOutlined,
  DownOutlined,
} from "@ant-design/icons-vue";
import { formatDate } from "@/utils/formatDate";
import { message } from "ant-design-vue";
import { formatNumberWithDots } from "@/utils/formatStringNumber";

const formState = reactive({
  productName: "",
  subcategory: "",
  image: "",
  price: "",
});

const loading = ref(false);
const iconLoading = ref(false);
const data = ref([]);
const searchValue = ref("");

const page = ref(1);
const perPage = ref(10);
const total = ref(0);

const columns = ref([
  {
    title: "Mã đơn hàng",
    width: 50,
    dataIndex: "orderId",
    key: "orderId",
    fixed: "left",
  },
  {
    title: "Tên khách hàng",
    width: 30,
    dataIndex: "username",
    key: "username",
    fixed: "left",
    sorter: (a, b) => a.username.localeCompare(b.username),
  },
  {
    title: "Tổng giá trị (VNĐ)",
    dataIndex: "totalPrice",
    key: "totalPrice",
    width: 30,
    sorter: (a, b) => a.totalPrice.localeCompare(b.totalPrice),
  },
  {
    title: "Hình thức thanh toán",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    width: 50,
    sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
  },
  {
    title: "Trạng thái đơn hàng",
    dataIndex: "status",
    key: "status",
    width: 50,
    sorter: (a, b) => a.status.localeCompare(b.status),
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
    const response = await getAllOrder({
      page: page.value,
      perPage: perPage.value,
      search: searchValue.value,
    });

    data.value = response.rows.map((order) => ({
      key: order.id,
      orderId: order.id,
      username: order.user.username,
      totalPrice: order.totalPrice
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, "."),
      paymentMethod:
        order.paymentMethod == "default"
          ? "Thanh toán khi nhận hàng"
          : "Thanh toán trực tuyến",
      status: order.status,
      createdAt: formatDate(order.createdAt),
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
const open = ref(false);
const statusOrderCurrent = ref("");
const orderDetailCurrent = ref({});

const columnsListProduct = [
  {
    title: "Tên sản phẩm",
    width: 50,
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Số lượng",
    width: 10,
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Giá",
    width: 10,
    dataIndex: "price",
    key: "price",
  },
];

const dataListProduct = ref([]);

const onClose = () => {
  open.value = false;
};

const showModal = () => {
  open.value = true;
};

const handleGetOderDetail = async (orderId) => {
  try {
    orderDetailCurrent.value = await getOrderByOrderIdOfAdmin(orderId);
    statusOrderCurrent.value = orderDetailCurrent.value.status;
    dataListProduct.value = orderDetailCurrent.value.listProduct.map(
      (item) => ({
        key: item.id,
        name:
          item.detailProduct?.product?.productName +
          item.detailProduct?.content,
        quantity: item.quantity,
        price: formatNumberWithDots(item?.price),
      })
    );
    showModal();
  } catch (err) {
    console.log(err);
  }
};

const handleMenuClick = (e) => {
  const selectedKey = e.key;
  switch (selectedKey) {
    case "1":
      statusOrderCurrent.value = "Chờ xác nhận";
      break;
    case "2":
      statusOrderCurrent.value = "Đã xác nhận";
      break;
    case "3":
      statusOrderCurrent.value = "Đang giao hàng";
      break;
    case "4":
      statusOrderCurrent.value = "Giao hàng thành công";
      break;
    case "5":
      statusOrderCurrent.value = "Giao hàng thất bại";
      break;
    case "6":
      statusOrderCurrent.value = "Đã hủy";
      break;
  }
};

const handleSubmitChangeStatus = async () => {
  try {
    open.value = false;
    handleEdit();
    await updateStatusOrder({
      orderId: orderDetailCurrent.value.id,
      status: statusOrderCurrent.value,
    });
    message.success("Cập nhật trạng thái thành công");
    fetchData();
  } catch (err) {
    console.log(err);
  }
};
</script>

<style scoped>
.ant-modal-mask {
  background-color: none !important;
}
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
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
