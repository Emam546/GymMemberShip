import style from "./style.module.scss";
import React, {
  ComponentProps,
  ComponentRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import classNames from "classnames";
import { isElectron } from "@utils/electron";
import { ClassNames } from "@emotion/react";
export function BaseButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={classNames(
        "tw-duration-100 tw-p-0 tw-py-1 tw-bg-transparent tw-border-none tw-px-3 tw-text-gray-300",
        className
      )}
      {...props}
    />
  );
}
const Frame = React.forwardRef<ComponentRef<"div">, ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => {
    const [title, setTitle] = useState("");
    const [maximizeState, setMaximizeState] = useState(true);
    useEffect(() => {
      const titleElem = document.querySelector("title");
      if (!titleElem) return;
      new MutationObserver(function () {
        setTitle(document.title);
      }).observe(titleElem, {
        subtree: true,
        characterData: true,
        childList: true,
      });
    }, []);
    useEffect(() => {
      return window.api?.on("onToggleWindowState", (e, state) => {
        setMaximizeState(state);
      });
    }, []);
    return (
      <div
        dir="ltr"
        ref={ref}
        {...props}
        className={classNames(
          "tw-items-center tw-justify-between tw-max-w-full tw-bg-black/70 tw-flex tw-frame-drag",
          style["frame-drag"]
        )}
      >
        <div className="tw-flex tw-items-center tw-flex-1 tw-px-1 tw-gap-x-2">
          <img src={`/images/app/app_icon`} className="tw-w-5" alt="Image" />
          {/* <p className="tw-max-w-xs tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap">
            {title}
          </p> */}
        </div>
        <div className="tw-flex">
          <div>{children}</div>
          <div className="tw-flex tw-justify-end">
            <BaseButton
              title="Minimize"
              type="button"
              className="hover:tw-bg-gray-200/40"
              onClick={() => {
                window.api.send("minimizeWindow");
              }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </BaseButton>
            <BaseButton
              type="button"
              className="enabled:hover:tw-bg-gray-200/30"
              onClick={() => {
                window.api.send("ToggleWindowMaximizeState");
              }}
            >
              <FontAwesomeIcon icon={faSquare} />
            </BaseButton>
            <BaseButton
              title="Close"
              type="button"
              className="hover:tw-bg-red-600 hover:tw-text-white"
              onClick={() => {
                window.api.send("closeWindow");
              }}
            >
              <FontAwesomeIcon className="text-xl" icon={faXmark} />
            </BaseButton>
          </div>
        </div>
      </div>
    );
  }
);
export function FrameProvider({ children }: { children: React.ReactNode }) {
  const [frame, setFrame] = useState<HTMLElement | null>(null);
  const [state, setState] = useState(process.env.NEXT_PUBLIC_ENV == "desktop");
  const [parent, setParent] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!frame || !parent) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      if (!parent) return;
      parent.style.paddingTop = `${height}px`;
    });
    parent.style.paddingTop = `${frame.offsetHeight}px`;
    resizeObserver.observe(frame);
    return () => resizeObserver.disconnect();
  }, [parent, frame]);
  useEffect(() => {
    setState(isElectron());
  }, []);
  if (!state)
    return (
      <div className="tw-flex tw-flex-1 tw-h-full tw-items-stretch">
        {children}
      </div>
    );

  return (
    <div>
      <div
        className="tw-fixed tw-top-0 tw-w-full tw-left-0 tw-z-[1000]"
        ref={setFrame}
      >
        <Frame />
      </div>
      <div ref={setParent} className="tw-h-screen tw-flex tw-items-stretch">
        <div
          className={classNames(
            "tw-overflow-auto tw-flex-1 tw-flex tw-h-full tw-items-stretch",
            style["scrollBar"]
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
