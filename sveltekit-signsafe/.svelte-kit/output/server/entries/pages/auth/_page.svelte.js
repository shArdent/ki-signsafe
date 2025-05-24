import "clsx";
import { C as pop, A as push } from "../../../chunks/utils.js";
import "idb";
import { T as Toaster } from "../../../chunks/Toaster.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="mt-10 text-center text-gray-600">Checking session...</p>`;
  }
  $$payload.out += `<!--]--> `;
  Toaster($$payload, {});
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
