<template>
  <tr class="table_row">
    <td class="column-1">
      <div
        class="how-itemcart1"
        @click="handleRemoveProductOfCart(product.detailProduct.id)"
      >
        <img :src="fullImageUrl" alt="IMG" />
      </div>
    </td>
    <td class="column-2">{{ fullNameProduct }}</td>
    <td class="column-3">{{ processedPrice }} đ</td>
    <td class="column-4">
      <div class="wrap-num-product flex-w m-l-auto m-r-0">
        <div
          class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
          @click="handleChangeNumberProduct(-1)"
        >
          <i class="fs-16 zmdi zmdi-minus"></i>
        </div>

        <input
          class="mtext-104 cl3 txt-center num-product"
          type="number"
          readonly
          v-model="numberProduct"
        />

        <div
          class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
          @click="handleChangeNumberProduct(1)"
        >
          <i class="fs-16 zmdi zmdi-plus"></i>
        </div>
      </div>
    </td>
    <td class="column-5">{{ totalPriceProduct }} đ</td>
  </tr>
</template>

<script>
import { computed, ref, toRefs } from "vue";
import { useStore } from "vuex";
import config from "@/configs/config";
import { formatNumberWithDots } from "@/utils/formatStringNumber";
import { deleteProductOfCart } from "@/apis/modules/api.cart";
import displayToast from "@/utils/handleToast";
import { typeAlertBox } from "@/constants/enum";
import { updateACart } from "@/apis/modules/api.cart";
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

    const numberProduct = ref(product.value.quantity);

    const totalPriceProduct = computed(() => {
      const priceCalculate = product.value.detailProduct?.finalPrice
        ? product.value.detailProduct?.finalPrice
        : product.value.detailProduct?.price;
      return formatNumberWithDots(numberProduct.value * priceCalculate);
    });

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

    const handleChangeNumberProduct = async (number) => {
      if (
        numberProduct.value + number >
        product.value?.detailProduct?.quantity
      ) {
        displayToast(
          store.dispatch,
          typeAlertBox.ERROR,
          "Vượt quá số lượng trong kho!"
        );
        return;
      }
      if (numberProduct.value + number >= 1) {
        numberProduct.value = numberProduct.value + number;

        store.commit("cart/setQuantityOfProduct", {
          quantity: numberProduct.value,
          productId: product.value.detailProduct.id,
        });

        try {
          await updateACart({
            cartId: product.value.id,
            quantity: numberProduct.value,
          });
        } catch (err) {
          console.log(err);
        }
      }
    };

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
      fullNameProduct,
      processedPrice,
      handleRemoveProductOfCart,
      numberProduct,
      handleChangeNumberProduct,
      totalPriceProduct,
    };
  },
};
</script>

<style></style>
