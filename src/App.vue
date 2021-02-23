<template>
  <div class="asd">
    <m-button type="primary" circle ghost noContent dash custormClass="sle">
      <template v-slot:icon>
        <i class="iconfont i-search"></i>
      </template>
    </m-button>
    <m-input type="text" prefix="$" suffix="12/3" addonBefore='jilk'>
      <!-- <template v-slot:addonBefore>fsd</template> -->
      <template v-slot:addonAfter>dsfds</template>
    </m-input>
  </div>
  
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Button from './components/Button.vue'
import Input from './components/Input.vue'
@Options({
  components: {
    'm-button': Button,
    'm-input': Input
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
};
}

</style>
