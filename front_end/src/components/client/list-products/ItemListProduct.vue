<template>
  <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
    <!-- Block2 -->
    <div class="block2">
      <div class="block2-pic hov-img0">
        <div v-if="product?.discountCurrent?.discount" class="discount-badge">
          {{ product?.discountCurrent?.discount }}%
        </div>
        <img :src="fullImageUrl" alt="IMG-PRODUCT" class="product-image" />
        <a
          class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 custom-btn"
          @click="handleAll(product.id)"
        >
          Xem chi tiết
        </a>
      </div>

      <div class="block2-txt flex-w flex-t p-t-14">
        <div class="block2-txt-child1 flex-col-l">
          <span
            class="product-name stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
          >
            {{ product.productName }}
          </span>

          <div class="price-container">
            <div class="price-and-stats">
              <p class="price-display">
                <template v-if="processedPrice.displayFinalPrice">
                  <span class="original-price">
                    {{ processedPrice.displayPrice }}
                  </span>
                  <span class="final-price">{{
                    processedPrice.displayFinalPrice
                  }}</span>
                </template>
                <template v-else>
                  {{ processedPrice.displayPrice }}
                </template>
              </p>
              <div class="product-stats">
                <!-- <p class="stats-item">
                  {{ product.totalSold }} đã bán
                </p> -->
                <!-- <p class="stats-item">{{ product.rateTotal }} đánh giá</p> -->
              </div>
            </div>
          </div>
        </div>

        <div class="block2-txt-child2 flex-r p-t-3" v-if="isLogin">
          <a class="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
            <img
              v-if="!isWishList"
              class="wishlist-icon"
              :src="`${config.MINIO_URL}icons/icon-heart-01.png`"
              alt="ICON"
              @click="handleAddWishList(product.id)"
            />
            <img
              v-if="isWishList"
              class="wishlist-icon"
              :src="`${config.MINIO_URL}icons/icon-heart-02.png`"
              alt="ICON"
              @click="handleRemoveWishList(product.id)"
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
/* Card animation and base styling */
.block2 {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: 0.1s;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  padding: 15px;
  transition: all 0.3s ease;
  background-color: #fff;
  height: 100%;
}

.block2:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Image container styling */
.block2-pic {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

/* Product image styling */
.product-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}

.block2-pic:hover .product-image {
  transform: scale(1.05);
}

/* Discount badge styling */
.discount-badge {
  color: white;
  background-color: #ff4757;
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 2px 8px;
  font-weight: bold;
  font-size: 12px;
  z-index: 1;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Button styling */
.custom-btn {
  cursor: pointer;
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
  opacity: 0;
  background-color: #fff;
  color: #333;
  font-weight: 500;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
}

.block2-pic:hover .custom-btn {
  bottom: 20px;
  opacity: 1;
}

.custom-btn:hover {
  background-color: #6c7ae0 !important;
  color: white !important;
}

/* Product name styling - limiting to 2 lines */
.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  height: 44.8px; /* Fixed height for 2 lines (font-size * line-height * 2) */
  margin-bottom: 8px;
}

/* Price container styling */
.price-container {
  width: 100%;
}

.price-and-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Price styling */
.price-display {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.original-price {
  text-decoration: line-through;
  font-size: 12px;
  color: #888;
  padding-right: 6px;
}

.final-price {
  font-size: 16px;
  color: #ff4757;
}

/* Statistics styling */
.product-stats {
  display: flex;
  font-size: 12px;
  color: #888;
}

.stats-item {
  margin-right: 8px;
}

/* Wishlist icon styling */
.wishlist-icon {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.wishlist-icon:hover {
  transform: scale(1.2);
}

/* Animation keyframes */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

a {
  font-size: 14px;
  text-decoration: none;
}
</style>
