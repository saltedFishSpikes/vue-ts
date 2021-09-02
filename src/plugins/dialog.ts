import { setObjectAttr } from "@/common/util";
import { App, createVNode, ref, render, VNode } from "vue";
import { Dialog } from "@/components";
import {
  DialogOptions,
  DialogFunType,
  ToastOrDialogType as DialogType
} from "@/common/init";

const getIconClass = (type: DialogType) => {
  const toastTypeMap = new Map([
    [DialogType.INFO, "i-info fc-blue"],
    [DialogType.SUCCESS, "i-success fc-green"],
    [DialogType.FAIL, "i-fail fc-wrong"],
    [DialogType.WARN, "i-warn fc-warn"]
  ]);
  return toastTypeMap.get(type) || "";
};

const DialogPlugin = {
  count: 0,
  map: new Map() as Map<number, VNode>,
  create(opt: DialogOptions, n?: number) {
    let dialog: HTMLDivElement | null = document.createElement("div");
    if (n === undefined) {
      n = this.count++;
    }

    const close = () => {
      render(null, dialog as HTMLDivElement);
      this.map.delete(n as number);
      dialog = null;
    };
    const { footerRender, contentRender, titleRender } = opt;
    let slots = {};
    if (opt.footerRender) {
      setObjectAttr(slots, "footer", footerRender);
      delete opt.footerRender;
    }
    if (opt.contentRender) {
      setObjectAttr(slots, "default", contentRender);
      delete opt.contentRender;
    }
    if (opt.titleRender) {
      setObjectAttr(slots, "title", titleRender);
      delete opt.titleRender;
    }
    const vm = createVNode(
      Dialog,
      {
        ...opt,
        key: n,
        id: `dialog_${n}`,
        modelValue: false,
        appendBody: true,
        "onUpdate:modelValue": close
      },
      slots
    );
    this.map.set(n, vm);
    render(vm, dialog);
    document.body.appendChild(dialog.firstElementChild as Element);
  },
  install(app: App, options: DialogOptions) {
    const that = this;
    const $dialog: DialogFunType = {
      show(opt: DialogOptions | string | number, type?: DialogType) {
        if (typeof opt === "object") {
          opt = {
            ...options,
            ...opt,
            type
          };
        } else {
          opt = {
            ...options,
            content: String(opt),
            type
          };
        }
        if (type) {
          const titleRender = createVNode(
            "div",
            {
              class: "flex-v-c"
            },
            [
              createVNode("i", {
                class: ["iconfont fs-30 mr10", getIconClass(type)]
              }),
              opt.titleRender ||
                createVNode(
                  "div",
                  { style: "flex-grow: 1", class: "fs-18 fw-b" },
                  opt.title || ""
                )
            ]
          );
          const contentRender = createVNode("div", { class: "ml40 break-y" }, [
            opt.contentRender || opt.content
          ]);
          opt.titleRender = () => titleRender;
          opt.contentRender = () => contentRender;
        }
        that.create(opt);
      },
      info(opt) {
        this.show(opt, DialogType.INFO);
      },
      warn(opt) {
        this.show(opt, DialogType.WARN);
      },
      fail(opt) {
        this.show(opt, DialogType.FAIL);
      },
      success(opt) {
        this.show(opt, DialogType.SUCCESS);
      }
    };
    setObjectAttr(app.config.globalProperties, "$dialog", $dialog);
  }
};
export default DialogPlugin;
