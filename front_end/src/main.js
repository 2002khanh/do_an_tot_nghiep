import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store.main";
import router from "./router/router.main";
import Antd from "ant-design-vue";
import vue3GoogleLogin from "vue3-google-login";


import initializeJQueryLogic from "@/core-js/main";

const app = createApp(App);

// Tắt cảnh báo môi trường production
app.config.productionTip = false;

app.use(vue3GoogleLogin, {
  clientId:
    "222164667301-ugi24epfi5deujjigtaldmkjgn1jco7f.apps.googleusercontent.com",
});

app.use(Antd);
app.use(store).use(router);
app.mount("#app");

initializeJQueryLogic();
