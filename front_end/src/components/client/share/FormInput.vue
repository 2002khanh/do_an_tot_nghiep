<template>
  <div data-mdb-input-init class="form-outline mb-4" style="text-align: left">
    <label class="form-label" style="text-align: left" :for="label">{{
      label
    }}</label>
    <input
      :type="type"
      class="form-control form-control-lg"
      :id="label"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <span class="msg-err" style="color: red">{{ error }}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    type: String,
    modelValue: [String, Number],
    error: String,
  },
  emits: ["update:modelValue", "blur"],
};
</script>
