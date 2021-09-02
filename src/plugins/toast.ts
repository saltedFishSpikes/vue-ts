import { createVNode, render, App, VNode, nextTick } from "vue";
import { Toast } from "@/components";
import {
  ToastFunType,
  ToastOptions,
  ToastOrDialogType as ToastType
} from "@/common/init";
import { setObjectAttr } from "@/common/util";

const ToastPlugin = {
  count: 0,
  map: new Map() as Map<number, VNode>,
  queue: [] as Array<ToastOptions>,
  isCreating: false,
  adjustOffset(defaultOffSet: number = 20, deleteId?: number) {
    let topCount = 0;
    for (let [id, vm] of this.map) {
      // 跳过要销毁的toast
      if (deleteId === id) continue;
      const dom = document.getElementById(`toast_${id}`);
      if (dom) {
        const height = dom.offsetHeight;
        const vmOffset: number = vm.props?.offset || defaultOffSet;
        topCount += vmOffset;
        // 此处使用any是因为，component这个类型上没有ctx，但是实例上有
        (vm.component as any).ctx?.setOffset(topCount);
        topCount += height;
      }
    }
  },
  create(obj: ToastOptions, n?: number) {
    if (this.isCreating) return;
    this.isCreating = true;
    let toast: HTMLDivElement | null = document.createElement("div");
    if (n === undefined) n = this.count++;
    toast.id = `toast_${n}`;
    // 销毁
    const onDestory = () => {
      render(null, toast as HTMLDivElement);
      this.map.delete(n as number);
      toast = null;
      obj.onDestory?.();
    };

    // 创建实例并渲染
    const vm = createVNode(Toast, {
      ...obj,
      id: `toast_${n}`,
      key: `toast_${n}`,
      onOnDestory: onDestory,
      adjustOffset: this.adjustOffset.bind(this, obj.offset, n)
    });
    this.map.set(n, vm);
    render(vm, toast);

    // 取第一个子元素，此处为渲染的toast
    document.body.appendChild(toast.firstElementChild as Element);

    // 调整每个的高度
    this.adjustOffset(obj.offset);

    nextTick(() => {
      this.isCreating = false;
      if (this.queue.length) {
        this.create(this.queue.shift() as ToastOptions);
      }
    });

    return n;
  },
  install(app: App, options: ToastOptions) {
    const that = this;

    const $toast: ToastFunType = {
      show(opt: ToastOptions | string | number, type?: ToastType) {
        // 使用队列结构的原因
        // 连续多次生成toast，在第一个还未渲染完成获取不到元素高度的时候，第二个可能已经开始计算offset，导致计算出的offset没有加上前几个同时生成的toast的高度
        // 连续调用可能使生成的toast序号错误
        // 连续调用：this.$toast.show();this.$toast.show();
        // 不进行连续调用生成的序号不会有问题
        if (typeof opt !== "object") {
          opt = {
            ...options,
            content: (opt || "") as string
          };
        } else {
          opt = { ...options, ...opt };
        }
        if (type) opt.type = type;

        that.queue.push(opt);
        if (!that.isCreating) {
          const n = that.count++;
          that.create(that.queue.shift() as ToastOptions, n);
          return n;
        }
        // 若当前toast没有在生成（被占用），返回的是当前正在生成的序号加上这个toast在队列中的下标
        return that.count + that.queue.findIndex(o => o === opt);
      },
      success(opt: ToastOptions | string | number) {
        this.show(opt, ToastType.SUCCESS);
      },
      fail(opt: ToastOptions | string | number) {
        this.show(opt, ToastType.FAIL);
      },
      info(opt: ToastOptions | string | number) {
        this.show(opt, ToastType.INFO);
      },
      warn(opt: ToastOptions | string | number) {
        this.show(opt, ToastType.WARN);
      },
      close(id: number) {
        (that.map.get(id)?.component as any).ctx?.close();
      },
      closeAll() {
        for (let id of that.map.keys()) {
          this.close?.(id);
        }
      }
    };
    setObjectAttr(app.config.globalProperties, "$toast", $toast);
  }
};
export default ToastPlugin;
