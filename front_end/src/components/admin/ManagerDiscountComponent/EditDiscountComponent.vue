<template>
  <a-config-provider :locale="locale">
    <div>
      <a-button @click="setIsOpen" class="m-04">
        <EditOutlined class="fs-16 m-04" />
      </a-button>
      <a-modal
        v-model:open="isOpen"
        title="Cập nhật lịch giảm giá"
        @ok="onOkAdd"
        ok-text="Cập nhật"
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
import { EditOutlined } from "@ant-design/icons-vue";
import { reactive, ref, toRaw, watch } from "vue";
import { message } from "ant-design-vue";
import "dayjs/locale/vi";
import locale from "ant-design-vue/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import { updateADiscount } from "@/apis/modules/api.discount";

export default {
  components: { EditOutlined },
  props: {
    setLoading: {
      type: Function,
      required: true,
    },
    fetchData: {
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
  },
  setup(props) {
    const dataParseRaw = ref({});
    const formRef = ref(null);
    const isOpen = ref(false);

    const defaultFormState = {
      startDate: dayjs(props.discount?.startDate),
      endDate: dayjs(props.discount?.endDate),
      discount: props.discount?.discount,
    };

    const formState = reactive({ ...defaultFormState });

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
          };

          await updateADiscount(body, props.discountId);
          message.success("Cập nhật lịch giảm giá thành công");
          dataParseRaw.value = toRaw(formState);
          setIsOpen();
          props.fetchData();
        } catch (err) {
          message.error("Có lỗi xảy ra");
        }
      } catch (error) {
        message.error("Có lỗi xảy ra");
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

    return {
      EditOutlined,
      formState,
      isOpen,
      formRef,
      dataParseRaw,
      onOkAdd,
      validateEndDate,
      setIsOpen,
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
