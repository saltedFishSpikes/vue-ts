<template>
  <div class="asd">
    <m-dialog v-model="show">afdf</m-dialog>
    <m-button type="primary" @on-click="show = !show">showToast</m-button>
    <m-button type="primary" @on-click="close">close</m-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
const App = defineComponent({
  data() {
    return {
      show: false,
    };
  },
  methods: {
    close() {
      this.$toast.show({
        content: "fds",
        time: 0,
        closeable: true,
        zIndex: 9999,
      });
    },
    showToast() {
      this.$dialog.success({ content: "fsdgjh", title: "fds" });
    },
  },
});
export default App;
</script>

<style lang="less">
</style>
