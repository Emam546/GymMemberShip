import PhoneInputWithCountry, {
  Props as OrgProps,
} from "react-phone-number-input/react-hook-form";
import { FieldError, FieldValues } from "react-hook-form";
import style from "./style.module.scss";
import classNames from "classnames";
import { WrapElem } from "../styles";
import { ErrorInputShower } from "../main";
import React, { ComponentRef } from "react";
interface Props {
  id: string;
  title: string;
  err?: FieldError;
}
const FInput = React.forwardRef<ComponentRef<"input">>((props, ref) => {
  return (
    <input
      {...props}
      className="form-control"
      type="tel"
      autoComplete="tel"
      ref={ref}
    />
  );
});
function PhoneNumberWithForm<FormValues extends FieldValues>({
  title,
  id,
  err,
  ...props
}: OrgProps<Props, FormValues>) {
  return (
    <WrapElem label={title}>
      <div dir="ltr">
        <PhoneInputWithCountry
          id={id}
          international
          countryCallingCodeEditable={false}
          defaultCountry={
            (process.env.NEXT_PUBLIC_GYM_PHONE_COUNTRY as "EG") ?? "EG"
          }
          country={process.env.NEXT_PUBLIC_GYM_PHONE_COUNTRY ?? "EG"}
          placeholder="Enter phone number"
          inputComponent={FInput}
          className={classNames("form-control", style.phone_number)}
          {...props}
        />
      </div>
      <ErrorInputShower err={err} />
    </WrapElem>
  );
}
export default PhoneNumberWithForm;
