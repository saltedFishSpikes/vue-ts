import { createApp } from "vue";
import App from "./App.vue";
import "./assets/css/reset.css";
import "./assets/less/global.less";
import { getScrollWidth } from "@/common/util";
import { ToastFunType, DialogFunType } from "@/common/init";
import ToastPlugin from "./plugins/toast";
import DirectivesPlugin from "./plugins/directive";
import ComponentsPlugin from "./plugins/component";
import DialogPiugin from ".//plugins/dialog";
// vue实例添加全局自定义属性
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $toast: ToastFunType;
    $dialog: DialogFunType;
  }
}

getScrollWidth();
createApp(App)
  .use(ToastPlugin, { closeable: false, time: 2000 })
  .use(DialogPiugin)
  .use(DirectivesPlugin)
  .use(ComponentsPlugin)
  .mount("#app");
