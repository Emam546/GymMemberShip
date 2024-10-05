import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
export function CopyText({ text, children }: { text: string; children: ReactNode }) {
  const [copiedState, setCopiedState] = useState(false);
  const [copyState, setCopyState] = useState(false);
  return (
    <Tooltip
      title={copiedState ? "Copied" : "Copy"}
      disableInteractive
      disableFocusListener={copiedState}
      disableTouchListener={copiedState}
      open={copyState || copiedState}
      onOpen={() => {
        if (!copiedState) setCopyState(true);
      }}
      onClose={() => {
        setCopyState(false);
        setCopiedState(false);
      }}
      enterDelay={500}
      color={copiedState ? "success" : undefined}
    >
      <button
        type="button"
        onClick={() => {
          setCopiedState(true);
          setCopyState(false);
          navigator.clipboard.writeText(text);
        }}
        className="tw-p-0 tw-m-0 tw-bg-inherit tw-border-none tw-text-gray-400 hover:tw-text-gray-300 focus:tw-text-gray-300"
      >
        {children}
      </button>
    </Tooltip>
  );
}
