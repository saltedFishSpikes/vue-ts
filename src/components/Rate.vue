<template>
  <div class="rate" @mouseout.stop="mouseout">
    <div v-for="n in maxLength" :key="n" class="rate-item">
      <span
        v-if="half"
        class="rate-item_half"
        :style="isActive(true, n - 1) ? activeStyle : defaultStyle"
        @mouseover.stop="() => mouseover(true, n - 1)"
        @click.stop="() => click(true, n - 1)"
      >
        <slot name="default">好</slot>
      </span>
      <span
        class="rate-item_whole"
        :style="isActive(false, n - 1) ? activeStyle : defaultStyle"
        @mouseover.stop="() => mouseover(false, n - 1)"
        @click.stop="() => click(false, n - 1)"
      >
        <slot name="default">好</slot>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
const Rate = defineComponent({
  props: {
    maxLength: {
      type: Number,
      default: 5,
    },
    activeStyle: {
      type: [String, Object, Array],
      default: "color: blue;",
    },
    defaultStyle: {
      type: [String, Object, Array],
      default: "color: grey;",
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    half: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hoverValue: 0,
    };
  },
  emits: ["update:modelValue"],
  mounted() {
    this.hoverValue = this.modelValue;
  },
  methods: {
    isActive(half: boolean, index: number): boolean {
      return this.hoverValue >= index + (half ? 0.5 : 1);
    },
    mouseover(half: boolean, index: number): void {
      this.hoverValue = index + (half ? 0.5 : 1);
    },
    click(half: boolean, index: number): void {
      if (this.clearable && this.hoverValue === this.modelValue) {
        return this.$emit("update:modelValue", 0);
      }
      this.$emit("update:modelValue", index + (half ? 0.5 : 1));
    },
    mouseout() {
      this.hoverValue = this.modelValue;
    },
  },
});
export default Rate;
</script>
<style lang="less" scoped>
.rate {
  display: flex;
  &-item {
    font-size: 16px;
    display: inline-block;
    position: relative;
    margin: 0 10px;
    transition: transform 0.1s linear;
    &:hover {
      transform-origin: 50% 50%;
      transform: scale(1.2);
    }
    &_half {
      width: 50%;
      overflow: hidden;
      position: absolute;
      left: 0;
      cursor: pointer;
    }
    &_whole {
      width: 100%;
      cursor: pointer;
    }
  }
}
</style>