<template>
  <!-- Cart -->
  <div class="wrap-header-cart js-panel-cart">
    <div class="s-full js-hide-cart"></div>

    <div class="header-cart flex-col-l p-l-65 p-r-25">
      <div class="header-cart-title flex-w flex-sb-m p-b-8">
        <span class="mtext-103 cl2"> Giỏ hàng của tôi </span>

        <div
          class="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart"
        >
          <i class="zmdi zmdi-close"></i>
        </div>
      </div>

      <div
        class="header-cart-content flex-w js-pscroll"
        style="flex-grow: inherit; width: 300px"
      >
        <list-product-by-cart
          :listProduct="listProductOfCart"
        ></list-product-by-cart>

        <div
          class="w-full"
          v-if="totalProductOfCart !== 0"
          style="margin-top: 16px"
        >
          <div class="header-cart-buttons flex-w w-full">
            <router-link
              class="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
              to="/shoping-cart"
            >
              Xem Chi Tiết</router-link
            >
            <!-- 
            <a
              href="shoping-cart.html"
              class="flex-c-m stext-101 cl0 size-107 bg3 bor2 p-lr-15 trans-04 m-b-10"
            >
              Đặt Hàng
            </a> -->
          </div>
        </div>

        <div class="card-body cart" v-if="totalProductOfCart === 0">
          <div class="col-sm-12 empty-cart-cls text-center">
            <img
              src="https://i.imgur.com/dCdflKN.png"
              width="130"
              height="130"
              class="img-fluid mb-4 mr-3"
            />
            <h3>
              <strong style="font-size: 20px; font-weight: 200"
                >Chưa có sản phẩm trong giỏ hàng</strong
              >
            </h3>
            <!-- <a class="btn btn-primary cart-btn-transform m-3" data-abc="true">
              <router-link to="/home" style="color: white !important"
                >Tiếp tục mua sắm</router-link
              ></a
            > -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import ListProductByCart from "./ListProductByCart.vue";
import { useStore } from "vuex";
export default {
  components: { ListProductByCart },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("cart/setCartAction");
    });

    const listProductOfCart = computed(
      () => store.state.cart.listProductOfCart
    );

    const totalProductOfCart = computed(
      () => store.state.cart.totalProductOfCart
    );

    return {
      listProductOfCart,
      totalProductOfCart,
    };
  },
};
</script>

<style scoped>
/* @import url(http://fonts.googleapis.com/css?family=Calibri:400,300,700);

body {
  background-color: #eee;
  font-family: "Calibri", sans-serif !important;
}

.mt-100 {
  margin-top: 100px;
}

.card {
  margin-bottom: 30px;
  border: 0;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  border-radius: 8px;
  -webkit-box-shadow: 1px 5px 24px 0 rgba(68, 102, 242, 0.05);
  box-shadow: 1px 5px 24px 0 rgba(68, 102, 242, 0.05);
}

.card .card-header {
  background-color: #fff;
  border-bottom: none;
  padding: 24px;
  border-bottom: 1px solid #f6f7fb;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card-header:first-child {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}

.card .card-body {
  padding: 30px;
  background-color: transparent;
}

.btn-primary,
.btn-primary.disabled,
.btn-primary:disabled {
  background-color: #4466f2 !important;
  border-color: #4466f2 !important;
} */
</style>
