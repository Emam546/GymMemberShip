import React, { ComponentPropsWithRef, ComponentRef } from "react";
import { StyledSelect } from "./styles";
import { ErrorInputShower } from "./main";
import { FieldError } from "react-hook-form";
export interface Props extends ComponentPropsWithRef<"select"> {
  id: string;
  title: string;
  err?: FieldError;
  desc?: string;
}

const SelectInput = React.forwardRef<ComponentRef<"select">, Props>(function (
  { id, title, err, desc, ...props },
  ref
) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {title}
      </label>
      <StyledSelect id={id} {...props} ref={ref} />
      {desc && <div className="form-text">{desc}</div>}
      <ErrorInputShower err={err} />
    </div>
  );
});
export default SelectInput;
