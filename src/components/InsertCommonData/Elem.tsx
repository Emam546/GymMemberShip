import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSyncRefs } from "@src/hooks";
import classNames from "classnames";
import { Component, ComponentRef, useEffect, useRef, useState } from "react";
import DraggableComp from "@src/components/common/drag";
import React from "react";
import { PrimaryProps } from "./EleGen";
import { CircularProgress } from "@mui/material";
import { DeleteButton } from "../common/deleteButton";
export interface ElemProps extends PrimaryProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}
export const Elem = React.forwardRef<HTMLDivElement, ElemProps>(
  (
    {
      onDelete: deleteSelf,
      onDragOver,
      onDrag,
      onDragStart,
      children,
      noDragging,
      loading,
    },
    ref
  ) => {
    const [drag, setDrag] = useState(false);
    const [parentDiv, setParentDiv] = useState<HTMLDivElement | null>(null);
    const allRefs = useSyncRefs(
      setParentDiv as React.RefCallback<HTMLDivElement>,
      ref
    );
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
                <DeleteButton
                  onClick={() => {
                    if (parentDiv) deleteSelf.call(parentDiv);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { faClone } from "@fortawesome/free-regular-svg-icons";

import { ButtonToolTip } from "@src/components/common/buttonToolTip";
import { assertIsNode } from "@src/utils";

export interface DraggableItem extends PrimaryProps {
  children: React.ReactNode;
  headLabel: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}
export const DropDownElem = React.forwardRef<HTMLDivElement, DraggableItem>(
  (
    {
      onDelete: deleteSelf,
      onDragOver,
      onDrag,
      onDragStart,
      headLabel,
      children,
      noDragging,
      onDuplicate: duplicate,
      disabled,
      loading,
    },
    ref
  ) => {
    const [expand, setExpand] = useState(false);
    const [drag, setDrag] = useState(false);
    const [parentDiv, setParentDiv] = useState<HTMLDivElement | null>(null);
    const allRefs = useSyncRefs(
      setParentDiv as React.RefCallback<HTMLDivElement>,
      ref
    );
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      setExpand(false);
    }, [loading]);
    useEffect(() => {
      if (!containerRef.current) return;
      if (drag)
        containerRef.current.style.height = `${parentDiv?.clientHeight}px`;
      else containerRef.current.style.height = `fit-content`;
    }, [drag]);
    const headerRef = useRef<ComponentRef<"div">>(null);
    const parentRef = useRef<ComponentRef<"div">>(null);

    useEffect(() => {
      if (!headerRef.current) return;
      function Listener(e: MouseEvent) {
        if (!e.target) return;
        assertIsNode(e.target);
        if (
          headerRef.current &&
          headerRef.current.contains(e.target) &&
          !parentRef.current?.contains(e.target)
        ) {
          setExpand((pre) => !pre);
        }
      }
      window.addEventListener("click", Listener);
      return () => {
        window.removeEventListener("click", Listener);
      };
    }, [headerRef, parentRef]);
    return (
      <div
        ref={containerRef}
        className={classNames({
          "tw-border-2 tw-border-dashed tw-border-black/30 tw-rounded-lg": drag,
        })}
      >
        <div
          ref={allRefs}
          className={classNames(
            "tw-border tw-rounded-lg tw-border-solid tw-border-neutral-200 tw-py-1 tw-transition-[height]",
            {
              "tw-fixed tw-z-50 tw-bg-neutral-5": drag,
              static: !drag,
            }
          )}
        >
          <div className="tw-h-16 tw-px-3 tw-cursor-pointer tw-flex tw-justify-between tw-items-ctw-enter tw-relative tw-group">
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

            <div
              className="tw-flex tw-items-center tw-self-stretch tw-flex-grow tw-min-w-max"
              ref={headerRef}
            >
              <div className="tw-w-fit" ref={parentRef}>
                {headLabel}
              </div>
            </div>
            <div className="tw-flex tw-items-center tw-select-none tw-gap-x-3">
              {loading && (
                <span aria-label="delete">
                  <CircularProgress className="tw-max-w-[1.2rem] tw-max-h-[1.2rem]" />
                </span>
              )}
              {duplicate && (
                <ButtonToolTip
                  type="button"
                  className="tw-border-none tw-bg-inherit enabled:tw-group-hover:tw-text-blue-600 disabled:tw-text-neutral-600"
                  onClick={() => {
                    if (parentDiv) duplicate.call(parentDiv);
                  }}
                  aria-label="duplicate"
                  disabled={disabled}
                  toolTip="Duplicate"
                >
                  <FontAwesomeIcon icon={faClone} />
                </ButtonToolTip>
              )}

              {deleteSelf && (
                <ButtonToolTip
                  type="button"
                  className="tw-border-none tw-bg-inherit hover:tw-text-red-600 disabled:tw-text-neutral-600"
                  onClick={() => {
                    if (parentDiv) deleteSelf.call(parentDiv);
                    setExpand(false);
                  }}
                  aria-label="delete"
                  toolTip="Delete"
                  disabled={disabled}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </ButtonToolTip>
              )}

              <button
                type="button"
                className="tw-border-none tw-bg-inherit group-hover:tw-text-blue-600"
                onClick={() => setExpand(!expand)}
                aria-label={expand ? "expand" : "close"}
                disabled={disabled}
              >
                <FontAwesomeIcon icon={expand ? faChevronUp : faChevronDown} />
              </button>
            </div>
          </div>

          <div
            className={classNames("tw-px-3", {
              "tw-max-h-[100000rem]": expand && !drag,
              "tw-max-h-0 overflow-hidden": !expand || drag,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
