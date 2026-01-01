import { forwardRef, type ComponentProps, type ComponentRef, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Button from "@/components/ui/Button/Button";
import type { ButtonColor, ButtonSize } from "@/components/ui/Button/Button.types";
import cn from "@/lib/utils";

function Dialog({ ...props }: Readonly<ComponentProps<typeof DialogPrimitive.Root>>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

Dialog.Trigger = forwardRef<
  ComponentRef<typeof DialogPrimitive.Trigger>,
  ComponentProps<typeof DialogPrimitive.Trigger>
>((props, ref) => {
  return <DialogPrimitive.Trigger ref={ref} data-slot="dialog-trigger" {...props} />;
});
Dialog.Trigger.displayName = DialogPrimitive.Trigger.displayName;

function DialogPortal({ ...props }: Readonly<ComponentProps<typeof DialogPrimitive.Portal>>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

Dialog.Close = forwardRef<
  ComponentRef<typeof DialogPrimitive.Close>,
  ComponentProps<typeof DialogPrimitive.Close>
>((props, ref) => {
  return (
    <DialogPrimitive.Close
      ref={ref}
      data-slot="dialog-close"
      className={cn("h-fit w-fit", props.className)}
      {...props}
    />
  );
});
Dialog.Close.displayName = DialogPrimitive.Close.displayName;

function DialogOverlay({
  className,
  ...props
}: Readonly<ComponentProps<typeof DialogPrimitive.Overlay>>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40",
        className
      )}
      {...props}
    />
  );
}

function DialogWrapper({
  className,
  children,
  gap,
  flexDirection = "col",
  width,
  height,
  title,
  ...props
}: Readonly<ComponentProps<typeof DialogPrimitive.Content>> & {
  gap?: number;
  width?: number;
  flexDirection?: "col" | "row";
  height?: number;
  title?: ReactNode;
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        aria-describedby={title ? "dialog-title" : undefined}
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white duration-200 outline-none focus:outline-none md:p-8",
          flexDirection === "col" ? "flex-col" : "flex-row",
          className
        )}
        style={{
          gap: gap || 32,
          ...(width && { width }),
          ...(height && { height }),
        }}
        {...props}
      >
        <Dialog.Title className={title ? "" : "hidden"}>{title}</Dialog.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}
Dialog.Wrapper = DialogWrapper;
DialogWrapper.displayName = "Dialog.Wrapper";

function DialogTitle({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn(className)} {...props}>
      {children}
    </DialogPrimitive.Title>
  );
}
Dialog.Title = DialogTitle;
DialogTitle.displayName = DialogPrimitive.Title.displayName;

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-row items-center justify-between text-2xl font-semibold", className)}
      {...props}
    />
  );
}
Dialog.Header = DialogHeader;
DialogHeader.displayName = "Dialog.Header";

function DialogFooter({
  className,
  children,
  layout = "balanced",
  buttonClassName,
  primaryButton,
  secondaryButton,
  buttonSize = "lg",
  ...props
}: ComponentProps<"div"> & {
  children?: ReactNode;
  layout?: "balanced" | "unbalanced";
  buttonClassName?: string;
  primaryButton?: {
    color?: ButtonColor;
    className?: string;
    text?: string;
    onClick?: () => void;
    hide?: boolean;
    disabled?: boolean;
  };
  secondaryButton?: {
    disabled?: boolean;
    color?: ButtonColor;
    className?: string;
    text?: string;
    onClick?: () => void;
    hide?: boolean;
  };
  buttonSize?: ButtonSize;
}) {
  const getButtonSize = () => `button-${buttonSize}`;

  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-row items-center gap-3", className)}
      {...props}
    >
      {children || (
        <>
          {secondaryButton?.hide ? null : (
            <Dialog.Close asChild>
              <Button
                color={secondaryButton?.color ?? "grey"}
                className={cn(
                  getButtonSize(),
                  layout === "balanced" ? "w-full" : "w-30",
                  buttonClassName,
                  secondaryButton?.className ?? ""
                )}
                {...secondaryButton}
              >
                {secondaryButton?.text ?? "닫기"}
              </Button>
            </Dialog.Close>
          )}
          {primaryButton?.hide ? null : (
            <Button
              color={primaryButton?.color ?? "black"}
              className={cn(getButtonSize(), "w-full", primaryButton?.className ?? "")}
              {...primaryButton}
            >
              {primaryButton?.text ?? "확인"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

Dialog.Footer = DialogFooter;
DialogFooter.displayName = "Dialog.Footer";

export { Dialog, DialogOverlay, DialogPortal };
