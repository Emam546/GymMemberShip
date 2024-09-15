import { Snackbar, Button, CircularProgress } from "@mui/material";
import { Alert } from "@mui/material";
import { useDebounceEffect } from "@src/hooks";
import React, { useEffect } from "react";
export interface Props {
  open: boolean;
  message: string;
  setClose: () => any;
  undo: () => any;
  deps?: any[];
  error?: boolean;
  loading?: boolean;
}
export default function DeleteAlert({
  open,
  setClose,
  undo,
  deps = [],
  error,
  loading,
  message,
}: Props) {
  useDebounceEffect(
    () => {
      if (open) setClose();
    },
    4000,
    [open, ...deps]
  );
  return (
    <Snackbar autoHideDuration={6000} open={open}>
      <Alert
        variant="filled"
        severity={error ? "error" : "info"}
        action={
          !error ? (
            <Button color="inherit" size="small" onClick={undo}>
              UNDO
            </Button>
          ) : undefined
        }
        onClose={error ? setClose : undefined}
        className="flex items-center"
      >
        <div className="flex items-center">
          <span>{message}</span>
          {loading && (
            <div className="flex items-center ml-5 overflow-hidden max-w-[2rem] max-h-[2rem]">
              <CircularProgress
                color="inherit"
                className=" text-neutral-5 max-w-[1.3rem] max-h-[1.3rem]"
              />
            </div>
          )}
        </div>
      </Alert>
    </Snackbar>
  );
}
