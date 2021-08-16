<template>
  <div :class="inputClass" :style="{ width: inputWidth + 'px' }">
    <slot name="addonBefore">
      <div :class="addonCls('brr')" :style="beforeCusStyle" v-if="addonBefore">
        {{ addonBefore }}
      </div>
    </slot>
    <div :class="inputContentCls" v-if="type === 'textarea'">
      <slot name="prefix">
        <div>{{ prefix }}</div>
      </slot>
      <textarea
        class="content"
        ref="textarea"
        :cols="cols"
        :rows="rows"
        :value="showValue"
        :maxlength="maxLength"
        :placeholder="placeholder"
        @input="selfInput"
        @focus="selfFocus"
        @blur="selfBlur"
        @keyup="inputEnter"
      ></textarea>
      <slot name="suffix">
        <div>{{ suffix }}</div>
      </slot>
    </div>
    <div
      v-else
      :class="inputContentCls"
      @mouseenter="changeClearIcon(true)"
      @mouseleave="changeClearIcon(false)"
    >
      <slot name="prefix">
        <span>{{ prefix }}</span>
      </slot>
      <input
        class="content"
        ref="input"
        :placeholder="placeholder"
        :value="showValue"
        :type="type"
        :maxlength="maxLength"
        :disabled="disabled"
        @input="selfInput"
        @focus="selfFocus"
        @blur="selfBlur"
        @keyup.stop.prevent="inputEnter"
      />
      <i
        v-if="clearable && !disabled"
        class="iconfont i-qingchu fs-12 fc-grey cus-point"
        @click.stop="clear"
        :style="{ visibility: showClear ? 'visible' : 'hidden' }"
      ></i>
      <slot v-if="!showClear" name="suffix">
        <span>{{ suffix }}</span>
      </slot>
    </div>
    <slot name="addonAfter">
      <div :class="addonCls('brl')" :style="afterCusStyle" v-if="addonAfter">
        {{ addonAfter }}
      </div>
    </slot>
  </div>
</template>
<script lang="ts">
import { InputTypes, SizeTypes } from "@/common/init";
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
const Input = defineComponent({
  props: {
    addonAfter: {
      type: [String, Number],
      default: "",
    },
    addonBefore: {
      type: [String, Number],
      default: "",
    },
    type: {
      type: String as PropType<InputTypes>,
      default: InputTypes.TEXT,
    },
    beforeCusStyle: {
      type: [String, Array, Object],
      default: "",
    },
    afterCusStyle: {
      type: [String, Array, Object],
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
    cols: {
      type: [Number, String],
      default: 20,
    },
    rows: {
      type: [Number, String],
      default: 5,
    },
    inputWidth: {
      validator: (v: number | string) => !isNaN(+v),
      default: 150,
    },
    modelValue: {
      type: [Number, String],
      default: "",
    },
    inputFormat: {
      type: Function,
      default: (v: string | number) => v,
    },
    border: {
      type: Boolean,
      default: true,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: Number,
      default: -1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputValue: this.modelValue,
      showClear: false,
      isFocus: false,
    };
  },
  emits: [
    "update:modelValue",
    "on-input",
    "on-focus",
    "on-blur",
    "on-clear",
    "input-enter",
  ],
  computed: {
    inputClass(): object {
      return {
        input: true,
        "input--focus": this.isFocus,
        "no-border": !this.border,
      };
    },
    inputContentCls(): object {
      return {
        "input-main": true,
        "input-lg": this.size === SizeTypes.LARGE,
        "input-sm": this.size === SizeTypes.SMALL,
        "flex-v-b": this.type !== InputTypes.TEXTAREA,
        disabled: this.disabled,
      };
    },
    addonCls(): Function {
      return (bdr: string): object => {
        let obj = {
          "addon-text": true,
          [bdr]: !!this.border,
          "input-lg": this.size === SizeTypes.LARGE,
          "input-sm": this.size === SizeTypes.SMALL,
        };
        return obj;
      };
    },
    showValue(): string | number {
      return this.isFocus ? this.inputValue : this.inputFormat(this.inputValue);
    },
  },
  watch: {
    modelValue(newV: string | number) {
      this.inputValue = newV;
    },
  },
  methods: {
    selfInput(e: InputEvent): void {
      this.inputValue = e.target ? (e.target as HTMLInputElement).value : "";
      this.$emit("update:modelValue", this.inputValue);
      this.$emit("on-input", e.data, this.inputValue, e);
    },
    selfFocus(e: FocusEvent): void {
      this.$emit("on-focus", e);
      this.isFocus = true;
    },
    selfBlur(e: FocusEvent): void {
      this.$emit("on-blur", this.inputValue, e);
      this.isFocus = false;
    },
    inputEnter() {
      this.$emit("input-enter");
    },
    changeClearIcon(show: boolean): void {
      this.showClear = show;
    },
    clear(): void {
      if (!this.inputValue) return;
      this.inputValue = "";
      this.$emit("update:modelValue", this.inputValue);
      this.$emit("on-clear", this.inputValue);
    },
    focus(): void {
      this.getInput()?.focus();
    },
    blur(): void {
      this.getInput()?.blur();
    },
    getInput(): HTMLInputElement | HTMLTextAreaElement {
      return (
        (this.$refs["input"] as HTMLInputElement) ||
        (this.$refs["textarea"] as HTMLTextAreaElement)
      );
    },
  },
});
export default Input;
</script>
<style lang="less" scoped>
.input {
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border-radius: 4px;
  // 使用1px会有空隙，不知道为什么
  border: 0.1px solid @greyColor;
  font-size: @defaultFS;
  box-sizing: border-box;
  width: fit-content;
  &.input--focus {
    border-color: @primaryColor;
    box-shadow: 0 0 0 2px fade(@primaryColor, 20%);
  }
  &-main {
    padding: 4px;
    flex-grow: 1;
    overflow: hidden;
    .content {
      padding: 0 6px;
      outline: none;
      border: 0;
      background-color: inherit;
      resize: none;
      cursor: inherit;
      flex-flow: 1;
      overflow: hidden;
    }
  }
  .disabled {
    background-color: @greyColor;
    cursor: not-allowed;
  }
  .addon-text {
    background-color: @lightGreyColor;
    padding: 4px 8px;
  }
  &-lg {
    padding: 6px;
    font-size: @largeFS;
  }
  &-sm {
    padding: 2px;
    font-size: @smallFS;
  }
}
</style>