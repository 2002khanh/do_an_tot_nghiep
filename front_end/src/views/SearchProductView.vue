<template>
  <!-- Product -->
  <section class="bg0 p-t-23 p-b-140">
    <div class="container">
      <div class="p-b-10">
        <h4
          class="ltext-103 cl5 f-arial"
          style="font-size: 18px; text-transform: none"
        >
          DANH SÁCH SẢN PHẨM TÌM KIẾM
        </h4>
      </div>

      <div
        class="flex-w flex-sb-m p-b-52"
        v-show="listProduct && listProduct.length > 0"
      >
        <div class="flex-w flex-c-m m-tb-10">
          <div
            style="min-width: 140px"
            class="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 js-show-filter"
          >
            <i
              class="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"
            ></i>
            <i
              class="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"
            ></i>
            Lọc sản phẩm
          </div>
        </div>

        <!-- Search product -->
        <div class="dis-none panel-search w-full p-t-10 p-b-15">
          <div class="bor8 dis-flex p-l-15">
            <button class="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
              <i class="zmdi zmdi-search"></i>
            </button>

            <input
              class="mtext-107 cl2 size-114 plh2 p-r-15"
              type="text"
              name="search-product"
              placeholder="Search"
            />
          </div>
        </div>

        <!-- Filter -->
        <div class="dis-none panel-filter w-full p-t-10">
          <div class="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
            <div class="filter-col1 p-r-15 p-b-27">
              <div class="mtext-102 cl2 p-b-15">Sắp xếp theo</div>

              <div class="d-flex">
                <ul style="margin: 0 32px 0 0">
                  <li class="p-b-6">
                    <a
                      style="cursor: pointer"
                      class="filter-link stext-106 trans-04"
                      @click="
                        addParam({
                          sortBy: 'id',
                          sortOrder: 'ASC',
                        })
                      "
                    >
                      Mặc định
                    </a>
                  </li>

                  <li class="p-b-6">
                    <a
                      style="cursor: pointer"
                      class="filter-link stext-106 trans-04"
                      @click="
                        addParam({
                          sortBy: 'price',
                          sortOrder: 'ASC',
                        })
                      "
                    >
                      Giá từ thấp tới cao
                    </a>
                  </li>

                  <li class="p-b-6">
                    <a
                      style="cursor: pointer"
                      class="filter-link stext-106 trans-04"
                      @click="
                        addParam({
                          sortBy: 'price',
                          sortOrder: 'DESC',
                        })
                      "
                    >
                      Giá từ cao tới thấp
                    </a>
                  </li>
                </ul>

                <ul style="margin: 0 32px 0 0">
                  <li class="p-b-6">
                    <a
                      style="cursor: pointer"
                      class="filter-link stext-106 trans-04"
                      @click="
                        addParam({
                          sortBy: 'totalSold',
                          sortOrder: 'DESC',
                        })
                      "
                    >
                      Bán chạy nhất
                    </a>
                  </li>

                  <li class="p-b-6">
                    <a
                      style="cursor: pointer"
                      class="filter-link stext-106 trans-04"
                      @click="
                        addParam({
                          sortBy: 'rateAvg',
                          sortOrder: 'DESC',
                        })
                      "
                    >
                      Đánh giá tốt nhất
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <list-product
        :listProduct="listProduct"
        v-if="listProduct && listProduct.length > 0"
      ></list-product>

      <template style="display: block">
        <div v-if="listProduct && listProduct.length == 0">
          Length: {{ listProduct }}
          <a-empty description="Không tìm thấy kết quả phù hợp!" />
        </div>
      </template>

      <a-pagination
        v-model:current="page"
        :total="total"
        show-less-items
        :showSizeChanger="false"
        style="text-align: center; margin-top: 18px"
        @change="onChange"
        v-if="listProduct && listProduct.length > 0"
      />
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
import { computed, onMounted, ref, watch } from "vue";
import { getAllProduct } from "@/apis/modules/api.product";
import ListProduct from "@/components/client/list-products/ListProduct.vue";
import { useStore } from "vuex";
import { getProductWishListApi } from "@/apis/modules/api.wish_list";
import { useRoute } from "vue-router";
export default {
  components: { ListProduct },
  setup() {
    const store = useStore();
    const route = useRoute();

    const listProduct = ref(null);
    const page = ref(1);
    const total = ref(0);
    const customParams = ref({});
    const params = ref({});

    const fetchData = async () => {
      try {
        const userLogin = computed(() => store.state.auth.userLogin);
        let listProductWishlist = [];

        if (userLogin.value.id) {
          listProductWishlist = (
            await getProductWishListApi(userLogin.value.id)
          ).rows.map((product) => product.product.id);
        }

        params.value = {
          page: page.value,
          perPage: 8,
          search: route.query.search,
          ...customParams.value,
        };

        const result = await getAllProduct(params.value);
        total.value = result.total;

        listProduct.value = result.rows.map((product) => ({
          ...product,
          isWishList: listProductWishlist.includes(product.id),
        }));

        params.value.page = 1;
      } catch (err) {
        console.error("Đã xảy ra lỗi", err);
      }
    };

    const onChange = (page) => {
      params.value.page = page;
      fetchData();
    };

    const addParam = (param) => {
      const { subCategory, sortBy, sortOrder } = param;
      page.value = 1;

      customParams.value = {
        subCategory,
        sortBy,
        sortOrder,
      };

      fetchData();
    };

    watch(
      () => route.query.search,
      () => {
        fetchData();
      }
    );

    onMounted(() => {
      initializeJQueryLogic();
      fetchData();
    });

    return {
      fetchData,
      listProduct,
      addParam,
      total,
      page,
      onChange,
      params,
    };
  },
};
</script>

<style></style>
