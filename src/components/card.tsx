import { containerClasses } from "@mui/material";
import classNames from "classnames";
import React, { Component, ComponentProps } from "react";
export interface MainCardProps {
  children: React.ReactNode;
}
export interface MainCardProps extends ComponentProps<"div"> {
  containerClassName?: string;
}
export function MainCard({
  children,
  className,
  containerClassName,
  ...props
}: MainCardProps) {
  return (
    <div className={classNames("tw-my-3 card", containerClassName)}>
      <div className={classNames("card-body", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
export function BigCard({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames("tw-flex-1", className)}>{children}</div>;
}
export type CardTitleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;
export function CardTitle({ ...props }: CardTitleProps) {
  return (
    <h5
      className={classNames("card-title fw-semibold tw-mb-2", props.className)}
      {...props}
    />
  );
}
