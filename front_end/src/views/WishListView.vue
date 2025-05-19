<template>
  <!-- Product -->
  <section class="bg0 p-t-23 p-b-140">
    <div class="container">
      <div class="p-b-10" style="margin-bottom: 28px; margin-top: 12px">
        <h3 class="ltext-103 cl5 f-arial" style="font-size: 20px">
          DANH SÁCH SẢN PHẨM YÊU THÍCH
        </h3>
      </div>

      <list-product
        :listProduct="listProduct"
        v-if="listProduct && listProduct.length > 0"
      ></list-product>

      <template v-else>
        <div style="display: flex; align-items: center; flex-direction: column">
          <a-empty description="Bạn chưa có sản phẩm yêu thích!" />
          <a
            class="btn btn-primary cart-btn-transform m-3"
            data-abc="true"
            style="width: 150px; margin-top: 20px"
          >
            <router-link to="/home" style="color: white !important"
              >Tiếp tục mua hàng</router-link
            ></a
          >
        </div>
        <div style="margin: 100px 0"></div>
      </template>

      <!-- Load more -->
      <!-- <div class="flex-c-m flex-w w-full p-t-45">
        <ul class="pagination">
          <li v-if="totalPage &gt; 3" class="page-item">
            <a class="page-link" href="#">Trước</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="#">1</a>
          </li>
          <li v-if="totalPage &gt; 3" class="page-item">
            <a class="page-link" href="#">Sau</a>
          </li>
        </ul>
      </div> -->
    </div>
  </section>

  <!-- Back to top -->
  <div class="btn-back-to-top" id="myBtn">
    <span class="symbol-btn-back-to-top">
      <i class="zmdi zmdi-chevron-up"></i>
    </span>
  </div>
</template>

<script>
import initializeJQueryLogic from "@/core-js/main";
import { onMounted, ref } from "vue";
import { getProductWishListApi } from "@/apis/modules/api.wish_list";
import ListProduct from "@/components/client/list-products/ListProduct.vue";
export default {
  components: { ListProduct },
  setup() {
    const listProduct = ref([]);

    const fetchData = async () => {
      try {
        const listProductWishlist = (await getProductWishListApi()).rows;

        const dataProcessed = listProductWishlist.map((item) => {
          return { ...item.product, isWishList: true };
        });

        listProduct.value = dataProcessed;
      } catch (err) {
        console.log("Đã xảy ra lỗi", err);
      }
    };

    onMounted(() => {
      initializeJQueryLogic();
      fetchData();
    });

    return {
      listProduct,
    };
  },
};
</script>

<style></style>
