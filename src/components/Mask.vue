<template>
  <div
    class="mask"
    :style="style"
    v-if="currentPosition"
    v-show="show"
    @click.stop="$emit('on-click')"
  >
    <slot name="default"></slot>
  </div>
  <teleport v-else-if="!currentPosition" v-show="show" :to="containerSelector">
    <div class="mask" :style="style" @click="$emit('on-click')">
      <slot name="default"></slot>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent } from "vue";
const Mask = defineComponent({
  props: {
    style: {
      type: [String, Object],
      default: "",
    },
    containerSelector: {
      validator: (value: string) => !!document.querySelector(value),
      default: "body",
    },
    currentPosition: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["on-click"],
});
export default Mask;
</script>
<style lang="less" scoped>
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: fade(@blackColor, 70%);
}
</style>