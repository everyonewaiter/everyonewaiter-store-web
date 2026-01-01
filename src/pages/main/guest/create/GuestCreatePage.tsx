import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dashedBorder from "@/assets/images/dashed.svg";
import logo from "@/assets/images/logo.svg";
import Spinner from "@/components/feedback/Spinner";
import { Form, FormErrorMessage } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { FileAttach } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import { useFormBlocker } from "@/hooks/useLeavePageBlocker";
import useOpenDaumPostcode from "@/hooks/useOpenDaumPostcode";
import { formatBusinessNumber, formatStorePhoneNumber } from "@/lib/format";
import { createStoreSchema, type CreateStoreSchema } from "@/schema/create-store.schema";

function GuestCreate() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateStoreSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      ceoName: "",
      address: "",
      detailAddress: "",
      landline: "",
      license: "",
      file: null,
    },
  });

  useFormBlocker(form.formState.isDirty && !isSubmitting);

  const { handleOpenAddress } = useOpenDaumPostcode((address) => {
    form.setValue("address", address, { shouldDirty: true });
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!data.file || data.file === null) {
      form.setError("file", { message: "사업자등록증을 제출해주세요." });
      return;
    }

    setIsSubmitting(true);

    // TODO: 매장 등록 로직 구현

    navigate("/guest");
  });

  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      form.setValue("file", file, { shouldDirty: true });
    }
  };

  const file = useWatch({ control: form.control, name: "file" });
  const fileUrl = useMemo(() => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <div className="flex h-full w-full justify-center bg-white pt-5 md:items-start md:bg-gray-700 md:py-8 lg:items-center lg:py-0">
      <div className="flex w-full flex-col gap-8 rounded-4xl bg-white px-5 md:h-full md:w-180 md:flex-row md:justify-between md:gap-0 md:p-5 lg:h-auto lg:w-222 lg:p-8">
        <div className="hidden flex-col md:flex md:gap-5 lg:gap-10">
          <img
            src={logo}
            alt="logo text horizontal"
            className="md:h-15 md:w-15 lg:h-22.5 lg:w-22.5"
          />
          <div className="flex flex-col md:gap-2 lg:gap-3">
            <h1 className="text-gray-0 font-bold md:text-xl lg:text-4xl">매장 등록</h1>
            <span className="font-normal whitespace-pre-line text-gray-300 md:text-xs lg:text-[15px]">{`첫 매장을 등록해볼까요?\n간단한 정보만 입력하면 바로 시작할 수 있어요!`}</span>
          </div>
        </div>
        <div className="block md:hidden">
          <h1 className="text-gray-0 text-center text-xl font-bold">매장 등록</h1>
        </div>
        <Form {...form}>
          <form className="hide-scrollbar flex flex-col gap-6 overflow-y-auto md:w-87 md:gap-8 lg:w-100">
            <div className="flex flex-col gap-3 lg:gap-4">
              <FormField
                control={form.control}
                name="name"
                label="상호명"
                inputProps={{ placeholder: "상호명을 입력해주세요. (20자 이내)." }}
              />
              <FormField
                control={form.control}
                name="ceoName"
                label="대표자명"
                inputProps={{
                  placeholder: "대표자명을 입력해주세요.",
                  onKeyDown: (e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const addressInput: HTMLInputElement | null =
                        document.querySelector('input[name="address"]');
                      addressInput?.focus();
                    }
                  },
                }}
              />
              <FormField
                control={form.control}
                name="address"
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
                label="소재지"
              />
              <FormField
                control={form.control}
                name="detailAddress"
                label="상세 주소"
                inputProps={{ placeholder: "상세 주소를 입력해주세요." }}
              />
              <FormField
                control={form.control}
                name="landline"
                label="메징 전화번호"
                inputProps={{
                  placeholder: "매장 전화번호를 입력해주세요.",
                  onChange: (e) => {
                    const formatted = formatStorePhoneNumber(e);
                    form.setValue("landline", formatted, { shouldDirty: true });
                  },
                }}
              />
              <FormField
                control={form.control}
                name="license"
                label="사업자번호"
                inputProps={{
                  placeholder: "사업자번호를 입력해주세요. (000-00-00000)",
                  onChange: (e) => {
                    const formatted = formatBusinessNumber(e);
                    form.setValue("license", formatted, { shouldDirty: true });
                  },
                }}
              />
              <button
                type="button"
                className="relative flex h-35 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-gray-600 bg-gray-700 md:h-40 md:gap-3 md:border-none"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={dashedBorder}
                  alt=""
                  className="pointer-events-none absolute inset-0 hidden h-full w-full rounded-2xl object-cover md:block"
                  aria-hidden="true"
                />
                {(file?.type === "image/jpeg" ||
                  file?.type === "image/jpg" ||
                  file?.type === "image/png") &&
                  fileUrl && (
                    <img
                      src={fileUrl}
                      alt="사업자등록증 미리보기"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  )}

                {!file && (
                  <>
                    <FileAttach className="h-7 w-7 text-gray-300 md:h-10 md:w-10" />
                    <div className="flex flex-col gap-0.5 md:gap-1">
                      <span className="text-sm font-medium text-gray-100 lg:text-base">
                        사업자 등록증을 제출하세요
                      </span>
                      <span className="lg:text-s text-xs font-normal text-gray-300">
                        JPG, PNG, PDF로 제출 가능합니다.
                      </span>
                    </div>
                  </>
                )}
                {form.formState.errors.file && (
                  <FormErrorMessage>{form.formState.errors.file.message}</FormErrorMessage>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpg, image/png, application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </button>
            </div>
            <div className="w-full shrink-0">
              <Button
                type="submit"
                responsive
                responsiveButtons={{
                  sm: { buttonSize: "md", className: "w-full" },
                  md: { buttonSize: "sm", className: "w-full" },
                  lg: { buttonSize: "lg", className: "w-full" },
                }}
                onClick={handleSubmit}
              >
                {isSubmitting ? <Spinner /> : "신청하기"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default GuestCreate;
