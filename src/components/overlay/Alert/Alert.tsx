import { type PropsWithChildren, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/overlay/Alert/Alert.components";
import useEscapeKey from "@/hooks/useEscapeKey";
import useOutsideClick from "@/hooks/useOutSideClick";
import cn from "@/lib/utils";
interface IProps {
  onClose: () => void;
  layoutClassName?: string;
}

function Alert({ children, onClose, layoutClassName }: PropsWithChildren<IProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref,
    handler: () => {
      onClose();
    },
  });
  useEscapeKey({
    handler: onClose,
  });

  return (
    <AlertDialog open>
      <AlertDialogContent
        ref={ref}
        className={cn(layoutClassName, "flex flex-col justify-between")}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}
Alert.Header = AlertDialogHeader;
Alert.Title = AlertDialogTitle;
Alert.Footer = AlertDialogFooter;
Alert.Action = AlertDialogAction;
Alert.Cancel = AlertDialogCancel;

export default Alert;
