<template>
  <div class="rate">
    <div v-for="n in maxLength" :key="n" class="rate-item">
      <span class="rate-item_half"><slot name="default">A</slot></span>
      <span><slot name="default">A</slot></span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
const Rate = defineComponent({
  props: {
    maxLength: {
      type: Number,
      default: 5,
    },
  },
});
export default Rate;
</script>
<style lang="less" scoped>
.rate {
  display: flex;
  &-item {
    font-size: 16px;
    display: inline-block;
    width: 16px;
    height: 16px;
    position: relative;
    &_half {
      width: 50%;
      overflow: hidden;
      position: absolute;
      left: 0;
    }
  }
}
</style>