<template>
  <ul class="header-cart-wrapitem w-full">
    <item-list-product-by-cart
      v-for="(product, index) in listProduct"
      :key="index"
      :product="product"
    ></item-list-product-by-cart>
  </ul>
</template>

<script>
import ItemListProductByCart from "./ItemListProductByCart.vue";
export default {
  props: {
    listProduct: {
      type: Object,
      required: true,
    },
  },
  components: { ItemListProductByCart },
};
</script>

<style></style>
