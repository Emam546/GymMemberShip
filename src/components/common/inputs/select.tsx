import React from "react";
import { StyledSelect } from "./styles";
import { ErrorInputShower } from "./main";
import { FieldError } from "react-hook-form";
export type Props = {
    id: string;
    title: string;
    err?: FieldError;
    desc?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const SelectInput = React.forwardRef<HTMLSelectElement, Props>(function (
    { id, title, err, desc, ...props },
    ref
) {
    return (
        <div>
            <label
                htmlFor={id}
                className="form-label"
            >
                {title}
            </label>
            <StyledSelect
                id={id}
                {...props}
                ref={ref}
            />
            {desc && <div className="form-text">{desc}</div>}
            <ErrorInputShower err={err} />
        </div>
    );
});
export default SelectInput;
