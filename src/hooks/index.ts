import { useQuery } from "@tanstack/react-query";
import React, { Dispatch, useEffect, useRef } from "react";
import { useState } from "react";
import { DependencyList } from "react";

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
export function useSyncRefs<TType>(
    ...refs: (
        | React.MutableRefObject<TType | null>
        | ((instance: TType) => void)
        | null
    )[]
) {
    const cache = React.useRef(refs);

    React.useEffect(() => {
        cache.current = refs;
    }, [refs]);

    return React.useCallback(
        (value: TType) => {
            for (let ref of cache.current) {
                if (ref == null) {
                    continue;
                }
                if (typeof ref === "function") {
                    ref(value);
                } else {
                    ref.current = value;
                }
            }
        },
        [cache]
    );
}

export function useNotInitEffect(
    effect: React.EffectCallback,
    deps: [string | number | boolean]
) {
    const cur = useRef(deps);
    return useEffect(() => {
        const state = cur.current!.some((val, i) => val != deps[i]);
        if (state) return effect();
    }, deps);
}

export function useDebounceEffect(
    fn: (deps?: DependencyList) => void,
    waitTime: number,
    deps?: DependencyList
) {
    useEffect(() => {
        const t = setTimeout(() => {
            fn.call(undefined, deps);
        }, waitTime);

        return () => {
            clearTimeout(t);
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
    const [debounce, setdebounce] = useState(val);
    const [state, setState] = useState(false);
    useDebounceEffect(
        () => {
            setdebounce(curVal);
            setState(false);
        },
        time,
        [curVal]
    );
    useEffect(() => {
        setState(true);
    }, [curVal]);
    return [debounce, setVal, state, setdebounce] as [
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
    state: boolean = true
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
export function useLoadingPromiseQuery<T, Error = unknown>(
    promise: () => Promise<T>,
    keys: any,
    state: boolean = true
): ResultLoading<T, Error> {
    const query = useQuery<T, Error>({
        queryKey: keys,
        queryFn: promise,
        enabled: state,
    });
    return [query.data || null, query.isLoading, query.error] as any;
}
