import { type PropsWithChildren, type ReactNode } from "react";
import { Dialog } from "@/components/overlay/Dialog";
import Button from "@/components/ui/Button/Button";
import type { ButtonProps } from "@/components/ui/Button/Button";
import cn from "@/lib/utils";
import type { ModalProps } from "@/types/overlay";

interface AlertProps extends ModalProps {
  layoutClassName?: string;
  footer?: ReactNode;
}

function Alert({
  children,
  close,
  isOpen,
  layoutClassName,
  footer,
}: PropsWithChildren<AlertProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <Dialog.Wrapper className={layoutClassName}>
        <Dialog.Title className="center h-20! lg:h-25!">{children}</Dialog.Title>
        <Dialog.Description className="sr-only" />
        {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default Alert;

function AlertCancel({ children, ...props }: Readonly<PropsWithChildren<ButtonProps>>) {
  return (
    <div className="flex-1">
      <Dialog.Close asChild>
        <Button
          color={props.color || "grey"}
          className={cn("lg:button-lg button-sm w-full", props.className)}
          {...props}
        >
          {children ?? "닫기"}
        </Button>
      </Dialog.Close>
    </div>
  );
}
AlertCancel.displayName = "Alert.Cancel";
Alert.Cancel = AlertCancel;

function AlertAction({ children, ...props }: Readonly<PropsWithChildren<ButtonProps>>) {
  return (
    <div className="flex-1">
      <Button
        color={props.color || "primary"}
        className={cn("lg:button-lg button-sm w-full", props.className)}
        {...props}
      >
        {children ?? "확인"}
      </Button>
    </div>
  );
}
AlertAction.displayName = "Alert.Action";
Alert.Action = AlertAction;
