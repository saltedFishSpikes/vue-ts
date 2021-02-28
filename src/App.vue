<template>
  <div class="asd">
    <m-button type="primary"  disabled @on-click="fdsf">
      {{}}
    </m-button>
    <m-input
      type="text"
      ref="m-input"
      prefix="$"
      clearable
      size="small"
      :addonAfter="val"
      suffix="12/3"
      v-model="val"
      :inputFormat="() => {}"
      :maxLength="3"
      @on-input="hjk"
    >
      <!-- <template v-slot:addonBefore>fsd</template> -->
      <template v-slot:suffix
        ><m-button size="small" type="primary">按订</m-button></template
      >
    </m-input>
    <m-radio
      size="large"
      :disabled="item.disabled"
      v-for="item of data"
      :key="item.value"
      :value="item.value"
      @on-choose="change"
      :checked="v === item.value"
      
    >
      hjkfkjdhglsjgdj
    </m-radio>
    <m-radio-group
      size="default"
      :radios="data"
      v-model="v"
      type="button"
    ></m-radio-group>
    <m-rate></m-rate>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Button from "./components/Button.vue";
import Input from "./components/Input.vue";
import Radio from "./components/Radio.vue";
import RadioGroup from "./components/RadioGroup.vue";
import Rate from "./components/Rate.vue";
@Options({
  components: {
    "m-button": Button,
    "m-input": Input,
    "m-radio": Radio,
    "m-radio-group": RadioGroup,
    "m-rate": Rate
  },
  data() {
    return {
      val: "90",
      ds: false,
      data: [
        { id: 1, value: 1, label: "s", disabled: true },
        { id: 2, value: 2 },
        { id: 3, value: 3, label: "d" },
      ],
      v: 1
    };
  },
  mounted() {
    this.$refs["m-input"].focus();
    setTimeout(() => {
      this.$refs["m-input"].blur();
    }, 2000);
  },
  methods: {
    format() {
      return undefined;
    },
    hjk(): void {
      console.log(this.val, typeof this.val);
    },
    fdsf() {
      console.log(this.ds);
      this.ds = !this.ds;
    },
    change(v: any) {
      console.log(v);
      this.v = v;
    },
  },
})
export default class App extends Vue {}
</script>

<style lang="less" scoped>
.asd {
  margin: 10px;
  // background-color: red
  .sle {
    color: red;
  }
  .cs {
    background-color: @primaryColor !important;
    color: red;
  }
}
</style>
