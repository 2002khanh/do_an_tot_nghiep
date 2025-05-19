<template>
  <a-button @click="showConfirmDelete(discountId)" class="m-04">
    <DeleteOutlined class="fs-16 m-04" />
  </a-button>
</template>

<script>
import { DeleteOutlined } from "@ant-design/icons-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { message, Modal } from "ant-design-vue";
import { deleteADiscount } from "@/apis/modules/api.discount";

export default {
  components: { DeleteOutlined },
  props: {
    discountId: {
      type: String,
      required: true,
    },
    setLoading: {
      type: Function,
      required: true,
    },
    fetchData: {
      type: Function,
      required: true,
    },
  },

  setup(props) {
    async function handleDelete(discountId) {
      props.setLoading(true);
      try {
        await deleteADiscount(discountId);
        message.success("Xóa lịch giảm giá thành công");
      } catch (err) {
        message.error("Có lỗi xảy ra");
      }
      props.fetchData();
    }

    const showConfirmDelete = (discountId) => {
      Modal.confirm({
        title: "Xác nhận xóa bản ghi",
        icon: createVNode(ExclamationCircleOutlined),
        content: "Bạn có chắc chắn muốn lịch giảm giá không?",
        onOk() {
          handleDelete(discountId);
        },
        onCancel() {},
        okText: "Xác nhận",
        cancelText: "Hủy bỏ",
      });
    };

    return {
      DeleteOutlined,
      showConfirmDelete,
    };
  },
};
</script>

<style></style>
