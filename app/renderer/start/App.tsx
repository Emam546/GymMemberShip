import {
  useFitWindow,
  useMergeRefs,
  useOnResizeObserve,
} from "@renderer/utils/hooks";
import { ComponentRef, useEffect } from "react";
import image from "../../../build/icon.png";
function App(): JSX.Element {
  const ref = useMergeRefs<ComponentRef<"div">>(
    useOnResizeObserve(() => {
      window.api.send("center");
    }, []),
    useFitWindow<ComponentRef<"div">>([], "width")
  );
  return (
    <>
      <div ref={ref} className="w-64">
        <div>
          <img
            src={image}
            alt="Image"
            className="w-full pointer-events-none select-none"
          />
        </div>
      </div>
    </>
  );
}

export default App;
