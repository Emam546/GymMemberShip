import { Tooltip } from "@mui/material";
import React from "react";
export type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  toolTip?: React.ReactNode;
};
export const ButtonToolTip = React.forwardRef<HTMLButtonElement, Props>(
  ({ toolTip, ...props }, ref) => {
    return (
      <Tooltip
        title={toolTip}
        disableInteractive
        disableFocusListener
        enterDelay={300}
      >
        <button {...props} ref={ref} />
      </Tooltip>
    );
  }
);
