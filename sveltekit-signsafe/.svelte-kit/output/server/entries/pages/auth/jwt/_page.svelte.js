import { M as attr, C as pop, A as push } from "../../../../chunks/utils.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let username = "";
  let password = "";
  $$payload.out += `<div class="flex min-h-screen items-center justify-center bg-gray-50"><div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md"><h2 class="mb-6 text-2xl font-semibold">Login JWT</h2> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form class="space-y-4"><input type="text" placeholder="Username"${attr("value", username)} class="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" required> <input type="password" placeholder="Password"${attr("value", password)} class="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" required> <button type="submit" class="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700">Masuk</button></form></div></div>`;
  pop();
}
export {
  _page as default
};
