import type { ComponentProps } from "react";
import { type VariantProps } from "class-variance-authority";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";
import cn from "@/lib/utils";
import { inputGroupAddonVariants, inputGroupButtonVariants } from "./InputGroup.styles";
import type { ResponsiveButtonProps } from "../Button/Button.types";

/**
 *
 * @example
 * <InputGroup>
 *  <InputGroupInput placeholder="Search..." />
 *  <InputGroupAddon>
 *    <SearchIcon />
 *  </InputGroupAddon>
 *  <InputGroupAddon align="inline-end">
 *    <InputGroupButton>Search</InputGroupButton>
 *  </InputGroupAddon>
 * </InputGroup>
 */
function InputGroup({ className, ...props }: Readonly<ComponentProps<"fieldset">>) {
  return (
    <fieldset
      data-slot="input-group"
      className={cn(
        "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
        "h-9 min-w-0 has-[>textarea]:h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",

        className
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  className,
  align = "inline-start",
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  ...props
}: Readonly<ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      role="button"
      tabIndex={0}
      aria-label="Focus input field"
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          onClickProp?.(e);
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
        onClickProp?.(e);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          if ((e.target as HTMLElement).closest("button")) {
            onKeyDownProp?.(e);
            return;
          }
          e.currentTarget.parentElement?.querySelector("input")?.focus();
          e.preventDefault();
        }
        onKeyDownProp?.(e);
      }}
      {...props}
    />
  );
}
InputGroupAddon.displayName = "InputGroup.Addon";
InputGroup.Addon = InputGroupAddon;

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<ResponsiveButtonProps, "size"> & VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}
InputGroupButton.displayName = "InputGroup.Button";
InputGroup.Button = InputGroupButton;

function InputGroupText({ className, ...props }: Readonly<ComponentProps<"span">>) {
  return (
    <span
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}
InputGroupText.displayName = "InputGroup.Text";
InputGroup.Text = InputGroupText;

function InputGroupInput({
  className,
  ...props
}: Readonly<Omit<ComponentProps<"input">, "prefix">>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  );
}
InputGroupInput.displayName = "InputGroup.Input";
InputGroup.Input = InputGroupInput;

function InputGroupTextarea({ className, ...props }: Readonly<ComponentProps<"textarea">>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  );
}
InputGroupTextarea.displayName = "InputGroup.Textarea";
InputGroup.Textarea = InputGroupTextarea;

export default InputGroup;
