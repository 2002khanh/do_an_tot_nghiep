<template>
  <div class="row isotope-grid height-100">
    <item-product
      v-for="(product, index) in listProduct"
      :key="index"
      :product="product"
    ></item-product>
  </div>
</template>

<script>
import ItemProduct from "./ItemListProduct.vue";

export default {
  components: { ItemProduct },
  props: {
    listProduct: {
      type: Object,
      required: true,
    },
  },
  setup() {},
};
</script>

<style scoped>
.height-100 {
  height: auto !important;
}
</style>
