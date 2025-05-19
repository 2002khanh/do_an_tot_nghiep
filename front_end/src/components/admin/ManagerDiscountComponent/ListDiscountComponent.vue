<template>
  <div>
    <a-button @click="handleOpen">Chi tiết</a-button>

    <a-modal
      v-model:visible="isModalVisible"
      title="Quản lý sản phẩm áp dụng giảm giá"
      @cancel="handleCancel"
      @ok="handleOk"
      ok-text="Cập nhật"
      cancel-text="Hủy bỏ"
      class="custom-modal"
      bodyStyle="height: 410px"
    >
      <div class="discount-info">
        <p>
          <span class="bold"> Ngày bắt đầu:</span>
          {{ discount.startDate }}
        </p>
        <p><span class="bold"> Ngày kết thúc: </span>{{ discount.endDate }}</p>
        <p>
          <span class="bold">Giảm giá:</span>
          {{ discount.discount }}
        </p>
      </div>
      <a-tree-select
        v-model:value="selectedValues"
        style="width: 100%"
        :tree-data="treeData"
        tree-checkable
        allow-clear
        :show-checked-strategy="SHOW_PARENT"
        placeholder="Tên sản phẩm"
        tree-node-filter-prop="label"
        class="custom-tree-select"
        @change="handleTreeChange"
      />
    </a-modal>
  </div>
</template>

<script>
import { ref } from "vue";
import { message, TreeSelect } from "ant-design-vue";
import { getAllProductByAmin } from "@/apis/modules/api.product";
import { updateADiscount } from "@/apis/modules/api.discount";

export default {
  props: {
    setLoading: {
      type: Function,
      required: true,
    },
    discountId: {
      type: String,
      required: true,
    },
    discount: {
      type: Object,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    fetchData: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const isModalVisible = ref(false);
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const selectedValues = ref([]);
    const treeData = ref([]);
    const fullDataMap = ref({});

    const handleCancel = () => {
      isModalVisible.value = false;
    };

    const handleOk = async () => {
      try {
        await updateADiscount(
          {
            products: selectedValues.value,
          },
          props.discountId
        );

        props.fetchData();
        props.setLoading(true);
        isModalVisible.value = false;
        message.success("Cập nhập thành công");

        setTimeout(() => {
          props.setLoading(false);
        }, 500);
      } catch {
        message.error("Có lỗi xảy ra");
      }
    };

    const handleOpen = async () => {
      isModalVisible.value = true;
      try {
        const response = (await getAllProductByAmin()).rows;
        const discountProducts = props.products;

        let treeDataMap = {};

        response.forEach((product) => {
          const cateId = product.subcategory.category.id;
          const subCateId = product.subcategory.id;
          const productId = product.id;

          if (!fullDataMap.value[cateId]) {
            fullDataMap.value[cateId] = {
              categoryName: product.subcategory.category.categoryName,
              products: [],
            };
          }

          if (!fullDataMap.value[cateId].subCategories) {
            fullDataMap.value[cateId].subCategories = {};
          }

          if (!fullDataMap.value[cateId].subCategories[subCateId]) {
            fullDataMap.value[cateId].subCategories[subCateId] = {
              subCategoryName: product.subcategory.subCategoryName,
              products: [],
            };
          }

          fullDataMap.value[cateId].subCategories[subCateId].products.push(
            productId
          );
          fullDataMap.value[cateId].products.push(productId);

          if (!treeDataMap[cateId]) {
            treeDataMap[cateId] = {
              label: product.subcategory.category.categoryName,
              value: cateId,
              children: [],
            };
          }

          let subCategory = treeDataMap[cateId].children.find(
            (sub) => sub.value === subCateId
          );
          if (!subCategory) {
            subCategory = {
              label: product.subcategory.subCategoryName,
              value: subCateId,
              children: [],
            };
            treeDataMap[cateId].children.push(subCategory);
          }

          subCategory.children.push({
            label: product.productName,
            value: productId,
          });
        });

        treeData.value = Object.values(treeDataMap);
        selectedValues.value = discountProducts;
      } catch (error) {
        console.error("Có lỗi xảy ra");
      }
    };

    const handleTreeChange = (selected) => {
      let selectedProductIds = [];
      const addedProductIds = new Set();

      selected.forEach((id) => {
        if (fullDataMap.value[id]) {
          fullDataMap.value[id].products.forEach((productId) => {
            if (!addedProductIds.has(productId)) {
              selectedProductIds.push(productId);
              addedProductIds.add(productId);
            }
          });
        } else {
          for (let cateId in fullDataMap.value) {
            const subCategories = fullDataMap.value[cateId].subCategories || {};
            if (subCategories[id]) {
              subCategories[id].products.forEach((productId) => {
                if (!addedProductIds.has(productId)) {
                  selectedProductIds.push(productId);
                  addedProductIds.add(productId);
                }
              });
            } else {
              const allProducts = fullDataMap.value[cateId].products;
              if (allProducts.includes(id) && !addedProductIds.has(id)) {
                selectedProductIds.push(id);
                addedProductIds.add(id);
              }
            }
          }
        }
      });

      selectedValues.value = selectedProductIds;
      console.log("Các product ID đã chọn:", selectedValues.value);
    };

    return {
      isModalVisible,
      selectedValues,
      treeData,
      SHOW_PARENT,
      handleCancel,
      handleOk,
      handleOpen,
      handleTreeChange,
      updateADiscount,
    };
  },
};
</script>

<style scoped>
.ant-modal-content {
  height: 410px !important;
}

.discount-info {
  margin-bottom: 20px;
}

.discount-info p {
  font-size: 14px;
  margin: 5px 0;
}

.bold {
  font-weight: 600;
}
</style>
