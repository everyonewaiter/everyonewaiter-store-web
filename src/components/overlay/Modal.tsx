import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Close } from "@/components/icons";
import { Dialog } from "@/components/overlay/Dialog";

interface ModalProps extends ComponentProps<typeof Dialog> {
  wrapperProps?: ComponentProps<typeof Dialog.Wrapper>;
  footerContent?: {
    action?: ReactNode;
    cancel?: ReactNode;
  };
  title?: ReactNode;
  hasCloseIcon?: boolean;
}

function Modal({
  children,
  footerContent,
  title,
  hasCloseIcon = true,
  ...props
}: Readonly<PropsWithChildren<ModalProps>>) {
  return (
    <Dialog {...props}>
      <Dialog.Wrapper className="flex h-125 w-80 flex-col gap-6 rounded-[20px] px-4 py-5 md:h-125 md:w-91 md:gap-6 md:p-5 lg:h-185 lg:w-135 lg:gap-8 lg:p-8">
        {(title || hasCloseIcon) && (
          <Dialog.Header className="flex items-center justify-between">
            {title && (
              <Dialog.Title className="text-gray-0 font-semibold md:text-base lg:text-2xl">
                {title}
              </Dialog.Title>
            )}
            {hasCloseIcon && (
              <Dialog.Close asChild className="cursor-pointer">
                <Close className="md:size-6 lg:size-8" />
              </Dialog.Close>
            )}
          </Dialog.Header>
        )}
        <div className="hide-scrollbar flex flex-1 flex-col overflow-y-auto">{children}</div>
        {/* 불필요한 Spacing(gap) 방지를 위해 조건 분리함 */}
        {footerContent?.action && footerContent?.cancel ? (
          <Dialog.Footer className="flex items-center gap-2 lg:gap-3">
            {footerContent.action}
            {footerContent.cancel && <>{footerContent.cancel}</>}
          </Dialog.Footer>
        ) : (
          <>
            {footerContent?.action}
            {footerContent?.cancel}
          </>
        )}
      </Dialog.Wrapper>
    </Dialog>
  );
}

export default Modal;
