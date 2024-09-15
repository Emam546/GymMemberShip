import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSyncRefs } from "@src/hooks";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import DraggableComp from "@src/components/common/drag";
import React from "react";
import { PrimaryProps } from "./EleGen";
import { CircularProgress } from "@mui/material";

export interface DraggableItem extends PrimaryProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}
export const Elem = React.forwardRef<HTMLDivElement, DraggableItem>(
  (
    {
      onDelete: deleteSelf,
      onDragOver,
      onDrag,
      onDragStart,
      children,
      noDragging,
      disabled,
      loading,
    },
    ref
  ) => {
    const [drag, setDrag] = useState(false);
    const [parentDiv, setParentDiv] = useState<HTMLDivElement | null>(null);
    const allRefs = useSyncRefs(setParentDiv, ref);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!containerRef.current) return;
      if (drag)
        containerRef.current.style.height = `${parentDiv?.clientHeight}px`;
      else containerRef.current.style.height = `fit-content`;
    }, [drag]);
    return (
      <div
        ref={containerRef}
        className={classNames({
          "tw-border-2 tw-border-dashed tw-border-black/30 tw-p-3": drag,
        })}
      >
        <div
          ref={allRefs}
          className={classNames(
            {
              "tw-fixed tw-z-50 tw-flex-1": drag,
              static: !drag,
            },
            "tw-flex-1"
          )}
        >
          <div className="tw-relative tw-cursor-pointer tw-flex tw-items-center tw-justify-between tw-gap-x-3">
            {!noDragging && (
              <DraggableComp
                onDragStart={() => {
                  setDrag(true);
                  if (onDragStart && parentDiv) onDragStart(parentDiv);
                }}
                onDragOver={() => {
                  setDrag(false);
                  if (onDragOver && parentDiv) onDragOver(parentDiv);
                }}
                onDrag={function (ev) {
                  if (onDrag && parentDiv) onDrag.call(parentDiv, ev);
                }}
                parentDiv={parentDiv}
              />
            )}

            <div className="tw-flex-1">{children}</div>
            <div className="tw-flex tw-items-center tw-gap-x-3 tw-select-none">
              {loading && (
                <span aria-label="delete">
                  <CircularProgress className="max-w-[1.2rem] max-h-[1.2rem]" />
                </span>
              )}
              {deleteSelf && (
                <button
                  type="button"
                  className="hover:tw-text-red-600 disabled:tw-text-neutral-600 tw-border-0 tw-bg-transparent"
                  onClick={() => {
                    if (parentDiv) deleteSelf.call(parentDiv);
                  }}
                  aria-label="delete"
                  disabled={disabled}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
