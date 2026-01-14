import Alert from "@/components/overlay/Alert/Alert";
import type { Menu } from "@/types/domain/menu";
import type { ModalProps } from "@/types/overlay";

interface MenuDeleteAlertProps extends ModalProps {
  deleteItems: Menu[];
}

function MenuDeleteAlert({ deleteItems, ...props }: Readonly<MenuDeleteAlertProps>) {
  const renderText = () => {
    if (deleteItems?.length === 1) {
      return `을`;
    }
    return ` 외 ${deleteItems?.length - 1}개의 메뉴를`;
  };

  const handleConfirm = () => {
    // TODO: 메뉴 삭제 로직 구현
  };

  return (
    <Alert
      {...props}
      footer={
        <>
          <Alert.Cancel onClick={close}>닫기</Alert.Cancel>
          {deleteItems?.length > 0 && <Alert.Action onClick={handleConfirm}>삭제</Alert.Action>}
        </>
      }
    >
      <strong className="text-gray-0 font-semibold md:text-base md:whitespace-pre-line lg:text-xl lg:whitespace-normal">
        {deleteItems?.length ? (
          <>
            <span className="text-primary">{deleteItems[0].name}</span>
            {`${renderText()}\n삭제하시겠습니까?`}
          </>
        ) : (
          "선택한 기기가 없습니다."
        )}
      </strong>
    </Alert>
  );
}

export default MenuDeleteAlert;
