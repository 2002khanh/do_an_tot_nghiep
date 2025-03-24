<template style="font-family: ">
  <the-header v-if="isAdminRoute === false"></the-header>
  <div
    style="width: 100%; height: 40px; background-color: #002140"
    v-if="isAdminRoute === true"
  >
    <div class="header_admin_child">
      <i class="fa-solid fa-user" style="margin-right: 4px; font-size: 14p"></i>
      <span style="font-size: 14px; font-weight: 100">
        AD - {{ userLogin.username }}</span
      >

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
  <div
    style="display: flex; min-height: 90vh"
    class="header_admin"
    v-if="isAdminRoute === true"
  >
    <div style="margin: 18px 0px"></div>
    <div>
      <router-view name="sidebarAdmin"></router-view>
    </div>
    <router-view name="admin"></router-view>
  </div>
  <router-view></router-view>
  <alert-box v-if="isAdminRoute === false"></alert-box>
  <the-cart v-if="isAdminRoute === false"></the-cart>
</template>
