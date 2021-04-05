<template>
  <button :class="className" @click.stop="onClick">
    <template v-if="!noContent">
      <slot name="default">
        <span>{{ circle ? "B" : "button" }}</span>
      </slot>
    </template>
  </button>
</template>

<script lang="ts">
import { ButtonTypes, SizeTypes } from "@/common/init";
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
import { mergeClass } from '@/common/util'
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
      type: [String, Array, Object],
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
  computed: {
    className(): Object {
      let typeCls = `button-${this.type.toLowerCase()}`;
      let cls =  {
        button: true,
        [typeCls]: true,
        [`${typeCls}-ghost`]: this.ghost,
        [`${typeCls}-dash`]: this.dash,
        [`${typeCls}-disabled`]: this.disabled,
        [`${typeCls}-circle`]: this.circle,
        "button-lg": this.size === SizeTypes.LARGE,
        "button-sm": this.size === SizeTypes.SMALL,
      };
      return mergeClass(cls, this.custormClass)
    },
  },
  methods: {
    onClick(): void {
      if (!this.disabled) {
        this.$emit("on-click");
      }
    },
  },
});
export default Button;
</script>

<style scoped lang="less">
.button {
  outline: 0;
  display: inline-block;
  cursor: pointer;
  white-space: nowrap;
  height: 27px;
  text-align: center;
  font-size: @defaultFS;
  padding: 4px 17px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: @whiteColor;
  border: 1px solid @greyColor;
  line-height: 1;
  &-lg {
    height: 35px;
    padding: 6px 20px;
    font-size: @largeFS;
  }
  &-sm {
    height: 20px;
    padding: 2px 10px;
    font-size: @smallFS;
  }
  &-default {
    &-disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background-color: @lightGreyColor;
      border-color: @greyColor;
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
    &-disabled {
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
    &-disabled {
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
    &-disabled {
      cursor: not-allowed;
      color: @greyColor;
    }
  }
}
</style>
