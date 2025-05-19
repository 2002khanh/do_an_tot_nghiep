<template>
  <div>
    <a-modal
      v-if="isReviewed == false"
      v-model:open="open"
      title="Đánh giá sản phảm"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      ok-text="Gửi đánh giá"
      cancel-text="Hủy bỏ"
    >
      <a-rate v-model:value="rate" style="margin-bottom: 18px" />
      <a-textarea
        v-model:value="rateContent"
        placeholder="Nhập đánh giá"
        :rows="4"
      />
    </a-modal>

    <a-modal
      v-if="isReviewed == true"
      v-model:open="open"
      title="Đánh giá sản phảm"
      cancel-text="Hủy bỏ"
      ok-text="Gửi đánh giá"
      :ok-button-props="{ disabled: true }"
    >
      <div style="font-style: italic; font-size: 12px">
        Bạn đã thực hiện đánh giá
      </div>
      <a-rate :value="rateChild" disabled style="margin-bottom: 18px" />
      <a-textarea
        v-model:value="ratecontentChild"
        placeholder="Nhập đánh giá"
        :rows="4"
        readonly
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import {
  createProductReview,
  isReviewedAPI,
} from "@/apis/modules/api.product_review";
import displayToast from "@/utils/handleToast";
import { useStore } from "vuex";
import { typeAlertBox } from "@/constants/enum";

const store = useStore();
const rate = ref(5);
const rateContent = ref("");

const rateChild = ref(5);
const ratecontentChild = ref("");

const open = ref(false);
const confirmLoading = ref(false);
const metadata = ref({});
const isReviewed = ref(true);

const showModal = async (data) => {
  open.value = true;
  metadata.value = data;

  try {
    const result = await isReviewedAPI({
      productId: metadata.value.productSelected.detailProduct.id,
      orderId: metadata.value.orderId,
    });

    if (result.id) {
      isReviewed.value = true;

      rateChild.value = result.rate;
      ratecontentChild.value = result.content;
    } else {
      isReviewed.value = false;
    }
  } catch (err) {
    console.log(err);
  }
};

const handleOk = async () => {
  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;

    try {
      createProductReview({
        productId: metadata.value.productSelected.detailProduct.id,
        orderId: metadata.value.orderId,
        rate: rate.value,
        content: rateContent.value,
      });

      displayToast(
        store.dispatch,
        typeAlertBox.SUCCESS,
        "Đánh giá sản phẩm thành công"
      );
    } catch (err) {
      displayToast(
        store.dispatch,
        typeAlertBox.ERROR,
        err.response?.data?.message || "Yêu cầu không hợp lệ"
      );
    }
    rateContent.value = "";
  }, 1000);
};

defineExpose({
  showModal,
});
</script>
