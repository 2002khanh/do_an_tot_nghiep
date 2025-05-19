<template>
  <div class="dashboard-content">
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="dashboard-list-box margin-top-0">
          <div class="booking-requests-filter"></div>

          <!-- <div id="small-dialog" class="zoom-anim-dialog mfp-hide">
            <div class="small-dialog-header">
              <h3>Send Message</h3>
            </div>
            <div class="message-reply margin-top-0">
              <textarea
                cols="40"
                rows="3"
                placeholder="Your Message to Kathy"
              ></textarea>
              <button class="button">Send</button>
            </div>
          </div> -->

          <h4>Danh sách đơn hàng</h4>
          <ul v-if="listOrderByUser.length > 0">
            <li
              style="cursor: pointer"
              class="pending-booking"
              v-for="(order, index) in listOrderByUser"
              :key="index"
              @click="goToOrderDetail(order.id)"
            >
              <div class="list-box-listing bookings">
                <!-- <div class="list-box-listing-img">
                  <img
                    src="http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&s=120"
                    alt=""
                  />
                </div> -->
                <div class="list-box-listing-content">
                  <div class="inner">
                    <h3>
                      Thông tin đơn hàng
                      <span
                        :class="{
                          'booking-status': true,
                          pending: true,
                          'color-status-cancel': order.status === 'Đã hủy',
                        }"
                      >
                        {{ order.status }}
                      </span>
                    </h3>

                    <div class="inner-booking-list d-flex">
                      <ul class="booking-list">
                        <li>Mã đơn hàng: {{ order.id }}</li>
                      </ul>
                    </div>

                    <div class="inner-booking-list d-flex">
                      <ul class="booking-list">
                        <li>Họ tên: {{ order.user.username }}</li>
                      </ul>
                    </div>

                    <div class="inner-booking-list d-flex">
                      <ul class="booking-list">
                        <li class="">Số điện thoại: {{ order.phone }}</li>
                      </ul>
                    </div>

                    <div class="inner-booking-list d-flex">
                      <ul class="booking-list">
                        <li class="">
                          Ngày đặt hàng: {{ formattedDate(order.createdAt) }}
                        </li>
                      </ul>
                    </div>

                    <div class="inner-booking-list d-flex">
                      <ul class="booking-list">
                        <li>
                          Tổng thanh toán:
                          {{ order.totalPrice.toLocaleString("de-DE") || 0 }} đ
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div style="margin: 30px 0"></div>
          <template v-if="listOrderByUser.length === 0">
            <a-empty description="Bạn chưa có đơn hàng nào" />
            <div style="margin: 100px 0"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { getOrderByUser } from "@/apis/modules/api.order";
import router from "@/router/router.main";
export default {
  components: {},
  setup() {
    const current = ref(2);
    const listOrderByUser = ref([]);
    const perPage = ref(5);
    const page = ref(1);

    onMounted(async () => {
      listOrderByUser.value = (await getOrderByUser()).rows;
    });

    const goToOrderDetail = (id) => {
      router.push({ name: "order-history-detail", params: { id } });
    };

    const formattedDate = (dateTimeString) => {
      const date = new Date(dateTimeString);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      return date.toLocaleString("en-US", options);
    };

    return {
      listOrderByUser,
      formattedDate,
      goToOrderDetail,
      current,
      perPage,
      page,
    };
  },
};
</script>

<style scoped>
.mr-8 {
  margin-right: 8px;
}

.color-status-cancel {
  background-color: red !important;
}
</style>
