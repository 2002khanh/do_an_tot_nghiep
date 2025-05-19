import { createRouter, createWebHistory } from "vue-router";

import SignInView from "../views/SignInView.vue";
import SignUpView from "../views/SignUpView.vue";
import HomeUserView from "../views/HomeUserView.vue";
import NotFound from "../views/NotFoundView.vue";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import Category_Product from "../views/Category_Product.vue";
import SearchProductView from "../views/SearchProductView.vue";
import ShopingCart from "../views/ShopingCartView.vue";
import MyProfileView from "../views/MyProfileView.vue";
import MyOrderView from "../views/MyOrderView.vue";
import NewsView from "../views/NewView.vue";
import MyMessageView from "../views/MyMessageView.vue";
import MyManagerMessageView from "../views/MyManagerMessageView.vue";
import MyMessageDetailView from "../views/MyMessageDetailView.vue";
import MyUserAddressView from "@/views/MyUserAddressView.vue";
import ForbiddenView from "../views/ForbiddenView.vue";
import MyOrderDetailView from "@/views/MyOrderDetailView.vue";
import WishListView from "@/views/WishListView.vue";
import store from "@/store/store.main";
import { verifyToken } from "@/utils/jsonwebtoken";

// ADMIN

import ManagerUserComponent from "@/components/admin/ManagerUserComponent/ManagerUserComponent.vue";
import ManagerProductComponent from "@/components/admin/ManagerProductComponent/ManagerProductComponent.vue";
import ManagerDashboardComponent from "@/components/admin/ManagerDashboardComponent/ManagerDashboardComponent.vue";
import ManagerContactComponent from "@/components/admin/ManagerContactComponent.vue";
import ManagerOrderComponent from "@/components/admin/ManagerOrderComponent/ManagerOrderComponent.vue";
import ManagerCategoryComponent from "@/components/admin/ManagerCategoryComponent/ManagerCategoryComponent.vue";
import ManagerDiscountComponent from "@/components/admin/ManagerDiscountComponent/ManagerDiscountComponent.vue";

import AdminDashboardView from "@/views/admin/AdminDashboardView.vue";

const routes = [
  {
    path: "/sign-in",
    name: "sign-in",
    component: SignInView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/sign-up",
    name: "sign-up",
    component: SignUpView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/my-address",
    name: "my-address",
    component: MyUserAddressView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/",
    name: "home",
    component: HomeUserView,
    alias: "/home",
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/news",
    name: "news",
    component: NewsView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/search-product",
    name: "search-product",
    component: SearchProductView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/order-history/:id",
    name: "order-history-detail",
    component: MyOrderDetailView,
    meta: { requiresAuth: true, roleAdmin: false },
    props: true,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  {
    path: "/admin/manager-user",
    name: "manager-user",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerUserComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-product",
    name: "manager-product",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerProductComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-category",
    name: "manager-category",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerCategoryComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-discount",
    name: "manager-discount",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerDiscountComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-contact",
    name: "manager-contact",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerContactComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/manager-order",
    name: "manager-order",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerOrderComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/admin/dashboard",
    name: "dashboard",
    components: {
      sidebarAdmin: AdminDashboardView,
      admin: ManagerDashboardComponent,
    },
    meta: { requiresAuth: true, roleAdmin: true },
  },
  {
    path: "/wish-list",
    name: "wish-list",
    component: WishListView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/danh-muc",
    name: "danh-muc",
    component: Category_Product,
    meta: { requiresAuth: false, roleAdmin: false },
    children: [
      {
        path: "thuc-pham-chuc-nang",
        name: "thuc-pham-chuc-nang",
        component: Category_Product,
        meta: { requiresAuth: false, roleAdmin: false },
      },
      {
        path: "duoc-my-pham",
        name: "duoc-my-pham",
        component: Category_Product,
        meta: { requiresAuth: false, roleAdmin: false },
      },
      {
        path: "cham-soc-ca-nhan",
        name: "cham-soc-ca-nhan",
        component: Category_Product,
        meta: { requiresAuth: false, roleAdmin: false },
      },
      {
        path: "cham-soc-tre-em",
        name: "cham-soc-tre-em",
        component: Category_Product,
        meta: { requiresAuth: false, roleAdmin: false },
      },
    ],
  },
  {
    path: "/shoping-cart",
    name: "shoping-cart",
    component: ShopingCart,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-profile",
    name: "my-profile",
    component: MyProfileView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/order-history",
    name: "order-history",
    component: MyOrderView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-message",
    name: "my-message",
    component: MyMessageView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-manager-message",
    name: "my-manager-message",
    component: MyManagerMessageView,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/my-message-detail/:id",
    name: "my-message-detail",
    component: MyMessageDetailView,
    props: true,
    meta: { requiresAuth: true, roleAdmin: false },
  },
  {
    path: "/forbidden",
    name: "forbidden",
    component: ForbiddenView,
    meta: { requiresAuth: false, roleAdmin: false },
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active-page",
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAuthAdmin = to.matched.some((record) => record.meta.roleAdmin);
  const isAuthenticated = localStorage.getItem("accessToken");
  const userDecoded = verifyToken();

  if (requiresAuth && !isAuthenticated) {
    next({ name: "sign-in" });
  } else if (
    requiresAuthAdmin &&
    (!userDecoded ||
      (userDecoded.role !== "ADMIN" && userDecoded.role !== "EMPLOYEE"))
  ) {
    next({ name: "forbidden" });
  }
  if (
    userDecoded.role === "EMPLOYEE" &&
    ["manager-category", "manager-user", "manager-product"].includes(to.name)
  ) {
    next({ name: "forbidden" });
  } else {
    store.dispatch("auth/loadUserLoginByToken", true);
    store.commit("setIsAdminRoute", requiresAuthAdmin);
    localStorage.setItem("isAdminRoute", requiresAuthAdmin);
    next();
  }
});

export default router;
