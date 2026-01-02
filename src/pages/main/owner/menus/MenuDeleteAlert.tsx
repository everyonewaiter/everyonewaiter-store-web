import Alert from "@/components/overlay/Alert/Alert";
import type { AlertProps } from "@/types/overlay";

function MenuDeleteAlert({ close }: Readonly<Pick<AlertProps, "close">>) {
  const handleConfirm = () => {
    // TODO: 메뉴 삭제 로직 구현
  };

  return (
    <Alert onClose={close}>
      <Alert.Header className="h-25">
        <Alert.Title className="text-xl!">선택한 메뉴를 삭제하시겠습니까?</Alert.Title>
      </Alert.Header>

      <Alert.Footer>
        <Alert.Cancel color="grey" onClick={close} className="button-lg">
          닫기
        </Alert.Cancel>
        <Alert.Action color="primary" onClick={handleConfirm} className="button-lg">
          삭제
        </Alert.Action>
      </Alert.Footer>
    </Alert>
  );
}

export default MenuDeleteAlert;
