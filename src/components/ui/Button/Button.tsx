import { type ForwardedRef, forwardRef } from "react";
import type { ResponsiveButtonProps, SimpleButtonProps } from "@/components/ui/Button/Button.types";
import ResponsiveButton from "@/components/ui/Button/ResponsiveButton";
import SimpleButton from "@/components/ui/Button/SimpleButton";

export type ButtonProps = ResponsiveButtonProps | SimpleButtonProps;

function Button({ responsive, ...props }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  if (responsive) {
    return <ResponsiveButton ref={ref} {...(props as ResponsiveButtonProps)} />;
  }
  return <SimpleButton ref={ref} {...(props as SimpleButtonProps)} />;
}

export default forwardRef<HTMLButtonElement, ButtonProps>(Button);
