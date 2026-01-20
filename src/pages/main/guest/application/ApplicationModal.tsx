import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { storesMutations } from "@/api/stores/mutations";
import Spinner from "@/components/feedback/Spinner";
import { Form, FormErrorMessage } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import Image from "@/components/ui/Image";
import Label from "@/components/ui/Label";
import useOpenDaumPostcode from "@/hooks/useOpenDaumPostcode";
import { errorResponse } from "@/lib/error-response";
import { formatBusinessNumber } from "@/lib/format";
import { applicationFormSchema, type ApplicationFormSchema } from "@/schema/create-store.schema";
import type { StoreApplication } from "@/types/domain/store";
import type { ModalProps } from "@/types/overlay";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

interface ApplicationModalProps extends ModalProps {
  application: StoreApplication;
  showReapplyButton?: boolean;
}

function ApplicationModal({
  application,
  showReapplyButton = false,
  ...props
}: Readonly<ApplicationModalProps>) {
  const imageRef = useRef<HTMLInputElement>(null);

  const form = useForm<ApplicationFormSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: application.name,
      license: application.license,
      landline: application.landline,
      address: application.address,
      createdAt: application.createdAt,
      reason: application.reason,
      file: application.image,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const imageFileUrl = useMemo(() => {
    if (imageFile instanceof File) {
      return URL.createObjectURL(imageFile);
    }
    return null;
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imageFileUrl) {
        URL.revokeObjectURL(imageFileUrl);
      }
    };
  }, [imageFileUrl]);

  const { mutateAsync: reapplyStore } = useMutation(storesMutations.reapplyStore());
  const { mutateAsync: reapplyStoreWithFile } = useMutation(storesMutations.reapplyStoreWithFile());

  const { handleOpenAddress } = useOpenDaumPostcode((address) => {
    form.setValue("address", address, { shouldDirty: true });
  });

  const handleChangeImage = () => {
    const file = imageRef.current?.files?.[0];

    if ((file?.size ?? 0) > MAX_IMAGE_SIZE) {
      form.setError("file", { message: "이미지 용량은 5MB 이하만 업로드할 수 있어요." });
      return;
    }

    if (file) {
      setImageFile(file);
      form.clearErrors("file");
      form.setValue("file", file, { shouldDirty: true });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const mutation =
        form.getValues().file === application?.image ? reapplyStore : reapplyStoreWithFile;

      await mutation({
        name: form.getValues().name,
        ceoName: form.getValues().ceoName,
        address: form.getValues().address,
        landline: form.getValues().landline,
        license: form.getValues().license,
        registrationId: application?.registrationId,
        file: imageFile as File,
      });

      toast.success("재신청이 완료되었습니다.");
      props.close();
    } catch (error) {
      setIsSubmitting(false);

      const { status, data } = errorResponse(error);
      const message = data?.message;

      if (status === 400 && data?.code?.includes("IMAGE")) {
        toast.error(message);
        return;
      }

      if (data?.message?.includes("주소")) {
        form.setError("address", { message });
        return;
      }

      if (data?.message?.includes("사업자")) {
        form.setError("license", { message });
        return;
      }

      if (
        data?.message?.includes("매장명") ||
        data?.message?.includes("상호명") ||
        data?.message?.includes("매장 이름")
      ) {
        form.setError("name", { message });
        return;
      }

      toast.error(message);
    }
  };

  return (
    <Form {...form}>
      <Modal
        title="매장 등록 신청 현황"
        open={props.isOpen}
        onOpenChange={(open) => !open && props.close()}
        footerContent={{
          action:
            application.status === "REJECT" && showReapplyButton ? (
              <Button
                color={isEditing ? "primary" : "black"}
                responsive
                responsiveButtons={{
                  lg: { buttonSize: "xl", className: "w-120 outline-none" },
                  md: { buttonSize: "sm", className: "w-75 outline-none" },
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
                {isEditing && isSubmitting && <Spinner />}
                {!isEditing && "수정하고 재신청하기"}
                {isEditing && !isSubmitting && "재신청하기"}
              </Button>
            ) : null,
        }}
        className="w-75! md:h-auto! md:w-150! lg:w-200!"
      >
        <div className="flex flex-col-reverse gap-3 md:h-110 md:flex-row md:gap-4 lg:h-144 lg:gap-6">
          <div className="mt-2 flex flex-1 flex-col md:mt-0">
            <Label disabled={!isEditing}>사업자등록증</Label>
            <div className="center mt-2 w-full flex-1 flex-col gap-3 overflow-hidden rounded-2xl bg-gray-700 px-6 py-6 md:p-1">
              {form.watch("file")?.toString().startsWith("license") ? (
                <Image
                  src={form.watch("file") as string}
                  className="h-full w-full rounded-2xl object-cover"
                  alt="사업자등록증"
                />
              ) : (
                <img
                  src={imageFileUrl!}
                  alt="사업자등록증 미리보기"
                  className="h-full w-full rounded-2xl object-cover"
                />
              )}
            </div>
            {isEditing && (
              <Button
                color="black"
                variant="outline"
                responsive
                responsiveButtons={{
                  lg: {
                    buttonSize: "lg",
                    className:
                      "w-full outline-none !rounded-lg !font-normal hover:!bg-transparent hover:!text-gray-0 mt-2",
                  },
                  md: {
                    buttonSize: "sm",
                    className:
                      "w-full outline-none !font-normal hover:!bg-transparent hover:!text-gray-0 mt-2",
                  },
                  sm: { buttonSize: "sm", className: "w-full outline-none !h-10 mt-2" },
                }}
                onClick={() => imageRef.current?.click()}
                disabled={isSubmitting}
              >
                사업자 등록증 수정하기
              </Button>
            )}
            <input
              type="file"
              ref={imageRef}
              accept="image/png, image/jpg, application/pdf"
              className="hidden"
              onChange={handleChangeImage}
            />
            <FormErrorMessage className="mt-2">
              {form.formState.errors.file?.message}
            </FormErrorMessage>
          </div>
          <div className="flex flex-1 flex-col gap-3 lg:gap-4">
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
                readOnly: isSubmitting,
              }}
            />
            <FormField
              control={form.control}
              name="landline"
              label="매장 전화번호"
              disabled={!isEditing}
              inputProps={{
                placeholder: "매장 전화번호를 입력해주세요. (000-00-00000)",
                readOnly: isSubmitting,
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
                onClick: isSubmitting ? () => null : handleOpenAddress,
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isSubmitting) return;
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
          </div>
        </div>
      </Modal>
    </Form>
  );
}

export default ApplicationModal;
