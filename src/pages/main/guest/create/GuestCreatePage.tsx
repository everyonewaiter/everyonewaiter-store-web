import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import dashedBorder from "@/assets/images/dashed.svg";
import logo from "@/assets/images/logo.svg";
import Spinner from "@/components/feedback/Spinner";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { FileAttach } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import { useFormBlocker } from "@/hooks/useLeavePageBlocker";
import useOpenDaumPostcode from "@/hooks/useOpenDaumPostcode";
import { formatBusinessNumber, formatStorePhoneNumber } from "@/lib/format";
import { createStoreSchema, type CreateStoreSchema } from "@/schema/create-store.schema";

function GuestCreate() {
  const navigate = useNavigate();
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

  const handleSubmit = form.handleSubmit(() => {
    setIsSubmitting(true);

    navigate("/guest");
  });

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-700">
      <div className="flex justify-between rounded-4xl bg-white p-8 lg:w-222">
        <div className="flex flex-col gap-10">
          <img src={logo} alt="logo text horizontal" className="h-22.5 w-22.5" />
          <div className="flex flex-col gap-3">
            <h1 className="text-gray-0 text-4xl font-bold">매장 등록</h1>
            <span className="text-[15px] font-normal whitespace-pre-line text-gray-300">{`첫 매장을 등록해볼까요?\n간단한 정보만 입력하면 바로 시작할 수 있어요!`}</span>
          </div>
        </div>
        <Form {...form}>
          <form className="flex w-100 flex-col gap-8">
            <div className="flex flex-col gap-4">
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
                className="relative flex h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl bg-gray-700"
              >
                <img
                  src={dashedBorder}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                />
                <FileAttach className="h-10 w-10 text-gray-300" />
                <div className="flex flex-col gap-1">
                  <span className="text-base font-medium text-gray-100">
                    사업자 등록증의 제출하세요
                  </span>
                  <span className="text-s font-normal text-gray-300">
                    JPG, PNG, PDF로 제출 가능합니다.
                  </span>
                </div>
              </button>
            </div>
            <Button
              type="submit"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg" },
              }}
              onClick={handleSubmit}
            >
              {isSubmitting ? <Spinner /> : "신청하기"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default GuestCreate;
