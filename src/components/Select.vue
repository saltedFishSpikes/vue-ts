<template>
  <div
    :class="selectCls"
    :style="{ width: `${width}px` }"
    @click="changeIsFocus(true)"
    tabindex="0"
    @focus="changeIsFocus(true)"
    @blur="changeIsFocus(false)"
    @keyup.up="onKeyUp('up')"
    @keyup.down="onKeyUp('down')"
  >
    <div
      class="select__box"
      v-if="!search"
      :class="{ 'select__box--focus': isFocus }"
    >
      <span v-if="isInObject(selectedOpt, 'key')" class="text-selected">
        <template v-if="typeof selectedOpt.label === 'function'">
          <m-render :renderFun="selectedOpt.label"></m-render>
        </template>
        <template v-else>{{ selectedOpt.label }}</template>
      </span>
      <span v-else class="text-placeholder">{{ placeholder }}</span>
      <i
        class="iconfont fs-12 fc-grey cus-point i-jiantouxia arrow-icon"
        :class="isFocus ? 'arrow-icon-rotate' : ''"
      ></i>
    </div>
    <div v-else class="select__input">
      <m-input
        v-model="inputVal"
        inputWidth="150"
        :disabled="disabled"
        :clearable="clearable"
        @on-clear="$emit('update:modelValue', '')"
        @on-focus="changeIsFocus(true)"
        @on-blur="changeIsFocus(false)"
      >
        <template v-slot:suffix>
          <i
            class="iconfont fs-12 fc-grey cus-point i-jiantouxia arrow-icon"
            :class="isFocus ? 'arrow-icon-rotate' : ''"
          ></i>
        </template>
      </m-input>
    </div>
    <transition name="dropdown">
      <div
        v-if="!disabled"
        class="select__dropdown"
        :style="{ width: `${width}px` }"
        v-show="isFocus"
      >
        <ol v-if="filterOptions.length">
          <li
            v-for="opt of filterOptions"
            :key="opt.key"
            :class="dropDownItemCls(opt)"
            :ref="setOptionsRefs.bind(this, opt.key)"
            @click.stop="onSelect(opt)"
          >
            <slot name="option" :data="opt">
              <template v-if="typeof opt.label === 'function'">
                <m-render :renderFun="opt.label"></m-render>
              </template>
              <template v-else>{{ opt.label }}</template>
            </slot>
          </li>
        </ol>
        <template v-else>
          <slot name="noOptions">
            <div class="dropdown-item f-center">无匹配项</div>
          </slot>
        </template>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import {
  SizeTypes, // eslint-disable-line no-unused-vars
  SelectOptionType as SelectOptionType, // eslint-disable-line no-unused-vars
  HtmlObjType, // eslint-disable-line no-unused-vars
} from "@/common/init";
import { isInObject, setObjectAttr } from "@/common/util";
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
import Render from "./Render.vue";
import Input from "./Input.vue";

type beforeSelectFun = (v: SelectOptionType) => boolean;
type FilterOptionsFun = (
  arr: Array<SelectOptionType>,
  key: String
) => Array<SelectOptionType>;
const Select = defineComponent({
  components: {
    "m-render": Render,
    "m-input": Input,
  },
  emits: ["on-select", "update:modelValue"],
  props: {
    width: {
      validator: (v: number | string) => !isNaN(+v),
      default: 150,
    },
    search: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    size: {
      type: String as PropType<SizeTypes>,
      default: "default",
    },
    options: {
      type: Array as PropType<Array<SelectOptionType>>,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    beforeSelect: {
      type: Function as PropType<beforeSelectFun>,
      default: () => true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    filterOptionsFun: {
      type: Function as PropType<FilterOptionsFun>,
      default: (a: Array<SelectOptionType>) => a,
    },
  },
  data() {
    return {
      isFocus: false,
      inputVal: "",
      optionsRefs: {} as HtmlObjType,
    };
  },
  computed: {
    filterOptions(): Array<SelectOptionType> {
      if (!this.inputVal) return this.options;
      return this.filterOptionsFun(this.options, this.inputVal);
    },
    selectCls(): object {
      return {
        select: true,
        "select--lg": this.size === SizeTypes.LARGE,
        "select--sm": this.size === SizeTypes.SMALL,
        "select--disabled": this.disabled,
      };
    },
    dropDownItemCls(): Function {
      return (opt: SelectOptionType) => {
        return {
          "dropdown-item": true,
          "dropdown-item--default": !opt.disabled,
          "dropdown-item--disabled": opt.disabled,
          "dropdown-item--selected":
            opt.key === (this.selectedOpt as SelectOptionType).key,
        };
      };
    },
    selectedOpt(): object {
      return (
        this.filterOptions.find(
          (i: SelectOptionType) =>
            (this.isInObject(i, "value") ? i.value : i.key) === this.modelValue
        ) || {}
      );
    },
  },
  methods: {
    isInObject,
    setOptionsRefs(key: string | number, li: HTMLLIElement) {
      setObjectAttr(this.optionsRefs, key, li);
    },
    changeIsFocus(focus: boolean) {
      this.isFocus = focus;
    },
    onSelect(e: SelectOptionType, hide: boolean = true) {
      if (!this.disabled && !e.disabled && this.beforeSelect(e)) {
        if (typeof e.label === "function" && this.search) {
          // eslint-disable-line no-console
          console.warn("搜索模式下请不要使用函数形式的label");
          this.inputVal = String(e.label());
        } else {
          this.inputVal = String(e.label);
        }

        hide && this.changeIsFocus(false);
        this.optionsRefs[e.key] &&
          (this.optionsRefs[e.key] as HTMLLIElement).scrollIntoView();
        this.$emit(
          "update:modelValue",
          this.isInObject(e, "value") ? e.value : e.key
        );
        this.$emit("on-select", e);
      }
    },
    onKeyUp(type: string) {
      if (this.isFocus) {
        let beforeSelectIndex: number = this.filterOptions.findIndex(
          (i: SelectOptionType) =>
            i.key === (this.selectedOpt as SelectOptionType).key
        );
        let getNext = (i: number) =>
          type === "down"
            ? (i + 1) % this.filterOptions.length
            : (i - 1 + this.filterOptions.length) % this.filterOptions.length;
        beforeSelectIndex = getNext(beforeSelectIndex);
        while (this.filterOptions[beforeSelectIndex].disabled) {
          beforeSelectIndex = getNext(beforeSelectIndex);
        }
        this.onSelect(this.filterOptions[beforeSelectIndex], false);
      }
    },
  },
});
export default Select;
</script>
<style lang="less" scoped>
.select {
  display: inline-block;
  font-size: @defaultFS;
  position: relative;
  outline: none;
  &--disabled {
    background-color: @lightGreyColor;
    color: @greyColor !important;
    cursor: not-allowed;
  }
  &__box {
    padding: 4px 8px;
    border: 1px solid @greyColor;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    .text-placeholder {
      color: @greyColor;
    }
    &--focus {
      border-color: @primaryColor;
      box-shadow: 0 0 0 2px fade(@primaryColor, 20%);
    }
  }
  &__dropdown {
    border: 1px solid @primaryColor;
    position: absolute;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: auto;
    max-height: 200px;
    z-index: 10;
    background-color: @whiteColor;
    .dropdown-item {
      max-width: 100%;
      padding: 4px 8px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      box-sizing: border-box;
      &--selected {
        color: @primaryColor;
      }
      &--default {
        &:hover {
          color: @primaryColor;
          background-color: fade(@primaryColor, 10%);
        }
      }
      &--disabled {
        color: @greyColor;
        cursor: not-allowed;
        &:hover {
          background-color: unset;
        }
      }
    }
  }
  &--lg {
    font-size: @largeFS;
  }
  &--sm {
    font-size: @smallFS;
  }
  .arrow-icon {
    position: absolute;
    top: 50%;
    margin-top: -6px;
    right: 6px;
    transition: all 0.3s linear;
  }
  .arrow-icon-rotate {
    transform: rotate(180deg);
  }
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.3s linear;
  }
  .dropdown-enter-from,
  .dropdown-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
}
</style>