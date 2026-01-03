import { type PropsWithChildren, type ReactNode } from "react";
import { Dialog } from "@/components/overlay/Dialog";
import Button from "@/components/ui/Button/Button";
import type { ButtonProps } from "@/components/ui/Button/Button";
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
        <Dialog.Footer>{footer}</Dialog.Footer>
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default Alert;

function AlertCancel({ children, ...props }: Readonly<PropsWithChildren<ButtonProps>>) {
  return (
    <Dialog.Close asChild>
      <Button
        color={props.color || "grey"}
        responsive
        responsiveButtons={{
          lg: { buttonSize: "lg", className: "w-full" },
          md: { buttonSize: "sm", className: "w-full" },
          sm: { buttonSize: "sm", className: "w-full" },
        }}
        {...props}
      >
        {children ?? "닫기"}
      </Button>
    </Dialog.Close>
  );
}
AlertCancel.displayName = "Alert.Cancel";
Alert.Cancel = AlertCancel;

function AlertAction({ children, ...props }: Readonly<PropsWithChildren<ButtonProps>>) {
  return (
    <Button
      color={props.color || "primary"}
      responsive
      responsiveButtons={{
        lg: { buttonSize: "lg", className: "w-full" },
        md: { buttonSize: "sm", className: "w-full" },
        sm: { buttonSize: "sm", className: "w-full" },
      }}
      {...props}
    >
      {children ?? "확인"}
    </Button>
  );
}
AlertAction.displayName = "Alert.Action";
Alert.Action = AlertAction;
