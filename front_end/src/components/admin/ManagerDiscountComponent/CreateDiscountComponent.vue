<template>
  <a-config-provider :locale="locale">
    <div>
      <a-button type="primary" @click="setIsOpen">
        <PlusOutlined /> Thêm mới
      </a-button>
      <a-modal
        v-model:open="isOpen"
        title="Thêm mới lịch giảm giá"
        @ok="onOkAdd"
        ok-text="Thêm mới"
        cancel-text="Hủy bỏ"
      >
        <a-form
          ref="formRef"
          :model="formState"
          layout="vertical"
          name="form_in_modal"
        >
          <a-form-item
            name="startDate"
            label="Ngày bắt đầu"
            :rules="[{ required: true, message: 'Ngày bắt đầu là bắt buộc!' }]"
          >
            <a-date-picker
              v-model:value="formState.startDate"
              show-time
              format="DD/MM/YYYY HH:mm:ss"
              placeholder="Chọn ngày bắt đầu"
              style="width: 100%"
              :locale="locale"
            />
          </a-form-item>

          <a-form-item
            name="endDate"
            label="Ngày kết thúc"
            :rules="[
              { required: true, message: 'Ngày kết thúc là bắt buộc!' },
              { validator: validateEndDate },
            ]"
          >
            <a-date-picker
              v-model:value="formState.endDate"
              show-time
              format="DD/MM/YYYY HH:mm:ss"
              placeholder="Chọn ngày kết thúc"
              style="width: 100%"
              :locale="locale"
            />
          </a-form-item>

          <a-form-item
            name="discount"
            label="Giảm giá (%)"
            :rules="[{ required: true, message: 'Giảm giá là bắt buộc!' }]"
          >
            <a-input-number
              v-model:value="formState.discount"
              min="0"
              max="100"
              style="width: 100%"
              placeholder="Nhập phần trăm giảm giá"
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </a-config-provider>
</template>

<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import { createADiscount } from "@/apis/modules/api.discount";
import { reactive, ref, toRaw, watch } from "vue";
import { message } from "ant-design-vue";
import "dayjs/locale/vi";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";

export default {
  props: {
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
    const dataParseRaw = ref({});
    const formRef = ref(null);
    const isOpen = ref(false);
    const isOpenListDiscount = ref(false);

    const defaultFormState = {
      startDate: null,
      endDate: null,
      discount: null,
    };

    const formState = reactive({ ...defaultFormState });

    watch(isOpen, (newValue) => {
      if (!newValue) {
        formRef.value.resetFields();

        dataParseRaw.value = {
          startDate: null,
          endDate: null,
          discount: null,
        };

        Object.assign(formState, defaultFormState);
      }
    });

    watch(
      formState,
      () => {
        dataParseRaw.value = toRaw(formState);
      },
      { deep: true }
    );

    const onOkAdd = async () => {
      dataParseRaw.value = toRaw(formState);

      if (!formRef.value) {
        console.error("formRef is not available.");
        return;
      }

      try {
        await formRef.value.validateFields();

        try {
          const body = {
            discount: dataParseRaw.value.discount.toString(),
            endDate: dataParseRaw.value.endDate,
            startDate: dataParseRaw.value.startDate,
            product: dataParseRaw.value.selectedProduct,
          };

          await createADiscount(body);
          message.success("Thêm lịch giảm giá thành công");
          formRef.value.resetFields();
          Object.assign(formState, defaultFormState);
          setIsOpen();
          props.fetchData();
        } catch (err) {
          message.error(err?.response?.data?.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        console.log(error);
      }
    };

    const validateEndDate = (rule, value) => {
      const startDate = formState.startDate;
      if (startDate && value && startDate >= value) {
        return Promise.reject("Ngày kết thúc phải sau ngày bắt đầu");
      }
      return Promise.resolve();
    };

    const setIsOpen = () => {
      isOpen.value = !isOpen.value;
    };

    const setOpenListDiscount = () => {
      isOpenListDiscount.value = true;
    };

    return {
      PlusOutlined,
      formState,
      isOpen,
      formRef,
      dataParseRaw,
      isOpenListDiscount,
      onOkAdd,
      validateEndDate,
      setIsOpen,
      setOpenListDiscount,
      locale,
    };
  },
};
</script>

<style>
.form-item-custom .ant-form-item-label label::before {
  content: "*";
  color: red;
  margin-right: 4px;
  font-size: 16px;
}
</style>
