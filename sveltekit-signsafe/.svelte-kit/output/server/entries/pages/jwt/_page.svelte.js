import { G as attr_class, F as escape_html, I as bind_props, C as pop, A as push, J as fallback, K as ensure_array_like } from "../../../chunks/utils.js";
import { T as Toaster } from "../../../chunks/Toaster.js";
import { C as Circle_arrow_down, a as Circle_arrow_up, f as formatCurrency, H as History, A as Arrow_down_up, U as Upload, E as Ellipsis_vertical } from "../../../chunks/upload.js";
import "clsx";
import "idb";
function HistoryCard($$payload, $$props) {
  push();
  let item = $$props["item"];
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }
  $$payload.out += `<div class="flex w-full items-center justify-between"><div class="flex items-center gap-3"><div${attr_class(`flex h-8 w-8 items-center justify-center rounded-full
						${item.type === "topup" || item.type === "receive" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`)}>`;
  if (item.type === "topup" || item.type === "receive") {
    $$payload.out += "<!--[-->";
    Circle_arrow_down($$payload, { size: 20 });
  } else {
    $$payload.out += "<!--[!-->";
    Circle_arrow_up($$payload, { size: 20 });
  }
  $$payload.out += `<!--]--></div> <div><div class="font-medium">${escape_html(item.type === "topup" ? "Top Up" : item.type === "receive" ? `Receive from ${item.sender_name ?? "unknown"}` : `Transfer to ${item.reciever_name ?? "unknown"}`)}</div> <div class="text-sm text-gray-500">${escape_html(formatDate(item.timestamp))}</div></div></div> <div${attr_class(`text-right font-semibold 
					${item.type === "topup" || item.type === "receive" ? "text-green-600" : "text-red-600"}`)}>${escape_html(item.type === "transfer" ? "-" : "+")}${escape_html(formatCurrency(item.amount))}</div></div>`;
  bind_props($$props, { item });
  pop();
}
function HistoryModal($$payload, $$props) {
  push();
  let history = fallback($$props["history"], () => [], true);
  $$payload.out += `<button class="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:opacity-70"><div class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-100">`;
  History($$payload, {
    size: 16,
    strokeWidth: 1.5,
    class: "text-blue-500"
  });
  $$payload.out += `<!----></div> <span class="text-sm font-medium text-gray-700">Riwayat</span></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { history });
  pop();
}
function TransferModal($$payload, $$props) {
  push();
  let currentID = fallback($$props["currentID"], "");
  $$payload.out += `<button class="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:opacity-70"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">`;
  Arrow_down_up($$payload, {
    size: 16,
    strokeWidth: 1.5,
    class: "text-blue-500"
  });
  $$payload.out += `<!----></div> <span class="text-sm font-medium text-gray-700">Transfer</span></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  Toaster($$payload, {});
  $$payload.out += `<!---->`;
  bind_props($$props, { currentID });
  pop();
}
function TopupModal($$payload, $$props) {
  push();
  $$payload.out += `<button class="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:opacity-70"><div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">`;
  Upload($$payload, {
    size: 16,
    strokeWidth: 1.5,
    class: "text-blue-500"
  });
  $$payload.out += `<!----></div> <span class="text-sm font-medium text-gray-700">Top Up</span></button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  Toaster($$payload, {});
  $$payload.out += `<!---->`;
  pop();
}
function DashboardModal($$payload) {
  let isOpen = false;
  const handleOpenModal = () => {
    isOpen = !isOpen;
  };
  $$payload.out += `<div class="relative">`;
  Ellipsis_vertical($$payload, {
    size: 25,
    onclick: handleOpenModal,
    class: "cursor-pointer"
  });
  $$payload.out += `<!----> `;
  if (isOpen) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="absolute -right-0 -bottom-10 rounded bg-white px-5 py-2 shadow"><ul><button class="cursor-pointer"><li>Logout</li></button></ul></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
}
function _page($$payload, $$props) {
  push();
  let history = [];
  $$payload.out += `<div class="min-h-screen bg-gray-50"><div class="mx-auto mb-4 flex max-w-md items-center justify-between rounded-lg bg-white p-4"><h1 class="text-center text-2xl font-bold text-blue-500">E-Wallet</h1> `;
  DashboardModal($$payload);
  $$payload.out += `<!----></div> <div class="mx-auto max-w-md px-2"><div class="mb-6 flex flex-col items-stretch justify-between rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 p-6 text-white shadow-lg"><div class="flex items-center justify-between"><div class="flex flex-col items-start justify-center"><p class="text-xs text-blue-100">Username</p> <p class="text-sm font-medium text-white">${escape_html("-")}</p></div> <div class="flex flex-col items-start justify-center"><p class="text-xs text-blue-100">User ID</p> <p class="text-sm font-medium text-white">${escape_html("-")}</p></div></div> <div><p class="text-sm font-medium text-blue-100">Saldo Sekarang</p> <h1 class="text-3xl font-bold">${escape_html(0)}</h1></div></div> <div class="mb-6 grid grid-cols-3 gap-4">`;
  TopupModal($$payload);
  $$payload.out += `<!----> `;
  TransferModal($$payload, {
    currentID: ""
  });
  $$payload.out += `<!----> `;
  HistoryModal($$payload, {});
  $$payload.out += `<!----></div> <div class="rounded-2xl bg-white p-6 shadow-sm"><div class="mb-4 flex items-center justify-between"><h2 class="text-lg font-semibold text-gray-800">Aktivitas Terakhir</h2></div> <div class="flex w-full flex-col gap-4">`;
  if (!history || history.length <= 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="w-full text-center text-gray-500">Belum ada riwayat transaksi.</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(history);
    $$payload.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      HistoryCard($$payload, { item });
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div></div></div>`;
  pop();
}
export {
  _page as default
};
