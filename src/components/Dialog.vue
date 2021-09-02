<template>
  <transition name="dialog" v-if="showMask">
    <m-mask
      :show="modelValue || selfShow"
      :currentPosition="appendBody"
      @on-click="close(maskClose)"
    >
      <div class="dialog" :style="style" @click.stop>
        <i
          v-if="showClose"
          class="iconfont i-delete close-icon"
          @click="close"
        ></i>
        <slot name="title">
          <div class="fc-16 fw-b padding-4-0-4-0 border-grey" v-if="title">
            {{ title }}
          </div>
        </slot>
        <slot name="default">
          <div class="padding-4-0-4-0">{{ content }}</div>
        </slot>
        <slot name="footer"></slot>
      </div>
    </m-mask>
  </transition>
  <transition name="dialog" v-else>
    <div
      class="dialog dialog--no-mask"
      :style="style"
      @click.stop
      v-show="modelValue || selfShow"
    >
      <i
        v-if="showClose"
        class="iconfont i-delete close-icon"
        @click="close"
      ></i>
      <slot name="title">
        <div class="fc-16 fw-b padding-4-0-4-0 border-grey" v-if="title">
          {{ title }}
        </div>
      </slot>
      <slot name="default">
        <div class="padding-4-0-4-0">{{ content }}</div>
      </slot>
      <slot name="footer"></slot>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, toRefs, PropType, onMounted, ref } from "vue"; // eslint-disable-line no-unused-vars
import { Mask } from "@/components";
type BeforeCloseFun = () => boolean;
const Dialog = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "400px",
    },
    offset: {
      type: String,
      default: "100px",
    },
    title: {
      type: [String, Number],
      default: "",
    },
    showMask: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    content: {
      type: [String, Number],
      default: "content",
    },
    maskClose: {
      type: Boolean,
      default: true,
    },
    beforeClose: {
      type: Function as PropType<BeforeCloseFun>,
      default: () => true,
    },
    appendBody: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    "m-mask": Mask,
  },
  emits: ["update:modelValue"],
  setup(props, { emit, attrs }) {
    const { id } = attrs;
    // 通过js调用
    const isJsCall = id && /^dialog_\d+$/.test(id as string);
    const { width, offset, beforeClose } = toRefs(props);
    const style = {
      width: width.value,
      marginTop: offset.value,
    };
    const selfShow = ref(false);
    // 延迟是为了js调用时显示过渡动画
    const close = (closeable: boolean = true) => {
      if (closeable && beforeClose.value()) {
        if (isJsCall) {
          selfShow.value = false;
          setTimeout(() => {
            emit("update:modelValue", false);
          }, 200);
        } else {
          emit("update:modelValue", false);
        }
      }
    };
    onMounted(() => isJsCall && setTimeout(() => (selfShow.value = true), 50));
    return {
      style,
      selfShow,
      close,
    };
  },
});
export default Dialog;
</script>
<style lang="less" scoped>
.dialog {
  padding: 10px;
  background-color: @whiteColor;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 8px;
  overflow: hidden;
  border-color: @lightGreyColor;
  box-shadow: 0 0 0 2px fade(@blackColor, 7%);
  .close-icon {
    position: absolute;
    top: 14px;
    right: 10px;
    font-size: 16px;
    color: @greyColor;
    cursor: pointer;
  }
}
.dialog--no-mask {
  position: fixed;
  top: 0;
  z-index: 999;
}
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>