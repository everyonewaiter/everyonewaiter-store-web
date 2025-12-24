import { type PropsWithChildren, useRef, useState } from "react";
import Spinner from "@/components/feedback/Spinner";
import type { ButtonColor } from "@/components/ui/Button/Button.types";
import useEscapeKey from "@/hooks/useEscapeKey";
import useOutsideClick from "@/hooks/useOutSideClick";
import cn from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./primitives";

type Color = ButtonColor | undefined;

interface IProps {
  onClose: () => void;
  hasNoCancel?: boolean;
  hasNoAction?: boolean;
  layoutClassName?: string;
  noResponsive?: boolean;
  disabled?: boolean;
  isSubmitted?: boolean;
  primaryButton: {
    color?: Color;
    text: string;
    onClick: () => void;
    customButtonStyle?: string;
  };
  secondaryButton?: {
    color?: Color;
    text?: string;
    onClick?: () => void;
    customButtonStyle?: string;
  };
}

function Alert({
  children,
  onClose,
  hasNoCancel,
  hasNoAction,
  layoutClassName,
  noResponsive,
  disabled,
  isSubmitted,
  primaryButton,
  secondaryButton,
}: PropsWithChildren<IProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);

  useOutsideClick({
    ref,
    handler: () => {
      onClose();
    },
  });
  useEscapeKey({
    handler: onClose,
  });

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        ref={ref}
        className={cn(layoutClassName, "flex flex-col justify-between")}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div>{children}</div>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!hasNoCancel && (
            <AlertDialogCancel
              color={secondaryButton?.color || "grey"}
              onClick={secondaryButton?.onClick || handleClose}
              className="flex-[0.6]"
              hasNoAction={hasNoAction}
              noResponsive={noResponsive}
              customButtonStyle={secondaryButton?.customButtonStyle || ""}
              disabled={isSubmitted}
            >
              <span>{secondaryButton?.text || "닫기"}</span>
            </AlertDialogCancel>
          )}
          {!hasNoAction && (
            <AlertDialogAction
              noResponsive={noResponsive}
              className="flex-1"
              disabled={disabled || isSubmitted}
              color={(primaryButton.color as Color) || "primary"}
              {...primaryButton}
              customButtonStyle={primaryButton.customButtonStyle || ""}
            >
              {isSubmitted ? <Spinner /> : <span>{primaryButton.text}</span>}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Alert;
