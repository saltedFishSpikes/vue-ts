<template>
  <label :class="radioCls">
    <span
      :class="selfRadioCls"
      :style="{ backgroundColor: checked && !disabled ? checkedColor : '' }"
    >
      <template v-if="checked">
        <slot name="inner">
          <span v-if="!checkFill" :class="selfRadioInnerCls"></span>
        </slot>
      </template>
    </span>
    <input
      type="radio"
      :checked="checked"
      class="origin-radio"
      :disabled="disabled"
      @click.stop.prevent="onChoose"
      :name="name"
    />
    <span class="label">
      <slot name="default"></slot>
    </span>
  </label>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
import { SizeTypes } from "@/common/init";

type beforeChooseFun = (v: Boolean | String | Number) => boolean;
const Radio = defineComponent({
  props: {
    checked: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkedColor: {
      type: String,
      default: "#1890ff",
    },
    checkFill: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String as PropType<SizeTypes>,
      default: SizeTypes.DEFAULT,
    },
    name: {
      type: [String, Number, Boolean],
      default: "",
    },
    beforeChoose: {
      type: Function as PropType<beforeChooseFun>,
      default: () => true,
    },
  },
  emits: ["on-choose"],
  computed: {
    selfRadioCls(): object {
      const prefix = "radio-self";
      return {
        [prefix]: true,
        [`${prefix}-lg`]: this.size === SizeTypes.LARGE,
        [`${prefix}-sm`]: this.size === SizeTypes.SMALL,
        [`${prefix}-disabled`]: this.disabled,
        "no-border": this.checked,
        [`${prefix}-disabled-checked`]: this.disabled,
      };
    },
    selfRadioInnerCls(): object {
      const prefix = "radio-self__inner";
      return {
        [prefix]: true,
        [`${prefix}-disabled`]: this.disabled,
      };
    },
    radioCls(): object {
      return {
        radio: true,
        mb5: true,
        "radio-lg": this.size === SizeTypes.LARGE,
        "radio-sm": this.size === SizeTypes.SMALL,
        "radio-disabled": this.disabled,
      };
    },
  },
  methods: {
    onChoose() {
      if (this.beforeChoose(this.value)) {
        this.$emit("on-choose", this.value);
      }
    },
  },
});
export default Radio;
</script>
<style lang="less" scoped>
.radio {
  display: flex;
  align-items: center;
  position: relative;
  font-size: @defaultFS;
  width: fit-content;
  cursor: pointer;
  &-lg {
    font-size: @largeFS;
  }
  &-sm {
    font-size: @smallFS;
  }
  &-self {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid @greyColor;
    border-radius: 50%;
    position: relative;
    box-sizing: border-box;
    &-lg {
      width: 20px;
      height: 20px;
    }
    &-sm {
      width: 12px;
      height: 12px;
    }
    &-disabled {
      cursor: not-allowed;
      background-color: @lightGreyColor;
    }
    &__inner {
      position: absolute;
      width: 40%;
      height: 40%;
      border-radius: 50%;
      background-color: #ffffff;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &-disabled {
        background-color: #c0c4cc;
      }
    }
  }
  &-disabled {
    cursor: not-allowed;
    color: @greyColor;
  }
  .origin-radio {
    opacity: 0;
    position: absolute;
  }
  .label {
    word-break: break-word;
    padding: 0 5px;
  }
}
</style>