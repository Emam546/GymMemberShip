import { useEffect, useRef, useState } from "react";

export function useFitWindow<T extends HTMLElement>(
  additional: Array<React.RefObject<HTMLElement>>,
  state: "height" | "width" = "height"
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useOnResizeObserve<T>(
    (entries) => {
      const { height, width } = entries[0].contentRect;
      setSize({ height, width });
      if (height !== size.height && state == "height") {
        window.api.send(
          "setContentHeight",
          height +
            additional.reduce((acc, elem) => {
              if (!elem.current) return acc;
              return acc + elem.current.offsetHeight;
            }, 0)
        );
      }
      if (width !== size.width && state == "width") {
        window.api.send(
          "setContentWidth",
          width +
            additional.reduce((acc, elem) => {
              if (!elem.current) return acc;
              return acc + elem.current.offsetWidth;
            }, 0)
        );
      }
    },
    [...additional]
  );
  return ref;
}
export function useOnResizeObserve<T extends HTMLElement>(
  funct: ResizeObserverCallback,
  additional: React.DependencyList
) {
  const [ref, setRef] = useState<T | null>(null);
  useEffect(() => {
    if (!ref) return;
    const resizeObserver = new ResizeObserver(funct);
    resizeObserver.observe(ref);
    return () => resizeObserver.disconnect();
  }, [ref, ...additional]);
  return setRef as React.Ref<T>;
}
function isRefObject<T>(ref: React.Ref<T>): ref is React.RefCallback<T> {
  return typeof ref === "function" || ref instanceof Function;
}
export function useMergeRefs<T>(...refs: React.Ref<T>[]) {
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
