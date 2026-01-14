import { forwardRef, type ComponentProps, type ComponentRef, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import cn from "@/lib/utils";

function Dialog({ ...props }: Readonly<ComponentProps<typeof DialogPrimitive.Root>>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

Dialog.Trigger = forwardRef<
  ComponentRef<typeof DialogPrimitive.Trigger>,
  Readonly<ComponentProps<typeof DialogPrimitive.Trigger>>
>((props, ref) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" ref={ref} {...props} />;
});
Dialog.Trigger.displayName = DialogPrimitive.Trigger.displayName;

function DialogPortal({ ...props }: Readonly<ComponentProps<typeof DialogPrimitive.Portal>>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

Dialog.Close = forwardRef<
  ComponentRef<typeof DialogPrimitive.Close>,
  Readonly<ComponentProps<typeof DialogPrimitive.Close>>
>((props, ref) => {
  return <DialogPrimitive.Close data-slot="dialog-close" ref={ref} {...props} />;
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
  flexDirection = "col",
  width,
  height,
  ...props
}: Readonly<ComponentProps<typeof DialogPrimitive.Content>> & {
  width?: number;
  flexDirection?: "col" | "row";
  height?: number;
}) {
  const handleOpenAutoFocus = (e: Event) => {
    e.preventDefault();

    const activeElement = document.activeElement;
    const contentElement = e.currentTarget as HTMLElement;

    if (activeElement && contentElement && !contentElement.contains(activeElement)) {
      if (activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }
  };

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <Dialog.Description className="sr-only" />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex w-80! -translate-x-1/2 -translate-y-1/2 gap-6 rounded-3xl bg-white p-5 text-center duration-200 outline-none focus:outline-none md:w-85! lg:w-136! lg:gap-8 lg:p-8",
          flexDirection === "col" ? "flex-col" : "flex-row",
          className
        )}
        style={{
          ...(width && { width }),
          ...(height && { height }),
        }}
        onOpenAutoFocus={handleOpenAutoFocus}
        {...props}
      >
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

function DialogDescription({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={cn(className)} {...props}>
      {children}
    </DialogPrimitive.Description>
  );
}
Dialog.Description = DialogDescription;
DialogDescription.displayName = DialogPrimitive.Description.displayName;

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-row items-center justify-between font-semibold md:text-base lg:text-2xl",
        className
      )}
      {...props}
    />
  );
}
Dialog.Header = DialogHeader;
DialogHeader.displayName = "Dialog.Header";

function DialogFooter({
  className,
  children,
  ...props
}: ComponentProps<"div"> & { children?: ReactNode }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-row items-center md:gap-2 lg:gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

Dialog.Footer = DialogFooter;
DialogFooter.displayName = "Dialog.Footer";

export { Dialog, DialogOverlay, DialogPortal };
