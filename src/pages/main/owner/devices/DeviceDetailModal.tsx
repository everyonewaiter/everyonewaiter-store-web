import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch, useForm } from "react-hook-form";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import Dropdown from "@/components/ui/Dropdown";
import Label from "@/components/ui/Label";
import { DEVICE_DETAIL_MOCK } from "@/pages/main/owner/devices/mock";
import { deviceSchema, type DeviceSchema } from "@/schema/device.schema";
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
  const data = DEVICE_DETAIL_MOCK.find((device) => device.deviceId === deviceId);

  const form = useForm<DeviceSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: data?.name,
      purpose: data?.purpose,
      paymentType: data?.paymentType,
      state: data?.state,
      createdAt: data?.createdAt,
      tableNo: data?.tableNo,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

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
    if (isEditing) {
      console.log(data);
      // TODO: 기기 정보 수정 로직
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Form {...form}>
      <Modal
        title="기기 정보"
        hasCloseIcon={false}
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
            >
              {isEditing ? "저장하기" : "수정하기"}
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
            >
              닫기
            </Button>
          ),
        }}
      >
        <div className="flex flex-col gap-3 lg:gap-4">
          <FormField control={form.control} name="name" label="기기 이름" disabled={!isEditing} />
          <FormField control={form.control} name="createdAt" label="등록일시" disabled />
          <FormField
            control={form.control}
            name="state"
            label="상태"
            disabled
            inputProps={{ value: data?.state === "ACTIVE" ? "활성화" : "비활성화" }}
          />
          <div className="flex flex-col gap-2">
            <Label disabled={!isEditing}>권한</Label>
            <Dropdown
              dropdownItems={purposeDropdownItems}
              defaultText={PURPOSE_TRANSLATES[purpose as DevicePurpose]}
              value={purpose}
              onChange={(value) => form.setValue("paymentType", value.id as DevicePaymentType)}
              disabled={!isEditing}
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
                }}
              />
              <div className="flex flex-col gap-2">
                <Label disabled={!isEditing}>결제 방식</Label>
                <Dropdown
                  dropdownItems={paymentTypeDropdownItems}
                  // TODO: 데이터의 결제 방식에 맞게 수정
                  defaultText={paymentTypeDropdownItems[0].name}
                  value={paymentType}
                  onChange={(value) => form.setValue("paymentType", value.id as DevicePaymentType)}
                  disabled={!isEditing}
                />
              </div>
            </>
          )}
        </div>
      </Modal>
    </Form>
  );
}

export default DeviceDetailModal;
