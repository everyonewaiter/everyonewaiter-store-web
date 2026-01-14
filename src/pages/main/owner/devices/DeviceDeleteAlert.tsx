import Alert from "@/components/overlay/Alert";
import type { Device } from "@/types/domain/device";
import type { ModalProps } from "@/types/overlay";

interface DeviceDeleteModalProps extends ModalProps {
  deleteItem: Device[];
}

function DeviceDeleteModal({ deleteItem, ...props }: Readonly<DeviceDeleteModalProps>) {
  const renderText = () => {
    if (deleteItem.length === 1) {
      return `을`;
    }
    return ` 외 ${deleteItem.length - 1}개의 기기를`;
  };

  const handleDelete = () => {
    // TODO: 삭제 로직 추가
  };

  return (
    <Alert
      {...props}
      footer={
        <>
          <Alert.Cancel>닫기</Alert.Cancel>
          {deleteItem.length > 0 && <Alert.Action onClick={handleDelete}>삭제</Alert.Action>}
        </>
      }
    >
      <strong className="text-gray-0 font-semibold md:text-base md:whitespace-pre-line lg:text-xl lg:whitespace-normal">
        {deleteItem.length ? (
          <>
            <span className="text-primary">{deleteItem[0].name}</span>
            {`${renderText()}\n삭제하시겠습니까?`}
          </>
        ) : (
          "선택한 기기가 없습니다."
        )}
      </strong>
    </Alert>
  );
}

export default DeviceDeleteModal;
