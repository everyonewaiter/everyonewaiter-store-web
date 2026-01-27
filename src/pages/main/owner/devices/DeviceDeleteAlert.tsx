import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DEVICE_KEY } from '@/api/device/key';
import { deviceMutations } from "@/api/device/mutations";
import Spinner from "@/components/feedback/Spinner";
import Alert from "@/components/overlay/Alert";
import { errorResponse } from "@/lib/error-response";
import { queryClient } from '@/lib/query-client';
import { useStoreId } from "@/stores/useStoreId";
import type { Device } from "@/types/domain/device";
import type { ModalProps } from "@/types/overlay";

interface DeviceDeleteModalProps extends ModalProps {
  deleteItem: Device[];
}

function DeviceDeleteModal({ deleteItem, ...props }: Readonly<DeviceDeleteModalProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { storeId } = useStoreId();
  const { mutateAsync: deleteDevice } = useMutation(deviceMutations.deleteDevice());

  const renderText = () => {
    if (deleteItem.length === 1) {
      return `을`;
    }
    return ` 외 ${deleteItem.length - 1}개의 기기를`;
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      for (const device of deleteItem) {
        await deleteDevice({
          deviceId: device.deviceId,
          storeId: storeId!,
        });
      }

      toast.success("기기가 삭제되었습니다.");
      props.close();
      queryClient.invalidateQueries({ queryKey: DEVICE_KEY.listPrefix(storeId!) });
    } catch (error) {
      setIsSubmitting(false);
      const { data } = errorResponse(error);
      const message = data?.message;
      toast.error(message);
    }
  };

  return (
    <Alert
      {...props}
      footer={
        <>
          <Alert.Cancel disabled={isSubmitting}>닫기</Alert.Cancel>
          {deleteItem.length > 0 && (
            <Alert.Action onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "삭제"}
            </Alert.Action>
          )}
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
