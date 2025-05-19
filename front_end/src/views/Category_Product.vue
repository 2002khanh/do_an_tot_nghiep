<template>
  <!-- Product -->
  <section class="bg0 p-t-23 p-b-140">
    <div class="container">
      <div class="p-b-10">
        <h4
          class="ltext-103 cl5 f-arial"
          style="font-size: 18px; text-transform: none"
        >
          {{ categoryName }}
          <span style="font-size: 14px; font-weight: 100">
            / {{ subCategoryNameCurrent }}</span
          >
        </h4>
      </div>

      <div class="flex-w flex-sb-m p-b-52">
        <div class="flex-w flex-l-m m-tb-10">
          <button
            class="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 mt-4"
            @click="
              addParam({
                subCategory: '',
              })
            "
          >
            Tất cả sản phẩm
          </button>

          <button
            v-for="(item, index) in listSubcate"
            :key="index"
            class="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 mt-4"
            @click="
              addParam({
                subCategory: item.slug,
                subCategoryName: item.subCategoryName,
              })
            "
          >
            {{ item.subCategoryName }}
          </button>
        </div>

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

          <!-- <div
            class="flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 js-show-search"
          >
            <i
              class="icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search"
            ></i>
            <i
              class="icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"
            ></i>
            Search
          </div> -->
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

            <!-- <div class="filter-col2 p-r-15 p-b-27">
              <div class="mtext-102 cl2 p-b-15">Giá</div>

              <ul>
                <li class="p-b-6">
                  <a
                    href="#"
                    class="filter-link stext-106 trans-04 filter-link-active"
                  >
                    All
                  </a>
                </li>

                <li class="p-b-6">
                  <a href="#" class="filter-link stext-106 trans-04">
                    $0.00 - $50.00
                  </a>
                </li>

                <li class="p-b-6">
                  <a href="#" class="filter-link stext-106 trans-04">
                    $50.00 - $100.00
                  </a>
                </li>

                <li class="p-b-6">
                  <a href="#" class="filter-link stext-106 trans-04">
                    $100.00 - $150.00
                  </a>
                </li>

                <li class="p-b-6">
                  <a href="#" class="filter-link stext-106 trans-04">
                    $150.00 - $200.00
                  </a>
                </li>

                <li class="p-b-6">
                  <a href="#" class="filter-link stext-106 trans-04">
                    $200.00+
                  </a>
                </li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>

      <list-product :listProduct="listProduct"></list-product>

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
      <a-pagination
        v-model:current="page"
        :total="total"
        show-less-items
        :showSizeChanger="false"
        style="text-align: center; margin-top: 18px"
        @change="onChange"
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
import { useRoute } from "vue-router";
import { getProductWishListApi } from "@/apis/modules/api.wish_list";
import { getAllSubcateByCategorySlug } from "@/apis/modules/api.subcategory";
export default {
  components: { ListProduct },
  setup() {
    const store = useStore();
    const route = useRoute();

    const listProduct = ref([]);
    const listSubcate = ref([]);
    const page = ref(1);
    const total = ref(0);
    const categorySlug = ref(route.path.split("/").pop());
    const categoryName = ref("");
    const subCategoryNameCurrent = ref("Tất cả sản phẩm");
    const currentPath = ref("Tất cả sản phẩm");
    const customParams = ref({});

    const params = ref({});

    const lstCategory = [
      { slug: "thuc-pham-chuc-nang", categoryName: "Thực phẩm chức năng" },
      { slug: "duoc-my-pham", categoryName: "Dược mỹ phẩm" },
      { slug: "cham-soc-ca-nhan", categoryName: "Chăm sóc cá nhân" },
      { slug: "cham-soc-tre-em", categoryName: "Chăm sóc trẻ em" },
    ];

    const foundCategory = lstCategory.find(
      (item) => item.slug === categorySlug.value
    );
    categoryName.value = foundCategory ? foundCategory.categoryName : "";

    // Watcher để cập nhật categoryName khi categorySlug thay đổi
    watch(categorySlug, (newSlug) => {
      const foundCategory = lstCategory.find((item) => item.slug === newSlug);
      categoryName.value = foundCategory ? foundCategory.categoryName : "";
      fetchData();
    });

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
          category: categorySlug.value,
          page: page.value,
          perPage: 8,
          ...customParams.value,
        };

        const result = await getAllProduct(params.value);
        const subCategories = await getAllSubcateByCategorySlug(
          categorySlug.value
        );

        listSubcate.value = subCategories?.rows || [];
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
      const { subCategory, subCategoryName, sortBy, sortOrder } = param;
      page.value = 1;
      currentPath.value = param.subCategory || "Tất cả sản phẩm";
      subCategoryNameCurrent.value = subCategoryName || "Tất cả sản phẩm";

      customParams.value = {
        subCategory,
        sortBy,
        sortOrder,
      };

      fetchData();
    };

    watch(
      () => route.path,
      (newPath) => {
        categorySlug.value = newPath.split("/").pop();
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
      currentPath,
      page,
      onChange,
      params,
      categoryName,
      listSubcate,
      subCategoryNameCurrent,
    };
  },
};
</script>

<style></style>
