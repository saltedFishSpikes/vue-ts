<template>
  <div :class="{ vertical: !vertical || !radioType }">
    <template v-if="radioType">
      <m-radio
        class="mr5"
        v-for="radio of radios"
        :key="radio.value"
        :value="radio.value"
        :checked="modelValue === radio.value"
        :disabled="
          disabled || radio.disabled || disabledRadio.includes(radio.value)
        "
        :name="name"
        :size="size"
        @on-choose="choose"
      >
        <m-render v-if="radio.render" :renderFun="radio.render"></m-render>
        <template v-else>{{ radio.label }}</template>
      </m-radio>
    </template>
    <template v-else>
      <m-button
        v-for="(radio, index) of radios"
        :key="radio.value"
        :type="modelValue === radio.value ? 'primary' : 'default'"
        :size="size"
        :disabled="
          disabled || radio.disabled || disabledRadio.includes(radio.value)
        "
        :custormStyle="radioButtonStyle(modelValue === radio.value, index)"
        @on-click="choose(radio.value)"
      >
        <m-render v-if="radio.render" :renderFun="radio.render"></m-render>
        <template v-else>{{ radio.label }}</template>
      </m-button>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue"; // eslint-disable-line no-unused-vars
import Render from "./Render.vue";
import Radio from "./Radio.vue";
import Button from "./Button.vue";
import { SizeTypes, RadioTypes } from "@/common/init";
type ValueType = string | number | boolean;
interface radioValue {
  label?: string;
  value: ValueType;
  disabled?: boolean;
  render?: Function;
}
type beforeChooseFun = (v: ValueType) => boolean;

const RadioGroup = defineComponent({
  components: {
    "m-radio": Radio,
    "m-render": Render,
    "m-button": Button,
  },
  props: {
    radios: {
      type: Array as PropType<Array<radioValue>>,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    disabledRadio: {
      type: Array as PropType<Array<ValueType>>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
    name: {
      type: [String, Number, Boolean],
      default: "",
    },
    size: {
      type: String as PropType<SizeTypes>,
      default: SizeTypes.DEFAULT,
    },
    type: {
      type: String as PropType<RadioTypes>,
      default: RadioTypes.DEFAULT,
    },

    beforeChoose: {
      type: Function as PropType<beforeChooseFun>,
      default: () => true,
    },
  },
  emits: ["update:modelValue"],

  computed: {
    radioType(): Boolean {
      return this.type === RadioTypes.DEFAULT;
    },
  },
  methods: {
    choose(v: ValueType): void {
      if (this.beforeChoose(v)) {
        this.$emit("update:modelValue", v);
      }
    },
    radioButtonStyle(checked: boolean, index: number): object {
      return {
        borderRadius: 0,
        borderColor: "#d9d9d9",
        borderStyle: "solid",
        borderWidth: checked ? "0px" : index === 0 ? "1px" : "1px 1px 1px 0",
      };
    },
  },
});
export default RadioGroup;
</script>
<style lang="less" scoped>
.vertical {
  display: flex;
  align-items: center;
  width: fit-content;
}
</style>