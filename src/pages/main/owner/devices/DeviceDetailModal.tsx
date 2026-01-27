import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useWatch, useForm } from "react-hook-form";
import { toast } from "sonner";
import { DEVICE_KEY } from '@/api/device/key';
import { deviceMutations } from "@/api/device/mutations";
import { deviceQueries } from "@/api/device/queries";
import { Skeleton } from "@/components/feedback/Skeleton";
import Spinner from "@/components/feedback/Spinner";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown";
import Label from "@/components/ui/Label";
import { errorResponse } from "@/lib/error-response";
import { queryClient } from '@/lib/query-client';
import { deviceSchema, type DeviceSchema } from "@/schema/device.schema";
import { useStoreId } from "@/stores/useStoreId";
import type { DevicePaymentType, DevicePurpose } from "@/types/domain/device";
import type { ModalProps } from "@/types/overlay";

const PURPOSE_TRANSLATES = {
  POS: "POS",
  HALL: "홀",
  TABLE: "테이블",
  WAITING: "웨이팅",
};

interface DeviceDetailModalProps extends ModalProps {
  deviceId: string;
}

function DeviceDetailModal({ deviceId, ...props }: Readonly<DeviceDetailModalProps>) {
  const { storeId } = useStoreId();
  const { data: device, isLoading } = useQuery(deviceQueries.getDeviceDetail(storeId!, deviceId));
  const { mutate: updateDevice } = useMutation(deviceMutations.updateDevice());

  const form = useForm<DeviceSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: '기기 이름',
      purpose: 'POS',
      paymentType: 'POSTPAID',
      state: 'ACTIVE',
      createdAt: new Date().toISOString(),
      tableNo: 0,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (device) {
      form.reset({
        name: device.name,
        purpose: device.purpose,
        paymentType: device.paymentType,
        state: device.state,
        createdAt: device.createdAt,
        tableNo: device.tableNo,
      });
    }
  }, [device, form]);

  const paymentType = useWatch({ control: form.control, name: "paymentType" });
  const purpose = useWatch({ control: form.control, name: "purpose" });

  const isDesktopPurpose = ["POS", "HALL"].includes(purpose as DevicePurpose);

  const purposeDropdownItems = useMemo(() => {
    if (isDesktopPurpose) {
      return [
        { name: "POS", id: "POS" },
        { name: "홀", id: "HALL" },
      ];
    }
    return [
      { name: "테이블", id: "TABLE" },
      { name: "웨이팅", id: "WAITING" },
    ];
  }, [isDesktopPurpose]);

  const paymentTypeDropdownItems = useMemo(() => {
    return [
      { name: "후결제", id: "POSTPAID" },
      { name: "선결제", id: "PREPAID" },
    ];
  }, []);

  const handleSubmit = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    
    setIsSubmitting(true);
    updateDevice(
      {
        deviceId,
        name: form.getValues("name"),
        purpose: form.getValues("purpose"),          tableNo: form.getValues("tableNo"),
        paymentType: form.getValues("paymentType"),
        storeId: storeId!,
      },
      {
        onSuccess: () => {
          props.close();
          toast.success("기기 정보가 수정되었습니다.");
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: DEVICE_KEY.list(storeId!, 1, 20) });
        },
        onError: (error) => {
          const { data } = errorResponse(error);
          const message = data?.message;

          if (data.code.includes("DEVICE_NAME")) {
            form.setError("name", { message });
            return;
          }

          if (data.code.includes("TABLE_NO")) {
            form.setError("tableNo", { message });
            return;
          }

          toast.error(message);
        },
        onSettled: () => setIsSubmitting(false)
      }
    );
  };

  const getActionButtonText = () => {
    if (!isEditing) return "수정하기";
    if (isSubmitting) return <Spinner />;
    return "저장하기";
  };

  return (
    <Form {...form}>
      <Modal
        title="기기 정보"
        open={props.isOpen}
        onOpenChange={(open) => !open && props.close()}
        footerContent={{
          action: (
            <Button
              form="device-detail-form"
              color={isEditing ? "primary" : "black"}
              responsive
              responsiveButtons={{
                md: { buttonSize: "md", className: "h-10! w-full" },
                lg: { buttonSize: "lg", className: "w-full" },
                sm: { buttonSize: "sm", className: "w-full" },
              }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {getActionButtonText()}
            </Button>
          ),
          cancel: (
            <Button
              color="grey"
              responsive
              responsiveButtons={{
                md: { buttonSize: "md", className: "h-10! w-30" },
                lg: { buttonSize: "lg", className: "w-40.5" },
                sm: { buttonSize: "sm", className: "w-18" },
              }}
              onClick={props.close}
              disabled={isSubmitting}
            >
              닫기
            </Button>
          ),
        }}
      >
        {isLoading ? (
          <div className="flex flex-col gap-3 lg:gap-4">
            <Skeleton.FieldGroup total={4} />
          </div>
        ) : (
          <div className="flex flex-col gap-3 lg:gap-4">
            <FormField
              control={form.control}
              name="name"
              label="기기 이름"
              disabled={!isEditing}
              inputProps={{ readOnly: isSubmitting }}
            />
            <FormField control={form.control} name="createdAt" label="등록일시" disabled />
            <FormField
              control={form.control}
              name="state"
              label="상태"
              disabled
              inputProps={{ value: device?.state === "ACTIVE" ? "활성화" : "비활성화" }}
            />
            <div className="flex flex-col gap-2">
              <Label disabled={!isEditing}>권한</Label>
              <Dropdown
                dropdownItems={purposeDropdownItems}
                defaultText={PURPOSE_TRANSLATES[purpose as DevicePurpose]}
                value={purpose}
                onChange={(value) => form.setValue("paymentType", value.id as DevicePaymentType)}
                disabled={!isEditing || isSubmitting}
              />
            </div>
            {purpose === "TABLE" && (
              <>
                <FormField
                  control={form.control}
                  name="tableNo"
                  label="테이블 번호"
                  disabled={!isEditing}
                  inputProps={{
                    type: "number",
                    onChange: (e: { target: { value: string } }) => {
                      const value = Number(e.target.value.replaceAll(/\D/g, ""));
                      form.setValue("tableNo", value, { shouldValidate: true });
                    },
                    readOnly: isSubmitting,
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Label disabled={!isEditing}>결제 방식</Label>
                  <Dropdown
                    dropdownItems={paymentTypeDropdownItems}
                    defaultText={paymentTypeDropdownItems[0].name}
                    value={paymentType}
                    onChange={(value) =>
                      form.setValue("paymentType", value.id as DevicePaymentType)
                    }
                    disabled={!isEditing || isSubmitting}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </Form>
  );
}

export default DeviceDetailModal;
