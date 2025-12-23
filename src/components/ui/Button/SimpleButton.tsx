import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { buttonVariants } from "./Button.styles";
import type { SimpleButtonProps } from "./Button.types";
import { ColorName } from "./Button.types";
import cn from "@/lib/utils";

function SimpleButton(
  {
    className,
    variant,
    color = ColorName.PRIMARY,
    disabled,
    asChild = false,
    ...buttonProps
  }: SimpleButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        buttonVariants({
          variant,
          color: disabled ? ColorName.GREY : color,
        }),
        "cursor-pointer",
        className
      )}
      ref={ref}
      disabled={disabled}
      type={buttonProps.type ?? "button"}
      {...buttonProps}
    />
  );
}

export default React.forwardRef<HTMLButtonElement, SimpleButtonProps>(SimpleButton);
