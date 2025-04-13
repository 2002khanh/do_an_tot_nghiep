<template>
  <div class="wrap-modal1 js-modal1 p-t-60 p-b-20 show-modal1">
    <div class="overlay-modal1"></div>

    <div
      class="container"
      style="
        max-width: 1000px !important;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      "
    >
      <div class="bg0 p-t-60 p-b-30 p-lr-15-lg how-pos3-parent">
        <button class="how-pos3 hov3 trans-04" @click="handleCloseCartModal">
          <img
            :src="`${config.MINIO_URL}icons/icon-close.png`"
            alt="CLOSE"
            style="
              padding: 4px;
              color: #000;
              background: #ccc;
              border-radius: 25px;
            "
          />
        </button>

        <div class="row" style="height: 60%">
          <div
            class="col-md-6 col-lg-7 p-b-30"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 0 62px;
            "
          >
            <div class="p-l-25 p-r-30 p-lr-0-lg">
              <div class="wrap-slick3 flex-sb flex-w">
                <div class="wrap-slick3-dots"></div>
                <div class="wrap-slick3-arrows flex-sb-m flex-w"></div>

                <div class="gallery-lb">
                  <div
                    class="item-slick3"
                    data-thumb="images/product-detail-01.jpg"
                  >
                    <div class="wrap-pic-w pos-relative">
                      <img :src="fullImageUrl" alt="IMG-PRODUCT" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-l-25 p-r-30 p-lr-0-lg">
              <div
                class="wrap-slick3 flex-sb flex-w"
                style="padding: 30px 0 0 0"
              >
                <b v-if="detailProduct.description">Mô tả:</b>
                <div class="wrap-slick3-arrows flex-sb-m flex-w"></div>

                <div class="gallery-lb">
                  <div
                    class="item-slick3"
                    data-thumb="images/product-detail-01.jpg"
                  >
                    <div class="wrap-pic-w pos-relative">
                      <div
                        class="product-description-container"
                        style="white-space: pre-line"
                      >
                        {{ detailProduct.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-5 p-b-30">
            <div class="p-r-50 p-t-5 p-lr-0-lg">
              <h4 class="cl2 js-name-detail p-b-14" style="line-height: 40px">
                {{ detailProduct.productName }}
              </h4>

              <p class="stext-102 cl3 p-t-23" style="font-size: 13px">
                <a-rate
                  style="font-size: 14px"
                  disabled
                  :value="detailProduct.rateAvg"
                />
                <span style="margin: 0 4px"> | </span>
                {{ detailProduct.totalSold }} Đã Bán
                <span style="margin: 0 4px"> | </span>
                {{ detailProduct.rateTotal }} Đánh Giá
              </p>

              <div>
                <a-button
                  @click="showModal(detailProduct.id)"
                  style="margin-top: 8px"
                  >Danh sách đánh giá</a-button
                >
                <a-modal
                  v-model:open="isModalVisible"
                  @cancel="handleCancel"
                  title="Danh sách đánh giá"
                  ok-text="Cập nhật"
                  cancel-text="Hủy bỏ"
                  class="custom-modal"
                  :maskStyle="{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }"
                  :contentWrapperStyle="{ boxShadow: 'none' }"
                  zIndex="100000"
                  :footer="null"
                  v-if="detailProduct.id === detailProductReviewId"
                >
                  <div
                    style="height: 500px; overflow-y: scroll"
                    v-if="reviews && reviews.length > 0"
                  >
                    <div
                      v-for="review in reviews"
                      :key="review.username"
                      class="review-item"
                    >
                      <div class="review-content">
                        <div class="header">
                          <span class="username">{{ review.username }}</span>
                          <a-rate
                            style="font-size: 14px"
                            disabled
                            :value="review.rate"
                          />
                        </div>
                        <div class="details">
                          <p class="product-name">
                            {{ review.productName }}
                          </p>
                          <p class="content">{{ review.content }}</p>
                          <p class="created-at">
                            {{ formatDate(review.createdAt) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="!reviews || reviews.length == 0"
                    style="
                      display: flex;
                      align-items: center;
                      flex-direction: column;
                    "
                  >
                    <a-empty description="Chưa có đánh giá!" />
                  </div>
                </a-modal>
              </div>

              <p
                v-if="idSelectedOption === ''"
                class="stext-102 cl3 p-t-23"
                style="color: #ee4d2d; font-weight: 500"
              >
                Giá thành:
                <template v-if="processedPrice.displayFinalPrice">
                  <span
                    style="
                      text-decoration: line-through;
                      font-size: 12px;
                      color: #ee4d2d;
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
                <br />
              </p>
              <p
                v-if="idSelectedOption !== ''"
                class="stext-102 cl3 p-t-23"
                style="color: #ee4d2d; font-weight: 500"
              >
                Giá thành: {{ currentPrice }}<br />
              </p>

              <p class="stext-102 cl3 p-t-23" v-if="detailProduct.subcategory">
                Thương hiệu:
                {{ detailProduct.trademark }}
              </p>

              <p class="stext-102 cl3 p-t-23" v-if="detailProduct.subcategory">
                Tình trạng:
                {{ processedStatus }}
              </p>

              <p class="stext-102 cl3 p-t-23" v-if="detailProduct.subcategory">
                Số lượng trong kho:
                {{ currentQuantity }}
              </p>

              <div class="stext-102 cl3 p-t-23">
                {{ detailProduct.detailName }}:
                <div class="product-options">
                  <div
                    class="option"
                    v-for="(item, index) in listOptions"
                    :key="index"
                    :class="{ 'option-disabled': item.quantity === 0 }"
                  >
                    <input
                      type="radio"
                      :id="item.id"
                      name="productOption"
                      :value="item.content"
                      @change="handleOptionChange(item)"
                      :disabled="item.quantity === 0"
                    />
                    <label :for="item.id" style="display: block">
                      <span>{{ item.content }}</span>
                      <span class="tooltip">{{ item.content }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div
                class="flex-w flex-r-m p-b-10"
                style="justify-content: flex-start; margin-top: 12px"
              >
                <div class="size-204 flex-w flex-m respon6-next">
                  <div class="wrap-num-product flex-w m-r-20 m-tb-10">
                    <div
                      class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                      @click="handleChangeNumberProduct(-1)"
                    >
                      <i class="fs-16 zmdi zmdi-minus"></i>
                    </div>

                    <input
                      class="mtext-104 cl3 txt-center num-product"
                      type="number"
                      v-model="numberProduct"
                      readonly
                    />

                    <div
                      class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                      @click="handleChangeNumberProduct(1)"
                    >
                      <i class="fs-16 zmdi zmdi-plus"></i>
                    </div>
                  </div>
                </div>
              </div>

              <button
                class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail"
                style="margin-top: 20px"
                @click="handleAddCart()"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRefs, computed, ref } from "vue";
import { formatNumberWithDots } from "@/utils/formatStringNumber";
import { createACart } from "@/apis/modules/api.cart";
import config from "@/configs/config";
import { useStore } from "vuex";
import displayToast from "@/utils/handleToast";
import { typeAlertBox } from "@/constants/enum";
import { getReviewByProduct } from "@/apis/modules/api.product_review";
export default {
  props: {
    isOpen: {
      type: Boolean,
    },

    detailProduct: {
      type: Object,
    },

    handleCloseModal: {
      type: Function,
    },
  },

  methods: {
    handleCloseCartModal() {
      this.handleCloseModal();
    },
  },

  setup(props) {
    const store = useStore();
    const { detailProduct } = toRefs(props);

    const isLogin = computed(() => store.state.auth.isLogin);
    const currentQuantity = ref(0);
    const idSelectedOption = ref("");
    const numberProduct = ref(0);
    const currentPrice = ref("0đ");

    const isModalVisible = ref(false);
    const reviews = ref([]);
    const detailProductReviewId = ref("");

    const showModal = async (detailProductId) => {
      detailProductReviewId.value = detailProductId;
      isModalVisible.value = true;
      const response = await getReviewByProduct(detailProductReviewId.value);
      reviews.value = response.map((item) => {
        return {
          productName: `${item.product?.product?.productName} - ${item.product?.content}`,
          rate: item.rate,
          content: item.content,
          createdAt: item.createdAt,
          username: item?.user.username,
          avatar: item.user?.avatar,
        };
      });
    };

    const handleCancel = () => {
      isModalVisible.value = false;
    };

    const fullImageUrl = computed(
      () => `${config.MINIO_URL}${detailProduct.value.image}`
    );

    const processedPrice = computed(() => {
      const lstPrices =
        detailProduct.value.detailProducts?.map((item) => item.price) || [];

      let lstFinalPrices = detailProduct.value.detailProducts
        ?.filter((item) => item.finalPrice !== undefined)
        .map((item) => item.finalPrice);

      if (lstPrices.length === 0) return "0đ";

      lstPrices.sort((a, b) => a - b);
      lstFinalPrices.sort((a, b) => a - b);

      const [firstPrice, lastPrice] = [
        lstPrices[0],
        lstPrices[lstPrices.length - 1],
      ];

      const [firstFinalPrice, lastFinalPrice] = [
        lstFinalPrices[0],
        lstFinalPrices[lstFinalPrices.length - 1],
      ];

      let displayFinalPrice = null;

      if (lstFinalPrices.length > 0) {
        displayFinalPrice =
          firstFinalPrice === lastFinalPrice
            ? `${formatNumberWithDots(firstFinalPrice)}đ`
            : `${formatNumberWithDots(
                firstFinalPrice
              )}đ - ${formatNumberWithDots(lastFinalPrice)}đ`;
      }

      const displayPrice =
        firstPrice === lastPrice
          ? `${formatNumberWithDots(firstPrice)}đ`
          : `${formatNumberWithDots(firstPrice)}đ - ${formatNumberWithDots(
              lastPrice
            )}đ`;

      return {
        displayPrice: displayPrice,
        displayFinalPrice: displayFinalPrice,
      };
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString();
    };

    const processedStatus = computed(() => {
      const detailProducts = detailProduct.value.detailProducts || [];
      return detailProducts.some((item) => item.quantity > 0)
        ? "Còn hàng"
        : "Hết hàng";
    });

    const listOptions = computed(() => {
      return (
        detailProduct.value.detailProducts?.map((item) => ({
          id: item.id,
          content: item.content,
          quantity: item.quantity,
          price: item.price,
          finalPrice: item.finalPrice || null,
        })) || []
      );
    });

    const infoChangeNumberProduct = computed(() => {
      return (
        detailProduct.value.detailProducts?.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          currentQuantity: 1,
        })) || []
      );
    });

    const updateChangeProduct = (value) => {
      currentQuantity.value = value.quantity;
      idSelectedOption.value = value.id;
      infoChangeNumberProduct.value?.forEach((item) => {
        if (item.id === value.id) numberProduct.value = item.currentQuantity;
      });

      currentPrice.value = `${formatNumberWithDots(
        value.finalPrice ? value.finalPrice : value.price
      )}đ`;
    };

    const handleOptionChange = (value) => {
      updateChangeProduct(value);
    };

    const handleChangeNumberProduct = (number) => {
      if (!idSelectedOption.value) return;
      const newQuantity = numberProduct.value + number;
      if (newQuantity > currentQuantity.value) {
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          "Vượt quá số lượng trong kho!"
        );
        return;
      } else if (newQuantity < 1) {
        return;
      }

      numberProduct.value = newQuantity;
      infoChangeNumberProduct.value?.forEach((item) => {
        if (item.id === idSelectedOption.value)
          item.currentQuantity = numberProduct.value;
      });
    };

    const handleAddCart = async () => {
      if (!isLogin.value) {
        return displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          "Vui lòng thực hiện đăng nhập"
        );
      }

      if (idSelectedOption.value === "") {
        return displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          "Vui lòng chọn sản phẩm"
        );
      }

      try {
        const numberProduct = ref(1);
        infoChangeNumberProduct.value?.forEach((item) => {
          if (item.id === idSelectedOption.value)
            numberProduct.value = item.currentQuantity;
        });

        await createACart({
          detailProduct: idSelectedOption.value,
          quantity: numberProduct.value,
        });

        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Thêm sản phẩm thành công"
        );
        store.dispatch("cart/setCartAction");
      } catch (err) {
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          err?.response?.data?.message
        );
      }
    };

    return {
      fullImageUrl,
      processedPrice,
      currentPrice,
      processedStatus,
      listOptions,
      handleAddCart,
      numberProduct,
      handleChangeNumberProduct,
      handleOptionChange,
      isLogin,
      currentQuantity,
      idSelectedOption,
      config,
      isModalVisible,
      showModal,
      reviews,
      handleCancel,
      detailProductReviewId,
      formatDate,
    };
  },
};
</script>

<style scoped>
.product-description-container {
  max-height: 350px; /* Chiều cao tối đa cho phần mô tả */
  overflow-y: auto; /* Hiển thị thanh cuộn khi nội dung vượt quá chiều cao */
  padding-right: 10px; /* Thêm padding để tránh nội dung bị che bởi thanh cuộn */
  text-align: justify;
  font-size: 14px;
}

/* Tùy chỉnh thanh cuộn */
.product-description-container::-webkit-scrollbar {
  width: 6px;
}

.product-description-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.product-description-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.product-description-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.review-item {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
}

.review-content {
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.username {
  font-weight: bold;
}

.rate {
  color: #f39c12;
}

.details {
  padding: 5px 0;
}

.product-name {
  font-style: italic;
  font-size: 14px;
}

.content {
  margin: 10px 0;
}

.created-at {
  color: #888;
  font-size: 0.9em;
}
.product-options {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 320px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  position: relative; /* Thêm position relative để sử dụng cho tooltip */
  width: 120px; /* Hard code width */
  height: 40px; /* Hard code height */
}

.option input[type="radio"] {
  display: none;
}

.option label {
  width: 100%; /* Đảm bảo label chiếm toàn bộ chiều rộng */
  height: 100%; /* Đảm bảo label chiếm toàn bộ chiều cao */
  padding: 6px 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  overflow: hidden; /* Ẩn nội dung vượt quá */
  text-overflow: ellipsis; /* Hiển thị dấu "..." nếu nội dung tràn */
}

.option input[type="radio"]:checked + label {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.option label:hover {
  border-color: #007bff;
}

/* Tooltip styling */
.option:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px 10px;
  z-index: 1;
  bottom: 100%; /* Hiển thị tooltip ở trên */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.option-disabled label {
  position: relative;
  opacity: 0.6;
  pointer-events: none;
}
</style>
