import { ComponentRef, useEffect, useRef, useState } from "react";

export function useFitWindow<T extends HTMLElement>(
  additional: Array<React.RefObject<HTMLElement>>,
  state: "height" | "width" = "height"
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useOnResizeObserve<T>(
    (entries) => {
      if (!ref.current) return;
      const { height, width } = entries[0].contentRect;
      setSize({ height, width });
      if (height !== size.height && state == "height") {
        window.api.send(
          "setContentHeight",
          ref.current!.offsetHeight +
            additional.reduce((acc, elem) => {
              if (!elem.current) return acc;
              return acc + elem.current.offsetHeight;
            }, 0)
        );
      }
      if (width !== size.width && state == "width") {
        window.api.send(
          "setContentWidth",
          ref.current!.offsetWidth +
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
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!ref.current) return;
    let resizeObserver = new ResizeObserver(funct);
    resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [ref, ...additional]);
  return ref;
}
type Ref<T> = React.RefObject<T>;
export function useMergeRefs<T>(...refs: Ref<T>[]) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function" || ref instanceof Function) {
        ref(targetRef.current);
      } else if (ref) {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
