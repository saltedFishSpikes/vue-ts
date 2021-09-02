<template>
  <transition name="toast">
    <div
      class="toast"
      v-show="show"
      :style="{ top: `${currOffset}px`, zIndex }"
    >
      <i v-if="iconStyle" class="iconfont fs-16 mr5" :class="iconStyle"></i>
      <div class="fs-14 content">
        <m-render v-if="render" :renderFun="render"></m-render>
        <span v-else>{{ content }}</span>
      </div>
      <i
        v-if="closeable"
        class="iconfont fs-12 ml5 i-delete fc-grey cus-point"
        @click="close"
      ></i>
    </div>
  </transition>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType, // eslint-disable-line no-unused-vars
  ref,
  toRefs,
  VNode, // eslint-disable-line no-unused-vars
} from "vue";
import { ToastOrDialogType as ToastType } from "@/common/init";
import Render from "./Render.vue";

const getIconClass = (type: ToastType) => {
  const toastTypeMap = new Map([
    [ToastType.INFO, "i-info fc-blue"],
    [ToastType.SUCCESS, "i-success fc-green"],
    [ToastType.FAIL, "i-fail fc-wrong"],
    [ToastType.WARN, "i-warn fc-warn"],
  ]);
  return computed(() => toastTypeMap.get(type) || "");
};

const Toast = defineComponent({
  props: {
    type: {
      type: String as PropType<ToastType>,
      default: "",
    },
    content: {
      type: [String, Number],
      default: "",
    },
    maxWidth: {
      type: String,
      default: "80%",
    },
    closeable: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 2000,
    },
    offset: {
      type: Number,
      default: 20,
    },
    zIndex: {
      type: Number,
      default: 999,
    },
    render: {
      type: Function as PropType<(h: Function) => VNode>,
      default: null,
    },
    adjustOffset: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    "m-render": Render,
  },
  emits: ["on-destory"],
  setup(prop, { emit }) {
    const { type, time, offset, adjustOffset } = toRefs(prop);
    const iconStyle = getIconClass(type.value);
    const show = ref(false);
    const currOffset = ref(offset.value);
    const close = () => {
      // 先调整offset（此时需排除当前关闭的那个），再关闭
      // 快速单个关闭可能导致offset计算异常，因为在计算offset时可能上个要销毁的toast还未完全销毁且能获取高度。
      // 此时处理销毁的延迟，既要有销毁过渡动画，也要能在下次计算offset前已经销毁。
      adjustOffset.value();
      nextTick(() => (show.value = false));
      // 为了显示过渡动画，所以不是在关闭后立即删除dom
      // 且暴露出去让全局close方法能调用这个
      setTimeout(() => emit("on-destory"), 200);
    };
    const setOffset = (v: number) => (currOffset.value = v);
    onMounted(() => {
      // 为了显示过渡动画，所以不是一开始show就是true
      show.value = true;
      if (time.value > 0) {
        setTimeout(() => close(), time.value);
      }
    });
    return {
      iconStyle,
      close,
      show,
      currOffset,
      setOffset,
    };
  },
});
export default Toast;
</script>
<style lang="less" scoped>
.toast {
  position: fixed;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  background-color: @whiteColor;
  padding: 6px 10px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 0 2px fade(@blackColor, 7%);
  align-items: baseline;
  display: flex;
  transition: all 0.3s ease;
  .content {
    text-align: justify;
  }
}
// .toast-enter-active,
// .toast-leave-active {
//   transition: all 0.3s ease;
// }
.toast-enter-from,
.toast-leave-to {
  top: 0px !important;
  opacity: 0;
}
</style>