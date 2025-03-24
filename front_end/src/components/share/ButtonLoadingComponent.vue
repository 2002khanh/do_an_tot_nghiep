<template>
  <a-space direction="vertical">
    <a-space>
      <a-button
        type="primary"
        :loading="iconLoading"
        @click="enterIconLoading"
        :style="{ ...props.style }"
      >
        <template #icon><PoweroffOutlined /></template>
        {{ props.content }}
      </a-button>
    </a-space>
  </a-space>
</template>

<script setup>
import { ref, defineProps } from "vue";
const props = defineProps({
  style: Object,
  content: {
    required: true,
    type: String,
  },
});

const iconLoading = ref(false);

const enterIconLoading = () => {
  iconLoading.value = {
    delay: 0,
  };
  setTimeout(() => {
    iconLoading.value = false;
  }, 6000);
};
</script>
