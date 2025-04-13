<template>
  <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
    <!-- Block2 -->
    <div class="block2">
      <div class="block2-pic hov-img0">
        <div
          v-if="product?.discountCurrent?.discount"
          :style="{
            color: 'white',
            backgroundColor: '#ed5656',
            position: 'absolute',
            top: '6px',
            left: '8px',
            padding: '0 8px',
            fontWeight: 'bold',
            fontSize: '12px',
            zIndex: 1,
          }"
        >
          {{ product?.discountCurrent?.discount }}%
        </div>
        <img
          :src="fullImageUrl"
          alt="IMG-PRODUCT"
          style="
             {
              width: 250px;
              height: 250px;
              overflow: hidden;
            }
          "
        />
        <a
          class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 custom-btn"
          @click="handleAll(product.id)"
          style="box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.4)"
        >
          Xem chi tiết
        </a>
      </div>

      <div class="block2-txt flex-w flex-t p-t-14">
        <div class="block2-txt-child1 flex-col-l">
          <span class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
            {{ product.productName }}
          </span>

          <span style="width: 100%">
            <div style="display: flex; justify-content: space-between">
              <p style="font-size: 14px">
                <template v-if="processedPrice.displayFinalPrice">
                  <span
                    style="
                      text-decoration: line-through;
                      font-size: 12px;
                      color: gray;
                      padding-right: 4px;
                    "
                  >
                    {{ processedPrice.displayPrice }}
                  </span>
                  <span style="font-size: 14px">{{
                    processedPrice.displayFinalPrice
                  }}</span>
                </template>
                <template v-else>
                  {{ processedPrice.displayPrice }}
                </template>
              </p>
              <div
                class="d-flex"
                style="
                  font-size: 12px;
                  color: rgb(238, 77, 45);
                  align-items: center;
                "
              >
                <!-- <p style="font-size: 12px; margin-right: 2px">
                  {{ product.totalSold }} đã bán
                </p> -->
                <!-- <p style="font-size: 12px">{{ product.rateTotal }} đánh giá</p> -->
              </div>
            </div>
          </span>
        </div>

        <div class="block2-txt-child2 flex-r p-t-3" v-if="isLogin">
          <a class="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
            <img
              v-if="!isWishList"
              class=""
              :src="`${config.MINIO_URL}icons/icon-heart-01.png`"
              alt="ICON"
              @click="handleAddWishList(product.id)"
              style="cursor: pointer"
            />
            <img
              v-if="isWishList"
              class=""
              :src="`${config.MINIO_URL}icons/icon-heart-02.png`"
              alt="ICON"
              @click="handleRemoveWishList(product.id)"
              style="cursor: pointer"
            />
          </a>
        </div>
      </div>
    </div>
    <teleport to="#app">
      <the-detail-product
        v-show="isOpenModal"
        :isOpen="isOpenModal"
        :handleCloseModal="handleCloseModal"
        :detailProduct="productDetail"
      ></the-detail-product>
    </teleport>
  </div>
</template>

<script>
import { toRefs, computed, ref, watch } from "vue";
import config from "@/configs/config";
import TheDetailProduct from "./TheDetailProduct.vue";
import { getDetailProduct } from "@/apis/modules/api.product";
import { formatNumberWithDots } from "@/utils/formatStringNumber";
import {
  addProductToWishListApi,
  deleteProductWishListApi,
} from "@/apis/modules/api.wish_list";
import { useStore } from "vuex";
import { typeAlertBox } from "@/constants/enum";
import displayToast from "@/utils/handleToast";

export default {
  components: { TheDetailProduct },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const isOpenModal = ref(false);
    const { product } = toRefs(props);
    const isWishList = ref(product.value.isWishList);
    const store = useStore();

    const isLogin = computed(() => store.state.auth.isLogin);

    const fullImageUrl = computed(() => {
      return config.MINIO_URL + product.value.image;
    });

    const processedPrice = computed(() => {
      const detailProducts = product.value.detailProducts || [];

      if (detailProducts.length > 0) {
        const lstPrices = detailProducts.map((item) => item.price);

        let lstFinalPrices = detailProducts
          .filter((item) => item.finalPrice !== undefined)
          .map((item) => item.finalPrice);

        lstPrices.sort((a, b) => a - b);
        lstFinalPrices.sort((a, b) => a - b);

        const firstPrice = lstPrices[0];
        const lastPrice = lstPrices[lstPrices.length - 1];

        const firstFinalPrice = lstFinalPrices[0];
        const lastFinalPrice = lstFinalPrices[lstFinalPrices.length - 1];

        const displayPrice =
          firstPrice === lastPrice
            ? `${formatNumberWithDots(firstPrice)}đ`
            : `${formatNumberWithDots(firstPrice)}đ - ${formatNumberWithDots(
                lastPrice
              )}đ`;

        let displayFinalPrice = null;
        if (lstFinalPrices.length > 0) {
          displayFinalPrice =
            firstFinalPrice === lastFinalPrice
              ? `${formatNumberWithDots(firstFinalPrice)}đ`
              : `${formatNumberWithDots(
                  firstFinalPrice
                )}đ - ${formatNumberWithDots(lastFinalPrice)}đ`;
        }

        return {
          displayPrice: displayPrice,
          displayFinalPrice: displayFinalPrice,
        };
      } else {
        return "0đ";
      }
    });

    const handleCloseModal = () => {
      isOpenModal.value = false;
    };

    const handleOpenModal = () => {
      isOpenModal.value = true;
    };

    const handleAll = (id) => {
      handleOpenModal();
      fetchData(id);
    };

    const handleAddWishList = async (productId) => {
      try {
        await addProductToWishListApi({
          product: productId,
        });

        isWishList.value = true;

        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Thêm sản phẩm vào danh sách yêu thích !"
        );

        store.dispatch("wishList/setWishListAction");
      } catch (err) {
        console.log(err);
      }
    };

    const handleRemoveWishList = async (productId) => {
      try {
        await deleteProductWishListApi(productId);

        isWishList.value = false;
        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Đã xóa sản phẩm khỏi danh sách yêu thích!"
        );
        store.dispatch("wishList/setWishListAction");
      } catch (err) {
        console.log(err);
      }
    };

    const productDetail = ref({});

    const fetchData = async (id) => {
      try {
        const result = await getDetailProduct(id);
        productDetail.value = result;
      } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
      }
    };

    watch(
      () => product.value.isWishList,
      (newValue) => {
        isWishList.value = newValue;
      }
    );

    return {
      fullImageUrl,
      processedPrice,
      isOpenModal,
      handleCloseModal,
      productDetail,
      handleAll,
      handleAddWishList,
      handleRemoveWishList,
      isWishList,
      isLogin,
      config,
    };
  },
};
</script>

<style scoped>
.block2 {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: 0.1s;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

a {
  font-size: 16px;
}

.custom-btn {
  cursor: pointer;
}

.custom-btn:hover {
  color: white !important;
}
</style>
