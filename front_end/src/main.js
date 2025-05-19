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
    "39409350512-hup4ocv1ou09rv0tj0ront4gop3qogjs.apps.googleusercontent.com",
});

app.use(Antd);
app.use(store).use(router);
app.mount("#app");

initializeJQueryLogic();
