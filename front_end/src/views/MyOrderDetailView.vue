<template>
  <div class="container">
    <article class="card">
      <div class="card-body">
        <div style="display: flex; justify-content: space-between">
          <h6 style="margin: 12px 0;">Mã đơn hàng: {{ orderDetail.id }}</h6>
                    <a-button type="primary" @click="handleDelete(orderDetail.id)">
                <PlusOutlined /> Hủy đơn hàng
              </a-button>
        </div>
        <article class="card">
          <div class="card-body">
            <div class="row mb-3">
              <div class="col">
                <strong>Thời gian đặt hàng:</strong><br />
                {{ new Date(orderDetail.createdAt).toLocaleString("en-GB") }}
              </div>
              <div class="col">
                <strong>Trạng thái:</strong><br />
                {{ orderDetail.status }}
              </div>
              <div class="col">
                <strong>Hình thức thanh toán:</strong><br />
                {{ orderDetail.paymentMethod === 'card' ? 'Thanh toán trực tuyến' : 'Thanh toán khi nhận hàng' }}
              </div>
            </div>
              <div class="row mb-3">
              <div class="col">
                <strong>Thông tin nhận hàng:</strong><br />
                <i class="fa-regular fa-user icon-custom"></i>{{ orderDetail.username }}
                <br/>
                <i class="fa-solid fa-phone icon-custom"></i>{{ orderDetail.phone }}
                <br/>
                <i class="fa-solid fa-location-dot icon-custom"></i>{{ orderDetail.address }}
              </div>
              <div class="col">
                <strong>Tổng giá trị đơn hàng:</strong><br />
                   {{ orderDetail.totalPrice?.toLocaleString('de-DE') || '0' }} đ
              </div>
              <div class="col">
                <strong>Ghi chú:</strong><br />
                {{ orderDetail.note }}
              </div>
            </div>
          </div>
          <span style="margin-left: 20px; font-style: italic; font-size: 12px">Lưu ý: Khách hàng có thể thực hiện đánh giá sản phẩm sau khi giao hàng thành công</span>
        </article>

        <div class="track" v-if="orderDetail.status && orderDetail.status !== 'Đã hủy'">
          <div class="step" :class="{ active: statusOrder.pending }">
            <span class="icon"> <i class="fa-regular fa-clock"></i> </span>
            <span class="text">Chờ xác nhận</span>
          </div>
          <div class="step" :class="{ active: statusOrder.confirmed }">
            <span class="icon"> <i class="fa fa-check"></i> </span>
            <span class="text">Đã xác nhận</span>
          </div>
          <div class="step" :class="{ active: statusOrder.delivery }">
            <span class="icon"> <i class="fa fa-truck"></i> </span>
            <span class="text"> Đang giao hàng </span>
          </div>
          <div class="step" :class="{ active: statusOrder.delivered }">
            <span class="icon"> <i class="fa fa-box"></i> </span>
            <span class="text">Giao hàng thành công</span>
          </div>
        </div>

        <div class="track" v-if="orderDetail.status && orderDetail.status === 'Đã hủy'" style="background-color: #ffc9c9">
          <div class="step" :class="{ active: statusOrder.delivered }">
            <span class="icon" style="color: #fff; background-color: red"> <i class="fa-solid fa-xmark"></i> </span>
            <span class="text">Đã hủy</span>
          </div>
        </div>

        <hr />
        <ul class="row">
          <li
            class="col-md-4"
            v-for="(item, index) in orderDetail.listProduct"
            :key="index"
            :class="{ eventCursor: statusOrder.delivered == true }"
            @click="statusOrder.delivered == true ? handleChangeReview(item) : null"
          >
            <figure class="itemside mb-3">
              <div class="aside">
                <img
                  :src="`${config.MINIO_URL}` + item.detailProduct?.product?.image"
                  class="img-sm border"
                />
              </div>
              <div class="info align-self-center">
                <p class="title">
                  Sản phẩm: {{ item.detailProduct?.product?.productName }} - {{ item.detailProduct?.content }} <br />
                  Số lượng: {{ item.quantity }}
                </p>
                <span class="text-muted">
                  Giá: {{ item.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".") }} đ
                </span>
                 <p class="title" style="font-size: 12px; color: orange; font-style: italic">
                  {{ listProductReviewed.includes(item.detailProduct.id) == true ? "Đã đánh giá, nhấn để xem": null}} <br />
                </p>
              </div>
            </figure>
          </li>
        </ul>
        <hr />
        <div class="btn btn-primary" data-abc="true" style="cursor: pointer">
          <router-link to="/order-history/" style="color: white; margin-left: 8px">
                    <i class="fa fa-chevron-left"></i>
            Trở lại trang trước
          </router-link>
        </div>
      </div>
    </article>

    <!-- Modal tạo đánh giá sản phẩm -->
    <modal-create-review-product ref="reviewModal"></modal-create-review-product>
  </div>
</template>

<script>
import { getOrderByOrderId, handleCancelOrder } from "@/apis/modules/api.order";
import ModalCreateReviewProduct from "@/components/client/review_product/modal.create_review_product.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { TypeOrder } from "@/constants/enum";
import config from "@/configs/config"
import displayToast from '@/utils/handleToast';
import { useStore } from 'vuex';
import { typeAlertBox } from "@/constants/enum";
import { isReviewedAPI } from '@/apis/modules/api.product_review';

export default {
  components: {
    ModalCreateReviewProduct
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const orderDetail = ref({});
    const statusOrder = ref({
      pending: true,
      confirmed: false,
      delivery: false,
      delivered: false,
    });
    let listProductReviewed = ref([])

    const orderId = route.params.id;
    const reviewModal = ref(null);

    const fetchData = async () => {
      orderDetail.value = await getOrderByOrderId(orderId);

      const listProductId = orderDetail.value.listProduct.map((item) => item.detailProduct?.id)

      const promises = listProductId.map((productId) => {
        return isReviewedAPI({
          productId: productId,
          orderId: orderId,
        });
      })

      const result = await Promise.all(promises)
      listProductReviewed.value = result.map((item) => 
        item?.product?.id ? item?.product?.id : null
      )

      switch (orderDetail.value.status) {
        case TypeOrder.CONFIRMED:
          statusOrder.value = {
            pending: true,
            confirmed: true,
            delivery: false,
            delivered: false,
          };
          break;

        case TypeOrder.DELIVERY:
          statusOrder.value = {
            pending: true,
            confirmed: true,
            delivery: true,
            delivered: false,
          };
          break;

        case TypeOrder.DELIVERED:
          statusOrder.value = {
            pending: true,
            confirmed: true,
            delivery: true,
            delivered: true,
          };
          break;
      }
    };

    const handleChangeReview = (productSelected) => {
      if (reviewModal.value) {
        reviewModal.value.showModal({
          productSelected,
          orderId: orderDetail.value.id
        });
      }
    };

    const handleDelete = async (orderId) => {
      try {
        await handleCancelOrder(orderId)
        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Hủy đơn thành công!"
        );
        fetchData()
      }
      catch (err) {
        console.log(err)
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          err?.response?.data?.message || 'Có lỗi xảy ra'
        );
      }
    }

    onMounted(() => {
      fetchData();
    });

    return {
      orderDetail,
      statusOrder,
      handleChangeReview,
      reviewModal,
      handleDelete,
      config,
      listProductReviewed
    };
  }
};
</script>

<style scoped>
body {
  background-color: #eeeeee;
}
.container {
  margin-top: 50px;
  margin-bottom: 50px;
}

.eventCursor {
  cursor: pointer;
}

.icon-custom {
  width: 25px;
}

.card {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.1rem;
}
.card-header:first-child {
  border-radius: calc(0.37rem - 1px) calc(0.37rem - 1px) 0 0;
}
.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.track {
  position: relative;
  background-color: #ddd;
  height: 7px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 60px;
  margin-top: 50px;
}
.track .step {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  width: 25%;
  margin-top: -18px;
  text-align: center;
  position: relative;
}
.track .step.active:before {
  background: #338bea;
}
.track .step::before {
  height: 7px;
  position: absolute;
  content: "";
  width: 100%;
  left: 0;
  top: 18px;
}
.track .step.active .icon {
  background: #007bff;
  color: #fff;
}
.track .icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  position: relative;
  border-radius: 100%;
  background: #ddd;
}
.track .step.active .text {
  font-weight: 400;
  color: #000;
}
.track .text {
  display: block;
  margin-top: 7px;
}
.itemside {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
}
.itemside .aside {
  position: relative;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}
.img-sm {
  width: 80px;
  height: 80px;
  padding: 7px;
}
ul.row,
ul.row-sm {
  list-style: none;
  padding: 0;
}
.itemside .info {
  padding-left: 15px;
  padding-right: 7px;
}
.itemside .title {
  display: block;
  margin-bottom: 5px;
  color: #212529;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
.btn-warning {
  color: #ffffff;
  background-color: #ee5435;
  border-color: #ee5435;
  border-radius: 1px;
}
.btn-warning:hover {
  color: #ffffff;
  background-color: #ff2b00;
  border-color: #ff2b00;
  border-radius: 1px;
}

</style>
