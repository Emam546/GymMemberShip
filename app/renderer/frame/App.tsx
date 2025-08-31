import style from "./style.module.scss";
import React, {
  ComponentProps,
  ComponentRef,
  useEffect,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import classNames from "classnames";
export function BaseButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={classNames(
        "duration-100 p-0 py-1 bg-transparent border-none px-3 text-gray-300",
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
          "items-center justify-between w-full bg-black/70 flex frame-drag h-full absolute top-0 left-0",
          style["frame-drag"]
        )}
      >
        <div className="flex items-center flex-1 px-1 gap-x-2">
          <img src={window.context.icon_link} className="w-5" alt={window.context.icon_link} />
          {/* <p className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </p> */}
        </div>
        <div className="flex">
          <div>{children}</div>
          <div className="flex justify-end">
            <BaseButton
              title="Minimize"
              type="button"
              className="hover:bg-gray-200/40"
              onClick={() => {
                window.api.send("minimizeWindow");
              }}
            >
              <FontAwesomeIcon icon={faMinus} />
            </BaseButton>
            <BaseButton
              type="button"
              className="enabled:hover:bg-gray-200/30"
              onClick={() => {
                window.api.send("ToggleWindowMaximizeState");
              }}
            >
              <FontAwesomeIcon icon={faSquare} />
            </BaseButton>
            <BaseButton
              title="Close"
              type="button"
              className="hover:bg-red-600 hover:text-white"
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
export default Frame;
