import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { useConnected } from "@src/hooks";
export default function ConnectedBar() {
  const [connected, setConnected] = useConnected();
  const [showConnected, setShowConnected] = useState(false);
  useEffect(() => {
    if (!connected) {
      setShowConnected(true);
    } else if (showConnected) {
      const t = setTimeout(() => {
        setShowConnected(false);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [connected]);
  if (!connected)
    return (
      <div
        className={classNames(
          "tw-fixed tw-py-1 tw-w-full tw-z-[10000] tw-bg-gray-400 tw-top-0"
        )}
      >
        <p className="tw-w-fit tw-m-0 tw-p-0 tw-text-xs tw-capitalize tw-mx-auto tw-text-gray-200 ">
          You are offline by the way
        </p>
      </div>
    );
  if (!showConnected) return;
  return (
    <div
      className={classNames(
        "tw-fixed tw-py-1 tw-w-full tw-z-[10000] tw-bg-green-500 tw-top-0"
      )}
    >
      <p className="tw-w-fit tw-m-0 tw-text-xs tw-capitalize tw-mx-auto tw-text-gray-100 ">
        You are online
      </p>
    </div>
  );
}
