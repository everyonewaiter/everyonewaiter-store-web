import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import Image from "@/components/ui/Image";
import Label from "@/components/ui/Label";
import useOpenDaumPostcode from "@/hooks/useOpenDaumPostcode";
import { formatBusinessNumber } from "@/lib/format";
import { createStoreSchema } from "@/schema/create-store.schema";
import type { StoreApplication } from "@/types/domain/store";
import type { ModalProps } from "@/types/overlay";

const formType = createStoreSchema.omit({ file: true }).extend({
  file: z.union([z.instanceof(File), z.string()]),
  createdAt: z.string(),
  reason: z.string().optional(),
});

interface ApplicationModalProps extends ModalProps {
  application: StoreApplication;
}

function ApplicationModal({ application, isOpen, close }: Readonly<ApplicationModalProps>) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formType>>({
    resolver: zodResolver(formType),
    defaultValues: {
      name: application.name,
      license: application.license,
      address: application.address,
      createdAt: application.createdAt,
      reason: application.reason,
      file: application.image,
    },
  });

  const { handleOpenAddress } = useOpenDaumPostcode((address) => {
    form.setValue("address", address, { shouldDirty: true });
  });

  const handleChangeImage = () => {
    // TODO: 이미지 등록, 삭제 구현
  };

  const handleSubmit = () => {
    // TODO: 매장 등록 신청 구현
    // console.log(form.getValues());
  };

  return (
    <Form {...form}>
      <Modal
        title="매장 등록 신청 현황"
        hasCloseIcon
        open={isOpen}
        onOpenChange={(open) => !open && close()}
        footerContent={{
          action:
            application.status === "REJECT" ? (
              <Button
                color={isEditing ? "primary" : "black"}
                responsive
                responsiveButtons={{
                  lg: { buttonSize: "xl", className: "w-full outline-none" },
                  md: { buttonSize: "sm", className: "w-full outline-none" },
                  sm: { buttonSize: "sm", className: "w-full outline-none !h-10" },
                }}
                onClick={() => {
                  if (isEditing) {
                    handleSubmit();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? "재신청하기" : "수정하고 재신청하기"}
              </Button>
            ) : null,
        }}
      >
        <div className="flex flex-col gap-3 lg:gap-4">
          <FormField control={form.control} name="name" label="상호명" disabled={!isEditing} />
          <FormField
            control={form.control}
            name="license"
            label="사업자번호"
            disabled={!isEditing}
            inputProps={{
              placeholder: "사업자번호를 입력해주세요. (000-00-00000)",
              onChange: (e) => {
                const formatted = formatBusinessNumber(e);
                form.setValue("license", formatted, { shouldDirty: true });
              },
            }}
          />
          <FormField
            control={form.control}
            name="address"
            label="소재지"
            disabled={!isEditing}
            inputProps={{
              placeholder: "소재지를 선택해주세요.",
              readOnly: true,
              className: "cursor-pointer focus:border-gray-400",
              onClick: handleOpenAddress,
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleOpenAddress();
                }
              },
              tabIndex: 0,
            }}
          />
          <FormField control={form.control} name="createdAt" label="신청일" disabled />
          {application.status === "REJECT" && (
            <FormField
              control={form.control}
              name="reason"
              label="반려 사유"
              disabled
              inputProps={{
                className: isEditing
                  ? ""
                  : "text-center !border-primary !bg-[#F2202014] !text-primary",
              }}
            />
          )}
          <div className="mt-2 flex flex-col md:mt-0">
            <Label disabled={!isEditing}>사업자등록증</Label>
            <div className="center mt-2 w-full flex-col gap-3 rounded-2xl bg-gray-700 px-11.5 py-6">
              <Image
                src={application.image}
                fallbackSrc={
                  "https://cache.shopee.kr/upload/blog/ca20d442-f56c-d5cc-c3f9-84aefe8e637a.png"
                }
                className="h-full w-full rounded-2xl border border-gray-600"
                alt="사업자등록증"
              />
              {isEditing && (
                <Button
                  color="black"
                  variant="outline"
                  responsive
                  responsiveButtons={{
                    lg: {
                      buttonSize: "lg",
                      className:
                        "w-full outline-none !rounded-lg !font-normal hover:!bg-transparent hover:!text-gray-0",
                    },
                    md: {
                      buttonSize: "sm",
                      className:
                        "w-full outline-none !font-normal hover:!bg-transparent hover:!text-gray-0",
                    },
                    sm: { buttonSize: "sm", className: "w-full outline-none !h-10" },
                  }}
                  onClick={handleChangeImage}
                >
                  사업자 등록증 수정하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default ApplicationModal;
