<template>
  <!-- Header -->
  <header style="height: 120px">
    <!-- Header desktop -->
    <div class="container-menu-desktop position-fixed">
      <!-- Topbar -->
      <div class="wrap-header">
        <div class="top-bar" style="position: fixed; width: 100%; z-index: 15">
          <div class="content-topbar flex-sb-m h-full container">
            <div class="left-top-bar">
              <i class="fa-solid fa-phone"></i>
              0123456789

              <i class="fa-regular fa-envelope ml-2"></i>
              skmedicine@gmail.com
            </div>

            <div>
              <div v-if="isLogin" class="right-top-bar flex-w h-full">
                <a
                  class="flex-c-m trans-04 p-lr-25 btn-top-bar"
                  style="color: wh ite"
                >
                  <img
                    style="
                      width: 20px;
                      height: 20px;
                      border-radius: 12px;
                      margin-right: 8px;
                    "
                    :src="`${config.MINIO_URL}${userLogin.avatar}`"
                    alt=""
                  />
                  <span style="color: white">
                    Xin chào, {{ userLogin.username }}</span
                  >
                  <div class="element-bridge"></div>
                  <ul class="sub-menu-top-bar" style="z-index: 2000">
                    <li
                      v-if="
                        userLogin.role === 'ADMIN' ||
                        userLogin.role === 'EMPLOYEE'
                      "
                    >
                      <router-link to="/admin/dashboard" class="f-arial"
                        >Trang quản trị</router-link
                      >
                    </li>
                    <li>
                      <router-link to="/my-profile" class="f-arial"
                        >Thông tin cá nhân</router-link
                      >
                    </li>
                    <li>
                      <router-link to="/my-address" class="f-arial"
                        >Quản lý thông tin nhận hàng</router-link
                      >
                    </li>
                    <li>
                      <router-link to="/order-history" class="f-arial"
                        >Quản lý đơn hàng</router-link
                      >
                    </li>
                  </ul>
                </a>

                <a
                  class="flex-c-m trans-04 p-lr-25 btn-top-bar f-arial"
                  style="color: white"
                  @click="handleLogout"
                >
                  Đăng xuất
                </a>
              </div>

              <div v-else class="right-top-bar flex-w h-full">
                <router-link to="/sign-in">
                  <a class="flex-c-m trans-04 p-lr-25 f-arial">
                    Đăng nhập
                  </a></router-link
                >

                <router-link to="/sign-up">
                  <a class="flex-c-m trans-04 p-lr-25 f-arial">
                    Đăng ký
                  </a></router-link
                >
              </div>
            </div>
          </div>
        </div>

        <div class="wrap-menu-desktop">
          <nav class="limiter-menu-desktop container">
            <!-- Logo desktop -->
            <a href="#" class="logo">
              <img src="/images/logo/logo.png" alt="IMG-LOGO" />
            </a>

            <!-- Menu desktop -->
            <div class="menu-desktop">
              <ul class="main-menu">
                <!-- Mục Trang chủ -->
                <li>
                  <router-link to="/home" class="f-arial"
                    >Trang chủ</router-link
                  >
                </li>

                <!-- Mục Giới thiệu -->
                <li>
                  <router-link to="/about" class="f-arial"
                    >Giới thiệu</router-link
                  >
                </li>

                <!-- Mục Danh mục có menu con -->
                <li class="menu-item">
                  <a href="#" class="f-arial">Danh mục</a>
                  <ul class="sub-menu">
                    <li>
                      <router-link
                        to="/danh-muc/thuc-pham-chuc-nang"
                        class="f-arial"
                        >Thực phẩm chức năng</router-link
                      >
                    </li>
                    <li>
                      <router-link to="/danh-muc/duoc-my-pham" class="f-arial"
                        >Dược mỹ phẩm</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        to="/danh-muc/cham-soc-ca-nhan"
                        class="f-arial"
                        >Chăm sóc cá nhân</router-link
                      >
                    </li>
                    <li>
                      <router-link
                        to="/danh-muc/cham-soc-tre-em"
                        class="f-arial"
                        >Chăm sóc trẻ em</router-link
                      >
                    </li>
                  </ul>
                </li>

                <li>
                  <router-link to="/my-manager-message" class="f-arial"
                    >Tư vấn trực tuyến</router-link
                  >
                </li>
              </ul>
            </div>

            <!-- Icon header -->
            <div class="wrap-icon-header flex-w flex-r-m">
              <div
                class="icon-header-item cl2 hov-cl1 trans-04 p-r-11 js-show-modal-search"
                @click="toggleSearchModal"
              >
                <i class="zmdi zmdi-search"></i>
              </div>

              <div
                id="search-modal"
                :class="{ active: isSearchModalActive }"
                class="search-modal"
                @click.self="closeSearchModal"
              >
                <div class="search-modal-content">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Nhập tên sản phẩm..."
                  />
                  <button @click="performSearch" style="border-radius: 8px">
                    Tìm kiếm
                  </button>
                </div>
              </div>

              <div
                class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
                :data-notify="totalProductOfCart || 0"
              >
                <i class="zmdi zmdi-shopping-cart"></i>
              </div>
              <a
                href="#"
                class="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti"
                :data-notify="totalProductOfWishList || 0"
              >
                <router-link to="/wish-list">
                  <i class="zmdi zmdi-favorite-outline icon-custom"></i>
                </router-link>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Header Mobile -->
    <div class="wrap-header-mobile">
      <!-- Logo moblie -->
      <div class="logo-mobile">
        <a href="index.html"
          ><img src="/images/logo/logo.png" alt="IMG-LOGO"
        /></a>
      </div>

      <!-- Icon header -->
      <div class="wrap-icon-header flex-w flex-r-m m-r-15">
        <div>
          <div
            class="icon-header-item cl2 hov-cl1 trans-04 p-r-11 js-show-modal-search"
            @click="toggleSearchModal"
          >
            <i class="zmdi zmdi-search"></i>
          </div>

          <div
            id="search-modal"
            :class="{ active: isSearchModalActive }"
            class="search-modal"
          >
            <div class="search-modal-content">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Enter your search..."
              />
              <button @click="performSearch">Search</button>
            </div>
          </div>
        </div>

        <div
          class="icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti js-show-cart"
          data-notify="2"
        >
          <i class="zmdi zmdi-shopping-cart"></i>
        </div>

        <a
          href="#"
          class="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
          data-notify="0"
        >
          <i class="zmdi zmdi-favorite-outline"></i>
        </a>
      </div>

      <!-- Button show menu -->
      <div class="btn-show-menu-mobile hamburger hamburger--squeeze">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </div>
    </div>

    <!-- Menu Mobile -->
    <div class="menu-mobile">
      <ul class="topbar-mobile">
        <li>
          <div class="left-top-bar">
            Free shipping for standard order over $100
          </div>
        </li>

        <li>
          <div class="right-top-bar flex-w h-full">
            <a href="#" class="flex-c-m p-lr-10 trans-04"> Help & FAQs </a>

            <a href="#" class="flex-c-m p-lr-10 trans-04"> My Account </a>

            <a href="#" class="flex-c-m p-lr-10 trans-04"> EN </a>

            <a href="#" class="flex-c-m p-lr-10 trans-04"> USD </a>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import config from "@/configs/config";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLogin = computed(() => store.state.auth.isLogin);
    const userLogin = computed(() => store.state.auth.userLogin);
    const searchQuery = ref("");
    const isSearchModalActive = ref(false);

    const totalProductOfCart = computed(
      () => store.state.cart.totalProductOfCart
    );

    const totalProductOfWishList = computed(
      () => store.state.wishList.totalProductOfWishList
    );

    const toggleSearchModal = () => {
      isSearchModalActive.value = !isSearchModalActive.value;
    };

    const performSearch = () => {
      toggleSearchModal();
      router.push({
        name: "search-product",
        query: { search: searchQuery.value },
      });
    };

    const closeSearchModal = () => {
      isSearchModalActive.value = false;
    };

    store.dispatch("cart/setCartAction");
    store.dispatch("wishList/setWishListAction");

    const handleLogout = () => {
      store.dispatch("auth/logoutAction", router);
    };

    return {
      handleLogout,
      isLogin,
      totalProductOfCart,
      totalProductOfWishList,
      userLogin,
      config,
      toggleSearchModal,
      closeSearchModal,
      performSearch,
      searchQuery,
      isSearchModalActive,
    };
  },
};
</script>
<style scoped>
.element-bridge {
  width: 100%;
  height: 20px;
  background-color: red;
  position: absolute;
  left: 0;
  top: 20px;
  background-color: rgba(0, 0, 0, 0);
}

.btn-top-bar {
  position: relative;
}

.sub-menu-top-bar {
  background: white;
  position: absolute;
  width: 100%;
  top: 145%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.btn-top-bar .sub-menu-top-bar {
  display: none;
}

.btn-top-bar:hover .sub-menu-top-bar {
  display: block;
}

.sub-menu-top-bar li {
  padding: 12px;
}

.icon-custom {
  color: black;
}

.icon-custom:hover {
  color: #717fe0;
}

/* new */
.main-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.main-menu > li {
  position: relative;
  margin-right: 20px;
}

.main-menu > li > a,
.main-menu > li > router-link {
  text-decoration: none;
  padding: 10px 15px;
  display: block;
}

.sub-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #fff;
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 200px;
  z-index: 999;
}

.sub-menu li {
  margin: 0;
}

.sub-menu li a,
.sub-menu li router-link {
  color: #333; /* Màu chữ ban đầu là màu xám nhạt */
  text-decoration: none;
  padding: 10px 15px;
  display: block;
  transition: background 0.3s, color 0.3s; /* Hiệu ứng chuyển đổi mượt mà */
}

.sub-menu li:hover {
  background: #f0f0f0; /* Màu nền xám nhạt khi hover */
}

.sub-menu li:hover a {
  color: #007bff; /* Màu chữ xanh nhạt khi hover */
}

.sub-menu li a {
  display: flex;
  align-items: center;
}

.sub-menu li:hover a {
  transform: translateX(3px); /* Di chuyển nhẹ chữ khi hover */
  transition: transform 0.3s; /* Hiệu ứng chuyển động mượt mà */
}
.menu-item:hover .sub-menu {
  display: block;
}

.search-modal {
  position: fixed;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  transition: top 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.search-modal.active {
  top: 0%;
}

.search-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 500px;
  height: 150px;
}

.search-modal-content input {
  padding: 10px;
  width: 100%;
  height: 40%;
  margin-bottom: 10px;
}

.search-modal-content button {
  padding: 10px 20px;
  background-color: #717fe0;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
