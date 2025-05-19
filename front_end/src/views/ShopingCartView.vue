<template>
  <form class="bg0 p-t-75 p-b-85">
    <div class="container" v-if="totalProductOfCart !== 0">
      <div class="row">
        <div class="col-lg-10 col-xl-7 m-lr-auto m-b-50">
          <div class="m-l-25 m-r--38 m-lr-0-xl">
            <div class="wrap-table-shopping-cart">
              <table class="table-shopping-cart">
                <tr class="table_head">
                  <th class="column-1">Hình ảnh</th>
                  <th class="column-2"></th>
                  <th class="column-3">Giá</th>
                  <th class="column-4">Số lượng</th>
                  <th class="column-5">Giá tiền</th>
                </tr>

                <item-list-product-by-shoping
                  v-for="(item, index) in listProductOfCart"
                  :key="index"
                  :product="item"
                  @update-quantity="updateCart"
                ></item-list-product-by-shoping>
              </table>
            </div>
          </div>
        </div>

        <div class="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
          <div
            class="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm"
          >
            <div class="flex-w flex-t bor12 p-t-15 p-b-30">
              <div
                class="size-209 p-r-18 p-r-0-sm w-full-ssm"
                style="width: 100%"
              >
                <div class="p-t-15">
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-bottom: 30px;
                    "
                  >
                    <span class="stext-112 cl8"> Thông tin giao hàng </span>
                    <modal-shipping-address></modal-shipping-address>
                  </div>
                  <label style="margin-top: 20px" for=""
                    >Họ tên <span style="color: red"> * </span></label
                  >
                  <div class="bor8 bg0 m-b-12">
                    <input
                      class="stext-111 cl8 plh3 size-111 p-lr-15"
                      type="text"
                      placeholder=""
                      v-model="addressClone.username"
                    />
                  </div>

                  <label style="margin-top: 20px"
                    >Số điện thoại <span style="color: red"> * </span></label
                  >
                  <div class="bor8 bg0 m-b-12">
                    <input
                      class="stext-111 cl8 plh3 size-111 p-lr-15"
                      type="text"
                      placeholder=""
                      v-model="addressClone.phone"
                    />
                  </div>

                  <label style="margin-top: 20px"
                    >Địa chỉ <span style="color: red"> * </span></label
                  >
                  <div class="bor8 bg0 m-b-22">
                    <input
                      class="stext-111 cl8 plh3 size-111 p-lr-15"
                      type="text"
                      placeholder=""
                      v-model="addressClone.address"
                    />
                  </div>

                  <label style="margin-top: 20px">Ghi chú</label>
                  <div class="bor8 bg0 m-b-22">
                    <textarea
                      class="custom-textarea"
                      placeholder=""
                      v-model="noteOrder"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-w flex-t p-t-27 p-b-33">
              <div class="size-208">
                <span class="mtext-101 cl2"> Thanh toán: </span>
              </div>

              <div class="size-209 p-t-1">
                <span class="mtext-110 cl2"> {{ totalPriceCart }} đ </span>
              </div>
            </div>
            <a-button
              type="primary"
              :loading="iconLoadingPayCard"
              @click="handlePaymentCard"
              style="width: 100%; height: 50px; font-size: 16px"
            >
              <template #icon><PoweroffOutlined /></template>
              Thanh toán trực tuyến
            </a-button>

            <div style="margin: 18px 0"></div>
            <a-button
              type="primary"
              :loading="iconLoadingPayDefault"
              @click="handlePaymentDefault"
              style="width: 100%; height: 50px; font-size: 16px"
            >
              <template #icon><PoweroffOutlined /></template>
              Thanh toán khi nhận hàng
            </a-button>
          </div>
        </div>
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
        <a class="btn btn-primary cart-btn-transform m-3" data-abc="true">
          <router-link to="/home" style="color: white !important"
            >Tiếp tục mua hàng</router-link
          ></a
        >
      </div>
    </div>
  </form>
</template>

<script>
import ModalShippingAddress from "@/components/client/shoping-cart/ModalShiping.vue";
import { computed, onMounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { createSessionStripe } from "@/apis/modules/api.stripe";
import ItemListProductByShoping from "@/components/client/shoping-cart/ItemListProductByShoping.vue";
import { formatNumberWithDots } from "@/utils/formatStringNumber";
import { createOrder } from "@/apis/modules/api.order";
import displayToast from "@/utils/handleToast";
import { typeAlertBox } from "@/constants/enum";
import { useRouter } from "vue-router";
export default {
  components: { ItemListProductByShoping, ModalShippingAddress },
  setup() {
    const store = useStore();
    const router = useRouter();

    // Xử lý loading
    const iconLoadingPayCard = ref(false);
    const iconLoadingPayDefault = ref(false);
    const enterIconLoadingPayCard = () => {
      iconLoadingPayCard.value = {
        delay: 0,
      };
      setTimeout(() => {
        iconLoadingPayCard.value = false;
      }, 4000);
    };

    const enterIconLoadingPayDefault = () => {
      iconLoadingPayDefault.value = {
        delay: 0,
      };
      setTimeout(() => {
        iconLoadingPayDefault.value = false;
      }, 3000);
    };
    //Kết thúc xử lý

    const noteOrder = ref("");

    const totalProductOfCart = computed(
      () => store.state.cart.totalProductOfCart
    );

    const userAddressCurrent = computed(
      () => store.state.userAddress.userAddressCurrent
    );

    const addressClone = ref(userAddressCurrent.value);

    watchEffect(() => {
      addressClone.value = { ...userAddressCurrent.value };
    });

    const listProductOfCart = computed(
      () => store.state.cart.listProductOfCart
    );

    const totalPriceCart = computed(() => {
      return formatNumberWithDots(
        listProductOfCart.value.reduce((total, item) => {
          const priceCalculate = item.detailProduct?.finalPrice
            ? item.detailProduct?.finalPrice
            : item.detailProduct?.price;
          return total + priceCalculate * item.quantity;
        }, 0)
      );
    });

    onMounted(() => {
      store.dispatch("cart/setCartAction");
    });

    const checkEmtpyField = () => {
      const originalData = {
        username: "",
        address: "",
        phone: "",
      };

      const listKey = Object.keys(addressClone.value);
      for (let key of listKey) {
        if (addressClone.value[key].trim("") !== "") {
          originalData[key] = addressClone.value[key].trim("");
        }
      }
      if (
        originalData.username?.trim() === "" ||
        originalData.address?.trim() === "" ||
        originalData.phone?.trim() === ""
      ) {
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          "Vui lòng điền đầy đủ thông tin đặt hàng!"
        );

        return false;
      }

      return true;
    };

    const handlePaymentCard = async () => {
      if (checkEmtpyField()) {
        enterIconLoadingPayCard();
        const processedListProduct = listProductOfCart.value.map((item) => {
          const productName = item?.detailProduct?.product?.productName;
          const detailProductName = item?.detailProduct?.content;
          return {
            id: item.detailProduct?.id,
            productName: `${productName} - ${detailProductName}`,
            price: item.detailProduct?.price,
            quantity: item.quantity,
            image: item.detailProduct?.product?.image,
          };
        });

        const data = {
          listProduct: processedListProduct,
          username: addressClone.value.username,
          address: addressClone.value.address,
          phone: addressClone.value.phone,
          note: noteOrder.value,
          paymentMethod: "card",
        };

        const result = await createSessionStripe(data);

        window.location.href = result.url;
      }
    };

    const handlePaymentDefault = async () => {
      if (checkEmtpyField()) {
        enterIconLoadingPayDefault();
        const processedListProduct = listProductOfCart.value.map((item) => {
          const productName = item?.detailProduct?.product?.productName;
          const detailProductName = item?.detailProduct?.content;

          return {
            id: item.detailProduct?.id,
            productName: `${productName} - ${detailProductName}`,
            price: item.detailProduct?.finalPrice
              ? item.detailProduct.finalPrice
              : item.detailProduct.price,
            quantity: item.quantity,
          };
        });

        const data = {
          listProduct: processedListProduct,
          username: addressClone.value.username,
          address: addressClone.value.address,
          phone: addressClone.value.phone,
          note: noteOrder.value,
          paymentMethod: "default",
        };

        try {
          await createOrder(data);
          setTimeout(() => {
            displayToast(
              store.dispatch,
              typeAlertBox.SUCCESS,
              "Đặt đơn hàng thành công"
            );

            router.push({ name: "home" });

            store.commit("cart/clearCart");
          }, 3000);
        } catch (err) {
          console.log(err);
        }
      }
    };

    return {
      listProductOfCart,
      totalProductOfCart,
      handlePaymentCard,
      totalPriceCart,
      addressClone,
      noteOrder,
      enterIconLoadingPayCard,
      enterIconLoadingPayDefault,
      iconLoadingPayCard,
      iconLoadingPayDefault,
      userAddressCurrent,
      handlePaymentDefault,
    };
  },
};
</script>

<style scoped>
.custom-textarea {
  height: 8em;
  overflow-y: auto;
  resize: none;
}
</style>
