import { forwardRef, type ForwardedRef } from "react";
import ResponsiveButton from "./ResponsiveButton";
import SimpleButton from "./SimpleButton";
import type { ResponsiveButtonProps, SimpleButtonProps } from "./Button.types";

export type ButtonProps = ResponsiveButtonProps | SimpleButtonProps;

function Button({ responsive, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  if (responsive) {
    return <ResponsiveButton ref={ref} {...(props as ResponsiveButtonProps)} />;
  }
  return <SimpleButton ref={ref} {...(props as SimpleButtonProps)} />;
}

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
