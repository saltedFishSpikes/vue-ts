import { Directive, DirectiveBinding } from "vue";

const onScroll = () => {
  let page = 1;
  return (el: HTMLElement, pageSize: number) => {
    const { scrollTop, clientHeight, scrollHeight } = el;
    if (scrollTop + clientHeight + 10 >= scrollHeight) {
      let children = [...el.children];
      for (let i = 0; i < pageSize; i++) {
        if (children[page * pageSize + i]) {
          (children[page * pageSize + i] as HTMLElement).style.display =
            "block";
        }
      }
      page++;
    }
  };
};

export default {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const { value = 10 } = binding;
    const children = [...el.children];
    children.forEach((item: Element, index: number) => {
      let htmlItem = item as HTMLElement;
      if (index > value) {
        htmlItem.style.display = "none";
      }
    });
  },
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value = 10 } = binding;
    el.addEventListener("scroll", onScroll().bind(this, el, value));
  },
  beforeUnmount(el: HTMLElement, binding: DirectiveBinding) {
    const { value = 10 } = binding;
    el.removeEventListener("scroll", onScroll().bind(this, el, value));
  }
} as Directive;
