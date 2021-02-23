<template>
  <div :class="inputClass">
    <slot name="addonBefore">
      <div :class="addonBeforeClass" v-if="addonBefore">{{ addonBefore }}</div>
    </slot>
    <textarea
      cols="30"
      rows="10"
      v-if="type === 'textarea'"
      v-model="inputValue"
    ></textarea>
    <div v-else :class="inputMainClass">
      <slot name="prefix">
        <span>{{ prefix }}</span>
      </slot>
      <label>
        <input class="content" v-model="inputValue" :type="type" />
        <span class="placeholder" v-if="!inputValue">{{ placeholder }}</span>
      </label>
      <slot name="suffix">
        <span>{{ suffix }}</span>
      </slot>
    </div>
    <slot name="addonAfter">
      <div :class="addonAftereClass" v-if="addonAfter">{{ addonAfter }}</div>
    </slot>
  </div>
</template>
<script lang="ts">
enum InputType {
  TEXT = "text", // eslint-disable-line no-unused-vars
  TEXTAREA = "textarea", // eslint-disable-line no-unused-vars
  NUMBER = "number", // eslint-disable-line no-unused-vars
  PASSWORD = "password", // eslint-disable-line no-unused-vars
}
enum SizeTypes {
  LARGE = "large", // eslint-disable-line no-unused-vars
  DEFAULT = "default", // eslint-disable-line no-unused-vars
  SMALL = "small", // eslint-disable-line no-unused-vars
}
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
const Input = defineComponent({
  props: {
    addonAfter: {
      type: String,
      default: "",
    },
    addonBefore: {
      type: String,
      default: "",
    },
    type: {
      type: String as PropType<InputType>,
      default: InputType.TEXT,
    },
    beforeCusClass: {
      type: String,
      default: "",
    },
    afterCusClass: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    size: {
      type: String as PropType<SizeTypes>,
      default: SizeTypes.DEFAULT,
    },
    placeholder: {
      type: String,
      default: "请输入",
    },
  },
  data() {
    return {
      inputValue: "",
    };
  },
  computed: {
    addonBeforeClass(): string {
      return "addon-text" + this.beforeCusClass;
    },
    addonAftereClass(): string {
      return "addon-text" + this.afterCusClass;
    },
    inputClass(): string {
      return (
        "input" +
        (this.size === "large" ? " input-lg" : "") +
        (this.size === "small" ? " input-sm" : "")
      );
    },
    inputMainClass(): object {
      const { addonBefore, addonAfter } = this.$slots;
      const { addonBefore: addonBeforeStr, addonAfter: addonAfterStr } = this;
      return {
        "input-main": true,
        brl: !!addonBefore || !!addonBeforeStr,
        brr: !!addonAfter || !!addonAfterStr,
      };
    },
  },
  methods: {},
});
export default Input;
</script>
<style lang="less" scoped>
.input {
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid black;
  font-size: @defaultFS;
  box-sizing: border-box;
  width: fit-content;
  &-lg {
    padding: 4px 0;
    font-size: @largeFS;
  }
  &-sm {
    padding: 2px 0;
    font-size: @smallFS;
  }
  &-main {
    padding: 4px;
    & > label {
      position: relative;
      .content {
        padding: 0 6px;
        outline: none;
        border: 0;
      }
    }
    
    // &-placeholder {
    //   position: absolute;
    //   left: 0;
    // }
  }
  .addon-text {
    padding: 4px 8px;
  }
}
</style>