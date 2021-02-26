<template>
  <div class="asd">
    <m-button type="primary" size="small" noContent @on-click="fdsf">
      
        <i class="iconfont i-search"></i>
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
      :maxLength="3"
      @on-input="hjk"
    >
      <!-- <template v-slot:addonBefore>fsd</template> -->
      <template v-slot:suffix><m-button size="small" type="primary">按订</m-button></template>
    </m-input>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Button from "./components/Button.vue";
import Input from "./components/Input.vue";
@Options({
  components: {
    "m-button": Button,
    "m-input": Input,
  },
  data() {
    return {
      val: "90",
      ds: false,
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
      return this.val + this.val;
    },
    hjk(): void {
      console.log(this.val, typeof this.val)
    },
    fdsf() {
      console.log(this.ds);
      this.ds = !this.ds;
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
