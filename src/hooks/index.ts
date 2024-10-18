import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { Dispatch, useEffect, useRef } from "react";
import { useState } from "react";
import { DependencyList } from "react";
import { useTranslation } from "react-i18next";

export function useForceUpdate() {
  const [i, setI] = useState(0);
  return () => setI(i + 1);
}
export function useConnected(): ReturnType<typeof useState<boolean>> {
  const [isOnline, setIsOnline] = useState(
    typeof navigator != "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    function onlineHandler() {
      setIsOnline(true);
    }

    function offlineHandler() {
      setIsOnline(false);
    }

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);
  return [isOnline, setIsOnline] as ReturnType<typeof useState<boolean>>;
}
function isRefObject<T>(ref: React.Ref<T>): ref is React.RefCallback<T> {
  return typeof ref === "function" || ref instanceof Function;
}
export function useSyncRefs<T>(...refs: React.Ref<T>[]) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (isRefObject(ref)) {
        ref(targetRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [targetRef.current, refs]);

  return targetRef;
}

export function useNotInitEffect(
  effect: React.EffectCallback,
  deps: [string | number | boolean]
) {
  const cur = useRef(deps);
  return useEffect(() => {
    if (!cur.current) return;
    const state = cur.current.some((val, i) => val != deps[i]);
    if (state) return effect();
  }, deps);
}

export function useDebounceEffect(
  fn: (deps?: DependencyList) => void,
  waitTime: number,
  deps?: DependencyList
) {
  const router = useRouter();
  useEffect(() => {
    const f = () => {
      fn.call(undefined, deps);
      router.events.off("routeChangeStart", f);
      clearTimeout(t);
    };
    router.events.on("routeChangeStart", f);
    const t = setTimeout(f, waitTime);

    return () => {
      clearTimeout(t);
      router.events.off("routeChangeStart", f);
    };
  }, deps);
}

export const useInitialEffect = (effect: () => void, deps?: DependencyList) => {
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (hasMountedRef.current) {
      return effect();
    } else {
      hasMountedRef.current = true;
    }
  }, deps);
};

export const useDebounceInitialEffect = (
  fn: (deps?: DependencyList) => void,
  waitTime: number,
  deps?: DependencyList
) => {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.call(undefined, deps);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
};

export function useDebounceState<T>(time: number, val?: T) {
  const [curVal, setVal] = useState(val);
  const [debounce, setDebounce] = useState(val);
  const [state, setState] = useState(false);
  useDebounceEffect(
    () => {
      setDebounce(curVal);
      setState(false);
    },
    time,
    [curVal]
  );
  useEffect(() => {
    setState(true);
  }, [curVal]);
  return [debounce, setVal, state, setDebounce] as [
    T,
    Dispatch<T>,
    boolean,
    ReturnType<typeof useState<T>>[1]
  ];
}
export type ResultLoading<T, Error> =
  | [T, false, null]
  | [null, false, Error]
  | [null, true, null];
export function useLoadingPromise<T, Error = unknown>(
  promise: () => Promise<T>,
  deps?: DependencyList,
  state = true
): ResultLoading<T, Error> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    if (!state) return;
    promise()
      .then((data) => {
        setData(data);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    setLoading(true);
  }, deps);
  return [data, loading, error] as any;
}

export function useFormateDate(props: Intl.DateTimeFormatOptions) {
  const { i18n } = useTranslation();
  return (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, props).format(date);
}
