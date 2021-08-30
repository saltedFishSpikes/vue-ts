<template>
  <div :style="dividerStyle"></div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
const Divide = defineComponent({
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "transparent",
    },
    margin: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    dividerStyle(): Object {
      return {
        width: `${this.vertical ? "auto" : `${this.size}px`}`,
        height: `${this.vertical ? `${this.size}px` : "auto"}`,
        "background-color": `${this.color}`,
        margin: `${
          this.vertical ? `${this.margin}px 0` : `0 ${this.margin}px`
        }`,
      };
    },
  },
});
export default Divide;
</script>