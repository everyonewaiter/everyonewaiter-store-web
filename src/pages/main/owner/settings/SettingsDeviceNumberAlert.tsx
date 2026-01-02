import Alert from "@/components/overlay/Alert/Alert";

interface SettingsDeviceNumberAlertProps {
  close: () => void;
  deviceNumber: string;
}

function SettingsDeviceNumberAlert({
  close,
  deviceNumber,
}: Readonly<SettingsDeviceNumberAlertProps>) {
  return (
    <Alert
      onClose={close}
      footer={
        <Alert.Footer>
          <Alert.Cancel color="grey">취소</Alert.Cancel>
          <Alert.Action
            onClick={() => {
              // TODO: 기기 번호 등록 로직
            }}
          >
            등록하기
          </Alert.Action>
        </Alert.Footer>
      }
    >
      <div className="mt-2">
        {deviceNumber}은 테스트용 기기입니다.
        <br />
        <span className="text-xs font-medium! text-gray-400">
          결제 및 취소가 제대로 이루어지지 않을 수 있습니다.
        </span>
      </div>
    </Alert>
  );
}

export default SettingsDeviceNumberAlert;
