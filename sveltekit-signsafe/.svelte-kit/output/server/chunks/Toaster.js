import axios from "axios";
import { S as current_component, J as fallback, T as attr_style, I as bind_props, F as escape_html, R as spread_props, O as spread_attributes, C as pop, A as push, G as attr_class, U as stringify, V as slot, W as store_get, K as ensure_array_like, X as unsubscribe_stores } from "./utils.js";
import { d as derived, g as get, w as writable } from "./index2.js";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
});
const apiJWT = axios.create({
  baseURL: "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json"
  }
});
apiJWT.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
function writableDerived(origins, derive, reflect, initial) {
  var childDerivedSetter, originValues, blockNextDerive = false;
  var reflectOldValues = reflect.length >= 2;
  var wrappedDerive = (got, set, update3) => {
    childDerivedSetter = set;
    if (reflectOldValues) {
      originValues = got;
    }
    if (!blockNextDerive) {
      let returned = derive(got, set, update3);
      if (derive.length < 2) {
        set(returned);
      } else {
        return returned;
      }
    }
    blockNextDerive = false;
  };
  var childDerived = derived(origins, wrappedDerive, initial);
  var singleOrigin = !Array.isArray(origins);
  function doReflect(reflecting) {
    var setWith = reflect(reflecting, originValues);
    if (singleOrigin) {
      blockNextDerive = true;
      origins.set(setWith);
    } else {
      setWith.forEach((value, i) => {
        blockNextDerive = true;
        origins[i].set(value);
      });
    }
    blockNextDerive = false;
  }
  var tryingSet = false;
  function update2(fn) {
    var isUpdated, mutatedBySubscriptions, oldValue, newValue;
    if (tryingSet) {
      newValue = fn(get(childDerived));
      childDerivedSetter(newValue);
      return;
    }
    var unsubscribe = childDerived.subscribe((value) => {
      if (!tryingSet) {
        oldValue = value;
      } else if (!isUpdated) {
        isUpdated = true;
      } else {
        mutatedBySubscriptions = true;
      }
    });
    newValue = fn(oldValue);
    tryingSet = true;
    childDerivedSetter(newValue);
    unsubscribe();
    tryingSet = false;
    if (mutatedBySubscriptions) {
      newValue = get(childDerived);
    }
    if (isUpdated) {
      doReflect(newValue);
    }
  }
  return {
    subscribe: childDerived.subscribe,
    set(value) {
      update2(() => value);
    },
    update: update2
  };
}
const TOAST_LIMIT = 20;
const toasts = writable([]);
const pausedAt = writable(null);
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    remove(toastId);
  }, 1e3);
  toastTimeouts.set(toastId, timeout);
};
const clearFromRemoveQueue = (toastId) => {
  const timeout = toastTimeouts.get(toastId);
  if (timeout) {
    clearTimeout(timeout);
  }
};
function update(toast2) {
  if (toast2.id) {
    clearFromRemoveQueue(toast2.id);
  }
  toasts.update(($toasts) => $toasts.map((t) => t.id === toast2.id ? { ...t, ...toast2 } : t));
}
function add(toast2) {
  toasts.update(($toasts) => [toast2, ...$toasts].slice(0, TOAST_LIMIT));
}
function upsert(toast2) {
  if (get(toasts).find((t) => t.id === toast2.id)) {
    update(toast2);
  } else {
    add(toast2);
  }
}
function dismiss(toastId) {
  toasts.update(($toasts) => {
    if (toastId) {
      addToRemoveQueue(toastId);
    } else {
      $toasts.forEach((toast2) => {
        addToRemoveQueue(toast2.id);
      });
    }
    return $toasts.map((t) => t.id === toastId || toastId === void 0 ? { ...t, visible: false } : t);
  });
}
function remove(toastId) {
  toasts.update(($toasts) => {
    if (toastId === void 0) {
      return [];
    }
    return $toasts.filter((t) => t.id !== toastId);
  });
}
function startPause(time) {
  pausedAt.set(time);
}
function endPause(time) {
  let diff;
  pausedAt.update(($pausedAt) => {
    diff = time - ($pausedAt || 0);
    return null;
  });
  toasts.update(($toasts) => $toasts.map((t) => ({
    ...t,
    pauseDuration: t.pauseDuration + diff
  })));
}
const defaultTimeouts = {
  blank: 4e3,
  error: 4e3,
  success: 2e3,
  loading: Infinity,
  custom: 4e3
};
function useToasterStore(toastOptions = {}) {
  const mergedToasts = writableDerived(toasts, ($toasts) => $toasts.map((t) => ({
    ...toastOptions,
    ...toastOptions[t.type],
    ...t,
    duration: t.duration || toastOptions[t.type]?.duration || toastOptions?.duration || defaultTimeouts[t.type],
    style: [toastOptions.style, toastOptions[t.type]?.style, t.style].join(";")
  })), ($toasts) => $toasts);
  return {
    toasts: mergedToasts,
    pausedAt
  };
}
const isFunction = (valOrFunction) => typeof valOrFunction === "function";
const resolveValue = (valOrFunction, arg) => isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction;
const genId = /* @__PURE__ */ (() => {
  let count = 0;
  return () => {
    count += 1;
    return count.toString();
  };
})();
const prefersReducedMotion = /* @__PURE__ */ (() => {
  let shouldReduceMotion;
  return () => {
    if (shouldReduceMotion === void 0 && typeof window !== "undefined") {
      const mediaQuery = matchMedia("(prefers-reduced-motion: reduce)");
      shouldReduceMotion = !mediaQuery || mediaQuery.matches;
    }
    return shouldReduceMotion;
  };
})();
const createToast = (message, type = "blank", opts) => ({
  createdAt: Date.now(),
  visible: true,
  type,
  ariaProps: {
    role: "status",
    "aria-live": "polite"
  },
  message,
  pauseDuration: 0,
  ...opts,
  id: opts?.id || genId()
});
const createHandler = (type) => (message, options) => {
  const toast2 = createToast(message, type, options);
  upsert(toast2);
  return toast2.id;
};
const toast = (message, opts) => createHandler("blank")(message, opts);
toast.error = createHandler("error");
toast.success = createHandler("success");
toast.loading = createHandler("loading");
toast.custom = createHandler("custom");
toast.dismiss = (toastId) => {
  dismiss(toastId);
};
toast.remove = (toastId) => remove(toastId);
toast.promise = (promise, msgs, opts) => {
  const id = toast.loading(msgs.loading, { ...opts, ...opts?.loading });
  promise.then((p) => {
    toast.success(resolveValue(msgs.success, p), {
      id,
      ...opts,
      ...opts?.success
    });
    return p;
  }).catch((e) => {
    toast.error(resolveValue(msgs.error, e), {
      id,
      ...opts,
      ...opts?.error
    });
  });
  return promise;
};
function calculateOffset(toast2, $toasts, opts) {
  const { reverseOrder, gutter = 8, defaultPosition } = opts || {};
  const relevantToasts = $toasts.filter((t) => (t.position || defaultPosition) === (toast2.position || defaultPosition) && t.height);
  const toastIndex = relevantToasts.findIndex((t) => t.id === toast2.id);
  const toastsBefore = relevantToasts.filter((toast3, i) => i < toastIndex && toast3.visible).length;
  const offset = relevantToasts.filter((t) => t.visible).slice(...reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]).reduce((acc, t) => acc + (t.height || 0) + gutter, 0);
  return offset;
}
const handlers = {
  startPause() {
    startPause(Date.now());
  },
  endPause() {
    endPause(Date.now());
  },
  updateHeight: (toastId, height) => {
    update({ id: toastId, height });
  },
  calculateOffset
};
function useToaster(toastOptions) {
  const { toasts: toasts2, pausedAt: pausedAt2 } = useToasterStore(toastOptions);
  const timeouts = /* @__PURE__ */ new Map();
  let _pausedAt;
  const unsubscribes = [
    pausedAt2.subscribe(($pausedAt) => {
      if ($pausedAt) {
        for (const [, timeoutId] of timeouts) {
          clearTimeout(timeoutId);
        }
        timeouts.clear();
      }
      _pausedAt = $pausedAt;
    }),
    toasts2.subscribe(($toasts) => {
      if (_pausedAt) {
        return;
      }
      const now = Date.now();
      for (const t of $toasts) {
        if (timeouts.has(t.id)) {
          continue;
        }
        if (t.duration === Infinity) {
          continue;
        }
        const durationLeft = (t.duration || 0) + t.pauseDuration - (now - t.createdAt);
        if (durationLeft < 0) {
          if (t.visible) {
            toast.dismiss(t.id);
          }
          return null;
        }
        timeouts.set(t.id, setTimeout(() => toast.dismiss(t.id), durationLeft));
      }
    })
  ];
  onDestroy(() => {
    for (const unsubscribe of unsubscribes) {
      unsubscribe();
    }
  });
  return { toasts: toasts2, handlers };
}
function CheckmarkIcon($$payload, $$props) {
  let primary = fallback($$props["primary"], "#61d345");
  let secondary = fallback($$props["secondary"], "#fff");
  $$payload.out += `<div class="svelte-11kvm4p"${attr_style("", {
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
  bind_props($$props, { primary, secondary });
}
function ErrorIcon($$payload, $$props) {
  let primary = fallback($$props["primary"], "#ff4b4b");
  let secondary = fallback($$props["secondary"], "#fff");
  $$payload.out += `<div class="svelte-1ee93ns"${attr_style("", {
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
  bind_props($$props, { primary, secondary });
}
function LoaderIcon($$payload, $$props) {
  let primary = fallback($$props["primary"], "#616161");
  let secondary = fallback($$props["secondary"], "#e0e0e0");
  $$payload.out += `<div class="svelte-1j7dflg"${attr_style("", {
    "--primary": primary,
    "--secondary": secondary
  })}></div>`;
  bind_props($$props, { primary, secondary });
}
function ToastIcon($$payload, $$props) {
  let type, icon, iconTheme;
  let toast2 = $$props["toast"];
  ({ type, icon, iconTheme } = toast2);
  if (typeof icon === "string") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="animated svelte-1kgeier">${escape_html(icon)}</div>`;
  } else if (typeof icon !== "undefined") {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<!---->`;
    icon?.($$payload, {});
    $$payload.out += `<!---->`;
  } else if (type !== "blank") {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="indicator svelte-1kgeier">`;
    LoaderIcon($$payload, spread_props([iconTheme]));
    $$payload.out += `<!----> `;
    if (type !== "loading") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="status svelte-1kgeier">`;
      if (type === "error") {
        $$payload.out += "<!--[-->";
        ErrorIcon($$payload, spread_props([iconTheme]));
      } else {
        $$payload.out += "<!--[!-->";
        CheckmarkIcon($$payload, spread_props([iconTheme]));
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { toast: toast2 });
}
function ToastMessage($$payload, $$props) {
  push();
  let toast2 = $$props["toast"];
  $$payload.out += `<div${spread_attributes({ class: "message", ...toast2.ariaProps }, "svelte-1nauejd")}>`;
  if (typeof toast2.message === "string") {
    $$payload.out += "<!--[-->";
    $$payload.out += `${escape_html(toast2.message)}`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    toast2.message?.($$payload, { toast: toast2 });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { toast: toast2 });
  pop();
}
function ToastBar($$payload, $$props) {
  push();
  let toast2 = $$props["toast"];
  let position = fallback($$props["position"], () => void 0, true);
  let style = fallback($$props["style"], "");
  let Component = fallback($$props["Component"], () => void 0, true);
  let factor;
  let animation;
  {
    const top = (toast2.position || position || "top-center").includes("top");
    factor = top ? 1 : -1;
    const [enter, exit] = prefersReducedMotion() ? ["fadeIn", "fadeOut"] : ["enter", "exit"];
    animation = toast2.visible ? enter : exit;
  }
  $$payload.out += `<div${attr_class(`base ${stringify(toast2.height ? animation : "transparent")} ${stringify(toast2.className || "")}`, "svelte-ug60r4")}${attr_style(`${stringify(style)}; ${stringify(toast2.style)}`, { "--factor": factor })}>`;
  if (Component) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    Component?.($$payload, {
      $$slots: {
        icon: ($$payload2) => {
          ToastIcon($$payload2, { toast: toast2, slot: "icon" });
        },
        message: ($$payload2) => {
          ToastMessage($$payload2, { toast: toast2, slot: "message" });
        }
      }
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { ToastIcon, ToastMessage, toast: toast2 }, () => {
      ToastIcon($$payload, { toast: toast2 });
      $$payload.out += `<!----> `;
      ToastMessage($$payload, { toast: toast2 });
      $$payload.out += `<!---->`;
    });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { toast: toast2, position, style, Component });
  pop();
}
function ToastWrapper($$payload, $$props) {
  push();
  let top, bottom, factor, justifyContent;
  let toast2 = $$props["toast"];
  let setHeight = $$props["setHeight"];
  top = toast2.position?.includes("top") ? 0 : null;
  bottom = toast2.position?.includes("bottom") ? 0 : null;
  factor = toast2.position?.includes("top") ? 1 : -1;
  justifyContent = toast2.position?.includes("center") && "center" || (toast2.position?.includes("right") || toast2.position?.includes("end")) && "flex-end" || null;
  $$payload.out += `<div${attr_class("wrapper svelte-v01oml", void 0, {
    "active": toast2.visible,
    "transition": !prefersReducedMotion()
  })}${attr_style("", {
    "--factor": factor,
    "--offset": toast2.offset,
    top,
    bottom,
    "justify-content": justifyContent
  })}>`;
  if (toast2.type === "custom") {
    $$payload.out += "<!--[-->";
    ToastMessage($$payload, { toast: toast2 });
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { toast: toast2 }, () => {
      ToastBar($$payload, { toast: toast2, position: toast2.position });
    });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { toast: toast2, setHeight });
  pop();
}
function Toaster($$payload, $$props) {
  push();
  var $$store_subs;
  let reverseOrder = fallback($$props["reverseOrder"], false);
  let position = fallback($$props["position"], "top-center");
  let toastOptions = fallback($$props["toastOptions"], () => void 0, true);
  let gutter = fallback($$props["gutter"], 8);
  let containerStyle = fallback($$props["containerStyle"], () => void 0, true);
  let containerClassName = fallback($$props["containerClassName"], () => void 0, true);
  const { toasts: toasts2, handlers: handlers2 } = useToaster(toastOptions);
  let _toasts;
  _toasts = store_get($$store_subs ??= {}, "$toasts", toasts2).map((toast2) => ({
    ...toast2,
    position: toast2.position || position,
    offset: handlers2.calculateOffset(toast2, store_get($$store_subs ??= {}, "$toasts", toasts2), {
      reverseOrder,
      gutter,
      defaultPosition: position
    })
  }));
  const each_array = ensure_array_like(_toasts);
  $$payload.out += `<div${attr_class(`toaster ${stringify(containerClassName || "")}`, "svelte-1phplh9")}${attr_style(containerStyle)} role="alert"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let toast2 = each_array[$$index];
    ToastWrapper($$payload, {
      toast: toast2,
      setHeight: (height) => handlers2.updateHeight(toast2.id, height)
    });
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    reverseOrder,
    position,
    toastOptions,
    gutter,
    containerStyle,
    containerClassName
  });
  pop();
}
export {
  Toaster as T
};
