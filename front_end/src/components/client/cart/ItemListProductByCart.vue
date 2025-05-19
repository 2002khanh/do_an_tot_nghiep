<template>
  <li class="header-cart-item flex-w flex-t m-b-12">
    <div
      class="header-cart-item-img"
      @click="handleRemoveProductOfCart(product.detailProduct.id)"
    >
      <img :src="fullImageUrl" alt="IMG" />
    </div>

    <div class="header-cart-item-txt p-t-8">
      <a class="header-cart-item-name m-b-18 hov-cl1 trans-04">
        {{ fullNameProduct }}
      </a>

      <span class="header-cart-item-info">
        {{ product?.quantity }} x {{ processedPrice }} đ
      </span>
    </div>
  </li>
</template>

<script>
import { formatNumberWithDots } from "@/utils/formatStringNumber";
import config from "@/configs/config";
import { computed, toRefs } from "vue";
import { deleteProductOfCart } from "@/apis/modules/api.cart";
import { useStore } from "vuex";
import displayToast from "@/utils/handleToast";
import { typeAlertBox } from "@/constants/enum";
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();

    const { product } = toRefs(props);

    const fullImageUrl = computed(() => {
      return config.MINIO_URL + product.value?.detailProduct?.product?.image;
    });

    const fullNameProduct = computed(() => {
      const productName = product.value?.detailProduct?.product?.productName;
      const detailProductName = product.value?.detailProduct?.content;
      return `${productName} - ${detailProductName}`;
    });

    const processedPrice = computed(() => {
      return formatNumberWithDots(
        product.value.detailProduct?.finalPrice
          ? product.value.detailProduct?.finalPrice
          : product.value.detailProduct?.price
      );
    });

    const handleRemoveProductOfCart = async (productId) => {
      try {
        await deleteProductOfCart(productId);
        displayToast(
          store.dispatch,
          typeAlertBox.SUCCESS,
          "Xóa sản phẩm thành công"
        );
        store.dispatch("cart/setCartAction");
      } catch (err) {
        displayToast(store.dispatch, typeAlertBox.ERROR, "Có lỗi xảy ra");
      }
    };

    return {
      fullImageUrl,
      processedPrice,
      handleRemoveProductOfCart,
      fullNameProduct,
    };
  },
};
</script>

<style></style>
