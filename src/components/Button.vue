<template>
  <button :class="className" @click="onClick">
    <slot name="default">
      <span>{{ noContent || circle ? "" : "button" }}</span>
    </slot>
    <span :class="{ ml5: !noContent && !circle }">
      <slot name="icon"></slot>
    </span>
  </button>
</template>

<script lang="ts">
// eslint-disable-line no-unused-vars
enum ButtonTypes {
  DEFAULT = "default", // eslint-disable-line no-unused-vars
  PRIMARY = "primary", // eslint-disable-line no-unused-vars
  TEXT = "text", // eslint-disable-line no-unused-vars
  LINK = "link", // eslint-disable-line no-unused-vars
}
// eslint-disable-line no-unused-vars
enum SizeTypes {
  LARGE = "large", // eslint-disable-line no-unused-vars
  DEFAULT = "default", // eslint-disable-line no-unused-vars
  SMALL = "small", // eslint-disable-line no-unused-vars
}

import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
const Button = defineComponent({
  props: {
    type: {
      type: String as PropType<ButtonTypes>,
      default: ButtonTypes.DEFAULT,
    },
    size: {
      type: String as PropType<SizeTypes>,
      default: SizeTypes.DEFAULT,
    },
    dash: {
      type: Boolean,
      default: false,
    },
    ghost: {
      type: Boolean,
      default: false,
    },
    custormClass: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    noContent: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    className(): String {
      let typeCls = ` button-${this.type.toLowerCase()}`;
      let sizeCls =
        this.size === "large"
          ? " button-lg"
          : this.size === "small"
          ? " button-sm"
          : "";
      return (
        "button" +
        typeCls +
        (this.ghost ? `${typeCls}-ghost` : "") +
        (this.dash ? `${typeCls}-dash` : "") +
        (this.disabled ? `${typeCls}-disabled` : "") +
        (this.circle ? `${typeCls}-circle` : "") +
        sizeCls +
        " " +
        this.custormClass
      );
    },
  },
  methods: {
    onClick() {
      this.$emit('click')
    }
  },
  mounted() {},
});
export default Button;
</script>

<style scoped lang="less">
.button {
  outline: 0;
  display: inline-block;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  font-size: @defaultFS;
  padding: 4px 17px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: @whiteColor;
  border: 1px solid @greyColor;
  &-lg {
    padding: 6px 20px;
    font-size: @largeFS;
  }
  &-sm {
    padding: 2px 10px;
    font-size: @smallFS;
  }
  &-default {
    &-disable {
      cursor: not-allowed;
      opacity: 0.6;
    }
    &-ghost {
      background-color: transparent;
    }
    &-dash {
      border-style: dashed;
    }
    &:active {
      opacity: 0.6;
      transition: opacity 0.1s ease;
    }
    &-circle {
      width: 2.5em;
      height: 2.5em;
      padding: 0;
      border-radius: 50%;
    }
  }
  &-primary {
    background-color: @primaryColor;
    color: @whiteColor;
    border-color: @primaryColor;
    &:active {
      opacity: 0.6;
      transition: opacity 0.1s ease;
    }
    &-disable {
      cursor: not-allowed;
      opacity: 0.6;
    }
    &-ghost {
      border: 1px solid @primaryColor;
      background-color: transparent;
      color: @primaryColor;
    }
    &-dash {
      border-style: dashed;
    }
    &-circle {
      width: 2.5em;
      height: 2.5em;
      padding: 0;
      border-radius: 50%;
    }
  }
  &-text {
    border: 0;
    background-color: transparent;
    color: @blackColor;
    padding: 0;
    &:active {
      opacity: 0.6;
      transition: opacity 0.1s ease;
    }
    &-disable {
      cursor: not-allowed;
      color: @greyColor;
    }
  }
  &-link {
    border: 0;
    background-color: transparent;
    color: @primaryColor;
    padding: 0;
    &:active {
      opacity: 0.6;
      transition: opacity 0.1s ease;
    }
    &-disable {
      cursor: not-allowed;
      color: @greyColor;
    }
  }
}
</style>
