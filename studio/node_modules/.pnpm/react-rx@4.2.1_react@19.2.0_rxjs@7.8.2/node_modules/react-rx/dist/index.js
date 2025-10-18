"use client";
import { c } from "react-compiler-runtime";
import { useSyncExternalStore, useState, useEffect } from "react";
import { catchError, finalize, share, timer, asapScheduler, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { observableCallback } from "observable-callback";
import { useEffectEvent } from "use-effect-event";
function getValue(value) {
  return typeof value == "function" ? value() : value;
}
const cache = /* @__PURE__ */ new WeakMap(), EMPTY_OBJECT = {};
function useObservable(observable, initialValue, t0) {
  const $ = c(10), options = t0 === void 0 ? EMPTY_OBJECT : t0, {
    disabled: t1
  } = options, disabled = t1 === void 0 ? !1 : t1;
  if (!cache.has(observable)) {
    const state = {
      didEmit: !1
    }, entry = {
      state,
      observable: observable.pipe(map(_temp$1), catchError(_temp2), tap((t22) => {
        const {
          snapshot,
          error: error_0
        } = t22;
        state.didEmit = !0, state.snapshot = snapshot, state.error = error_0;
      }), map(_temp3), finalize(() => cache.delete(observable)), share({
        resetOnRefCountZero: _temp4
      })),
      getSnapshot: (initialValue_0) => {
        if (state.error)
          throw state.error;
        return state.didEmit ? state.snapshot : getValue(initialValue_0);
      }
    };
    entry.observable.subscribe().unsubscribe(), cache.set(observable, entry);
  }
  let t2;
  $[0] !== observable ? (t2 = cache.get(observable), $[0] = observable, $[1] = t2) : t2 = $[1];
  const instance = t2;
  let t3;
  $[2] !== disabled || $[3] !== instance.observable ? (t3 = (onStoreChange) => {
    if (disabled)
      return _temp5;
    const subscription_0 = instance.observable.subscribe(onStoreChange);
    return () => {
      subscription_0.unsubscribe();
    };
  }, $[2] = disabled, $[3] = instance.observable, $[4] = t3) : t3 = $[4];
  const subscribe = t3;
  let t4;
  $[5] !== initialValue || $[6] !== instance ? (t4 = () => instance.getSnapshot(initialValue), $[5] = initialValue, $[6] = instance, $[7] = t4) : t4 = $[7];
  let t5;
  return $[8] !== initialValue ? (t5 = typeof initialValue > "u" ? void 0 : () => getValue(initialValue), $[8] = initialValue, $[9] = t5) : t5 = $[9], useSyncExternalStore(subscribe, t4, t5);
}
function _temp5() {
}
function _temp4() {
  return timer(0, asapScheduler);
}
function _temp3(value_0) {
}
function _temp2(error) {
  return of({
    snapshot: void 0,
    error
  });
}
function _temp$1(value) {
  return {
    snapshot: value,
    error: void 0
  };
}
function useObservableEvent(handleEvent) {
  const $ = c(7), [t0] = useState(_temp), [calls$, call] = t0;
  let t1;
  $[0] !== handleEvent ? (t1 = (observable) => handleEvent(observable), $[0] = handleEvent, $[1] = t1) : t1 = $[1];
  const onEvent = useEffectEvent(t1);
  let t2;
  $[2] !== calls$ || $[3] !== onEvent ? (t2 = () => {
    const subscription = calls$.pipe((observable_0) => onEvent(observable_0)).subscribe();
    return () => subscription.unsubscribe();
  }, $[2] = calls$, $[3] = onEvent, $[4] = t2) : t2 = $[4];
  let t3;
  return $[5] !== calls$ ? (t3 = [calls$], $[5] = calls$, $[6] = t3) : t3 = $[6], useEffect(t2, t3), call;
}
function _temp() {
  return observableCallback();
}
export {
  useObservable,
  useObservableEvent
};
//# sourceMappingURL=index.js.map
