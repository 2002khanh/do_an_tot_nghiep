<template>
  <teleport to="#app">
    <div id="toasts">
      <div
        v-for="(toast, index) in toasts"
        :class="['toast', toast.type]"
        :key="index"
      >
        <i class="fa-solid fa-check" v-if="toast.type === 'success'"></i>
        <i
          class="fa-solid fa-triangle-exclamation"
          v-if="toast.type === 'error'"
        ></i>
        <span class="Message">{{ toast.message }}</span>
        <span class="countdown"></span>
      </div>
    </div>
  </teleport>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const toasts = computed(() => store.state.toasts);

    return {
      toasts,
    };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap");

* {
  font-size: 16px !important;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.success {
  background: green;
}

.error {
  background: red;
}

#toasts {
  position: fixed;
  z-index: 99999999999;
  top: 100px;
  right: 10px;
}

.toast {
  display: block;
  position: relative;
  padding: 20px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 20px;
  overflow: hidden;
  animation: slide_show 2s ease forwards;
  margin: 0 6px;
}

.toast i {
  margin: 0 10px;
}

.toast .countdown {
  background: green;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  width: 100%;
  animation: countdown 3s linear forwards;
}

.toast.success {
  border-left: 6px solid green;
  background: rgba(0, 120, 0, 0.6);
}

.toast.error {
  border-left: 6px solid red;
  background: rgba(255, 0, 0, 0.6);
}

.toast.success .countdown {
  background: green;
}

.toast.error .countdown {
  background: red;
}

@keyframes countdown {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

@keyframes slide_show {
  0% {
    transform: translateX(100%);
  }

  25% {
    transform: translateX(-10%);
  }

  50% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-10px);
  }
}
</style>
