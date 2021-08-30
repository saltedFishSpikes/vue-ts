import { App, Component } from "vue";
import * as components from "@/components";
const ComponentsPlugin = {
  install(app: App) {
    const map = new Map(Object.entries(components));
    for (let [k, v] of map) {
      const componentName = `m${k}`;
      app.component(componentName, v as Component);
    }
  }
};

export default ComponentsPlugin;
