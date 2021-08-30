import { App } from "vue";
import lazyLoad from "../directive/lazy-load";
import outsideClick from "../directive/outside-click";

const DirectivesPlugin = {
  install(app: App) {
    app.directive("lazy-load", lazyLoad);
    app.directive("outside-click", outsideClick);
  }
};

export default DirectivesPlugin;
