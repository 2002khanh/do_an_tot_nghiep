<template style="font-family: ">
  <Suspense>
    <template #default>
      <the-header v-if="isAdminRoute === false"></the-header>
    </template>
    <template #fallback>
      <div>Loading header...</div>
    </template>
  </Suspense>

  <div
    style="width: 100%; height: 40px; background-color: #002140"
    v-if="isAdminRoute"
  >
    <div class="header_admin_child">
      <i
        class="fa-solid fa-user"
        style="margin-right: 4px; font-size: 14px"
      ></i>
      <span style="font-size: 14px; font-weight: 100">
        AD - {{ userLogin.username }}
      </span>
      <div class="header_admin_subnav">
        <ul class="subnav_list">
          <router-link to="/home">
            <li class="subnav_list-item">Trang chủ</li>
          </router-link>
          <li class="subnav_list-item" @click="handleLogout">Đăng xuất</li>
        </ul>
      </div>
    </div>
  </div>

  <Suspense>
    <template #default>
      <div
        style="display: flex; min-height: 90vh"
        class="header_admin"
        v-if="isAdminRoute"
      >
        <div style="margin: 18px 0px"></div>
        <div>
          <router-view name="sidebarAdmin"></router-view>
        </div>
        <router-view name="admin"></router-view>
      </div>
    </template>
    <template #fallback>
      <div>Loading admin view...</div>
    </template>
  </Suspense>

  <Suspense>
    <div v-if="!isLoading">
      <router-view></router-view>
    </div>

    <div v-else class="loading-spinner">
      <div class="spinner"></div>
      <span>Đang tải...</span>
    </div>
  </Suspense>

  <Suspense>
    <template #default>
      <alert-box v-if="isAdminRoute === false"></alert-box>
    </template>
    <template #fallback>
      <div>Loading alert...</div>
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <the-cart v-if="isAdminRoute === false"></the-cart>
    </template>
    <template #fallback>
      <div>Loading cart...</div>
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <the-footer v-if="isAdminRoute === false"></the-footer>
    </template>
    <template #fallback>
      <div>Loading footer...</div>
    </template>
  </Suspense>
</template>

<script>
import TheHeader from "@/components/client/TheHeader.vue";
import AlertBox from "@/components/client/share/TheToast.vue";
import TheCart from "@/components/client/cart/TheCart.vue";
import { useStore } from "vuex";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import TheFooter from "./components/client/TheFooter.vue";

export default {
  components: {
    TheHeader,
    AlertBox,
    TheCart,
    TheFooter,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userLogin = computed(() => store.state.auth.userLogin);
    const isAdminRoute = computed(() => store.state.isAdminRoute);
    const isLoading = ref(false);

    const onRouteChange = async () => {
      isLoading.value = true;
      await new Promise((resolve) => setTimeout(resolve, 500)); // Delay
      isLoading.value = false;
    };

    watch(
      () => router.currentRoute.value,
      () => {
        onRouteChange();
      }
    );

    const handleLogout = () => {
      store.dispatch("auth/logoutAction", router);
    };

    return {
      isAdminRoute,
      handleLogout,
      userLogin,
      isLoading,
    };
  },
};
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 18px;
  color: #333;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.header_admin {
  position: relative;
}

.ant-modal-wrap {
  overflow: hidden !important;
}

.header_admin_child {
  color: white;
  cursor: pointer;
  position: absolute;
  padding: 0 24px;
  right: 24px;
  top: 10px;
  border-radius: 12px;
  z-index: 50;
}

.header_admin_subnav {
  position: absolute;
  top: 105%;
  width: 120px;
  background-color: white;
  z-index: 100;
  display: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.subnav_list {
  padding: 10px;
}

.header_admin_child:hover .header_admin_subnav {
  display: block;
}

.subnav_list-item {
  padding: 6px 12px;
  font-size: 14px;
  color: black;
}

.subnav_list-item:hover {
  color: blue;
}
</style>
