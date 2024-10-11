import {
  useFitWindow,
  useMergeRefs,
  useOnResizeObserve,
} from "@renderer/utils/hooks";
import { ComponentRef, useEffect, useRef } from "react";
function App(): JSX.Element {
  const imageRef = useRef<ComponentRef<"img">>(null);
  const ref = useMergeRefs<ComponentRef<"div">>(
    useFitWindow<ComponentRef<"div">>([], "width"),
    useOnResizeObserve(() => {
      setTimeout(() => {
        window.api.send("center");
      });
    }, [])
  );
  useEffect(() => {
    window.api.invoke("getData", "app/start_logo").then((data) => {
      if (!imageRef.current || !data) return;
      imageRef.current.src = data;
    });
  }, [imageRef]);

  return (
    <>
      <div ref={ref} className="w-64">
        <div>
          <img
            ref={imageRef}
            alt="Image"
            className="w-full pointer-events-none select-none"
          />
        </div>
      </div>
    </>
  );
}

export default App;
