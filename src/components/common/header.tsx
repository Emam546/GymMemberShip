import {
  ComponentProps,
  ComponentRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faRotateRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import React from "react";
import { useSyncRefs } from "@src/hooks";
import { assertIsNode } from "@src/utils";
import { CircularProgress } from "@mui/material";
import { ButtonToolTip, Props as ButtonToolTipProps } from "./buttonToolTip";

function CustomButton({
  editable,
  ...props
}: ButtonToolTipProps & { editable: boolean }) {
  return (
    <ButtonToolTip
      type="button"
      {...props}
      className={classNames(
        "hover:tw-text-blue-500 tw-text-neutral-300 group-hover/header:tw-visible tw-p-2 tw-mx-1 tw-border-none tw-bg-inherit",
        {
          "lg:tw-invisible": !editable,
        },
        props.className
      )}
    >
      {props.children}
    </ButtonToolTip>
  );
}
export interface Props extends ComponentProps<"input"> {
  reset?: () => void;
  setDelete?: () => void;
  loading?: boolean;
}

const Header = React.forwardRef<ComponentRef<"input">, Props>(
  ({ value, reset, setDelete, loading, ...props }, ref) => {
    const [editable, setEditable] = useState(false);
    const input = useRef<HTMLInputElement>(null);
    const containerDiv = useRef<HTMLDivElement>(null);
    const [textValue, setValue] = useState(value as string);
    useEffect(() => {
      if (!input.current) return;
      function Listener(e: MouseEvent) {
        if (!input.current) return;
        if (!e.target) return;
        assertIsNode(e.target);
        if (containerDiv.current && !containerDiv.current.contains(e.target)) {
          setEditable(false);
        }
      }
      window.addEventListener("click", Listener);
      return () => {
        window.removeEventListener("click", Listener);
      };
    }, [input]);
    const allRef = useSyncRefs<HTMLInputElement>(input, ref);

    return (
      <div
        ref={containerDiv}
        className="tw-text-lg tw-my-3 tw-group/header tw-w-fit"
      >
        <div
          className="tw-self-start tw-inline-block tw-text-neutral-900"
          onClick={() => {
            input.current?.focus();
          }}
        >
          <h2
            className={classNames(
              { "tw-hidden": editable },
              "tw-font-bold tw-text-lg tw-p-0 tw-m-0 tw-leading-normal"
            )}
          >
            {textValue}
          </h2>
          <div
            onClick={() => {
              if (!input.current) return;
              input.current.focus();
            }}
            className={classNames(
              "after:tw-invisible tw-p-0 tw-relative tw-leading-normal after:tw-content-[attr(data-value)] tw-min-w-[5rem] tw-w-fit tw-min-h-[1rem] tw-font-bold tw-h-fit",
              { "tw-hidden": !editable }
            )}
            data-value={textValue || "a"}
          >
            <input
              placeholder="Untitled"
              type="text"
              {...props}
              value={textValue}
              ref={allRef}
              className={classNames(
                "focus:tw-outline-none tw-p-0 tw-top-0 tw-left-0 tw-absolute tw-font-bold tw-border-0 tw-border-b-2 tw-border-blue-500 tw-border-solid tw-w-full tw-max-w-full",
                props.className
              )}
              onChange={(e) => {
                if (props.onChange) props.onChange(e);
                setValue(e.currentTarget.value);
              }}
            />
          </div>
        </div>
        <CustomButton
          editable={editable}
          type="button"
          onClick={() => {
            setEditable(true);
            if (!input.current) return;
            input.current.focus();
          }}
          aria-label="edit header"
          toolTip="edit"
        >
          <FontAwesomeIcon icon={faPen} />
        </CustomButton>
        {reset && !textValue?.length && (
          <CustomButton
            editable={editable}
            type="button"
            onClick={() => reset()}
            className="font-bold"
            aria-label="reset header"
            toolTip="reset"
          >
            <FontAwesomeIcon icon={faRotateRight} />
          </CustomButton>
        )}

        {setDelete && (
          <CustomButton
            editable={false}
            type="button"
            onClick={() => setDelete()}
            className="font-bold"
            aria-label="delete section"
            toolTip="delete section"
          >
            <FontAwesomeIcon icon={faTrash} />
          </CustomButton>
        )}
        {loading && (
          <span
            className={classNames(
              "hover:tw-text-blue-500 tw-text-neutral-300 tw-group-hover:tw-visible tw-p-2 tw-mx-1"
            )}
          >
            <CircularProgress className="max-w-[1.2rem] max-h-[1.2rem]" />
          </span>
        )}
      </div>
    );
  }
);
export default Header;
