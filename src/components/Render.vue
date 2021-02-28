<script lang="ts">
import { defineComponent, h } from "vue";
const Render = defineComponent({
  render() {
    return this.renderFun(h);
  },
  props: {
    renderFun: {
      type: Function,
      default: () => {},
    },
  },
});
export default Render;
</script>