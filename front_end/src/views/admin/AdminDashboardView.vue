<template>
  <a-layout style="height: 110%">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      style="height: 100%"
    >
      <div style="margin-top: 24px" />
      <div
        class="logo"
        style="
          height: 20px;
          font-size: 24px;
          color: white;
          height: 25px;
          padding-left: 36px;
          padding-bottom: 12px;
        "
      >
        <DashboardOutlined />
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <AreaChartOutlined class="m-08" />
          <router-link to="/admin/dashboard">Tổng quan</router-link>
        </a-menu-item>

        <a-menu-item key="2" v-if="userLogin.role === 'ADMIN'">
          <pie-chart-outlined />
          <UserOutlined class="m-08" />
          <router-link to="/admin/manager-user">Quản lý tài khoản</router-link>
        </a-menu-item>

        <a-menu-item key="3" v-if="userLogin.role === 'ADMIN'">
          <pie-chart-outlined />
          <i
            class="fa-solid fa-utensils"
            style="margin-left: 8px; margin-right: 10px; font-size: 12px"
          ></i>
          <router-link to="/admin/manager-product"
            >Bảo trì sản phẩm</router-link
          >
        </a-menu-item>

        <a-menu-item key="4" v-if="userLogin.role === 'ADMIN'">
          <pie-chart-outlined />
          <MenuOutlined class="m-08" />
          <router-link to="/admin/manager-category"
            >Bảo trì danh mục</router-link
          >
        </a-menu-item>

        <a-menu-item key="5">
          <pie-chart-outlined />
          <ShoppingCartOutlined class="m-08" />
          <router-link to="/admin/manager-order">Quản lý đơn hàng</router-link>
        </a-menu-item>

        <a-menu-item key="6">
          <pie-chart-outlined />
          <DollarOutlined class="m-08" />
          <router-link to="/admin/manager-discount"
            >Quản lý giảm giá</router-link
          >
        </a-menu-item>

        <a-menu-item key="7">
          <desktop-outlined />
          <MessageOutlined class="m-08" />
          <router-link to="/admin/manager-contact"
            >Hỗ trợ khách hàng</router-link
          >
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </a-layout>
</template>

<script>
import {
  DashboardOutlined,
  UserOutlined,
  AreaChartOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  DollarOutlined,
} from "@ant-design/icons-vue";
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  components: {
    DashboardOutlined,
    UserOutlined,
    AreaChartOutlined,
    MessageOutlined,
    ShoppingCartOutlined,
    MenuOutlined,
    DollarOutlined,
  },
  setup() {
    const store = useStore();
    const userLogin = computed(() => store.state.auth.userLogin);

    return {
      userLogin,
      DashboardOutlined,
      UserOutlined,
      AreaChartOutlined,
      ShoppingCartOutlined,
      MenuOutlined,
      MessageOutlined,
    };
  },
};
</script>

<style scoped>
.m-08 {
  margin: 0 8px;
}

.header_admin {
  min-height: 100vh !important;
}
</style>
