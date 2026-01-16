import { useEffect } from "react";
import { createPortal } from "react-dom";
import Alert from "@/components/overlay/Alert/Alert";

interface LeaveConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function LeaveConfirmModal({ isOpen, onCancel, onConfirm }: Readonly<LeaveConfirmModalProps>) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <Alert
      onClose={onCancel}
      layoutClassName="w-80! md:w-100!"
      footer={
        <Alert.Footer>
          <Alert.Cancel color="grey" onClick={onCancel} className="button-sm lg:button-lg">
            취소
          </Alert.Cancel>
          <Alert.Action color="black" onClick={onConfirm} className="button-sm lg:button-lg">
            나가기
          </Alert.Action>
        </Alert.Footer>
      }
    >
      <div className="flex w-full flex-col gap-2 py-3">
        <span className="text-primary text-md font-semibold lg:text-xl">
          현재 저장되지 않은 폼 내역이 있습니다.
        </span>
        <span className="text-gray-0 text-sm font-medium lg:text-lg">
          저장하지 않고 목록으로 이동하시겠습니까?
        </span>
      </div>
    </Alert>,
    document.body
  );
}

export default LeaveConfirmModal;
