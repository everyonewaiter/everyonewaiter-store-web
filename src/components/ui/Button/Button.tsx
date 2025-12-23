import * as React from "react";
import type { ResponsiveButtonProps, SimpleButtonProps } from "./Button.types";
import ResponsiveButton from "./ResponsiveButton";
import SimpleButton from "./SimpleButton";

export type ButtonProps = ResponsiveButtonProps | SimpleButtonProps;

function Button({ responsive, ...props }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  if (responsive) {
    return <ResponsiveButton ref={ref} {...(props as ResponsiveButtonProps)} />;
  } else {
    return <SimpleButton ref={ref} {...(props as SimpleButtonProps)} />;
  }
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>(Button);
