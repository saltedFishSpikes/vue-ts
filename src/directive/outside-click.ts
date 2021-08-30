import { Directive, DirectiveBinding } from "vue";

function outSideClick(el: HTMLElement, callback: Function, e: MouseEvent) {
  const { target } = e;
  if (!target || !el.contains(target as Node)) {
    callback(e);
  }
}

let outSideClickWithArgs = (e: MouseEvent) => {};

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (typeof value === "function") {
      outSideClickWithArgs = outSideClick.bind(this, el, value);
      document.body.addEventListener("click", outSideClickWithArgs);
    }
  },
  unmounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    if (typeof value === "function") {
      document.body.removeEventListener("click", outSideClickWithArgs);
    }
  }
} as Directive;
