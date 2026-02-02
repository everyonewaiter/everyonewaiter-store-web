import { useEffect, useState } from "react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { storesMutations } from "@/api/stores/mutations";
import { storesQueries } from "@/api/stores/queries";
import Spinner from "@/components/feedback/Spinner";
import { Form, FormErrorMessage } from "@/components/form/Form";
import { Info } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import { DragList } from "@/components/ui/Drag/DragList";
import Input from "@/components/ui/Input";
import { errorResponse } from "@/lib/error-response";
import { queryClient } from "@/lib/query-client";
import cn from "@/lib/utils";
import SettingsSection from "@/pages/main/owner/settings/SettingsSection";
import SettingsStaffCallChip from "@/pages/main/owner/settings/SettingsStaffCallChip";
import SettingsSwitchItem from "@/pages/main/owner/settings/SettingsSwitchItem";
import { settingsSchema, type SettingsSchema } from "@/schema/stores/settings.schema";
import { useStoreId } from "@/stores/useStoreId";
import type { PrinterLocation, StoreSetting } from "@/types/domain/store";

function MainSettingsPage() {
  const { storeId } = useStoreId();

  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      ksnetDeviceNo: "",
      printerLocation: "POS",
      showMenuPopup: false,
      showOrderTotalPrice: false,
      showOrderMenuImage: false,
      staffCallOptions: ["반찬 추가", "음료 추가", "직원 호출"],
      extraTableCount: 5,
    },
  });

  const [newStaffCallOption, setNewStaffCallOption] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const printerLocation = useWatch({ control: form.control, name: "printerLocation" });
  const deviceNo = useWatch({ control: form.control, name: "ksnetDeviceNo" });
  const staffCallOptions = useWatch({ control: form.control, name: "staffCallOptions" });
  const extraTableCount = useWatch({ control: form.control, name: "extraTableCount" });

  const [isSubmitting, setIsSubmitting] = useState({
    ksnetDeviceNo: false,
    extraTableCount: false,
    staffCallOptions: false,
  });

  const { data: storeDetail } = useQuery(storesQueries.getStoreDetail(storeId!));
  const { mutate: updateStore } = useMutation(storesMutations.updateStore());

  useEffect(() => {
    if (storeDetail) {
      form.reset({
        ksnetDeviceNo: storeDetail?.setting?.ksnetDeviceNo,
        printerLocation: storeDetail?.setting?.printerLocation,
        showMenuPopup: storeDetail?.setting?.showMenuPopup,
        showOrderTotalPrice: storeDetail?.setting?.showOrderTotalPrice,
        showOrderMenuImage: storeDetail?.setting?.showOrderMenuImage,
        staffCallOptions: storeDetail?.setting?.staffCallOptions,
        extraTableCount: storeDetail?.setting?.extraTableCount,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail]);

  const handleUpdateStore = ({
    key,
    value,
    successHandler,
    settledHandler,
  }: {
    key: keyof StoreSetting;
    value: string | boolean | number | string[];
    successHandler?: () => void;
    settledHandler?: () => void;
  }) => {
    if (!storeDetail) return;

    updateStore(
      {
        storeId: storeId!,
        landline: storeDetail?.landline,
        setting: {
          ...storeDetail?.setting,
          [key]: value,
        },
      },
      {
        onSuccess: () => {
          successHandler?.();
          queryClient.invalidateQueries(storesQueries.getStoreDetail(storeId!));
        },
        onError: (error) => toast.error(errorResponse(error).data.message),
        onSettled: settledHandler,
      }
    );
  };

  const handleChangePrinterLocation = (location: PrinterLocation) => {
    handleUpdateStore({
      key: "printerLocation",
      value: location,
      successHandler: () => {
        form.setValue("printerLocation", location);
        toast.success(
          `주방 프린터기 연결 위치가 ${location === "POS" ? "POS" : "홀"}로 변경되었습니다.`
        );
      },
    });
  };

  const handleRegisterDeviceNumber = () => {
    form.trigger("ksnetDeviceNo");

    setIsSubmitting({ ...isSubmitting, ksnetDeviceNo: true });

    handleUpdateStore({
      key: "ksnetDeviceNo",
      value: deviceNo,
      successHandler: () => toast.success("KSNET 단말기 번호가 변경되었습니다."),
      settledHandler: () => setIsSubmitting({ ...isSubmitting, ksnetDeviceNo: false }),
    });
  };

  const handleRegisterExtraTableCount = () => {
    form.trigger("extraTableCount");

    setIsSubmitting({ ...isSubmitting, extraTableCount: true });

    handleUpdateStore({
      key: "extraTableCount",
      value: extraTableCount,
      successHandler: () => toast.success("추가 테이블 수가 변경되었습니다."),
      settledHandler: () => setIsSubmitting({ ...isSubmitting, extraTableCount: false }),
    });
  };

  const handleChangeSwitch = (key: keyof StoreSetting, value: boolean) => {
    handleUpdateStore({
      key: key,
      value: value,
      successHandler: () => form.setValue(key, value),
    });
  };

  const handleAddStaffCallOption = () => {
    form.trigger("staffCallOptions");

    handleUpdateStore({
      key: "staffCallOptions",
      value: [...staffCallOptions, newStaffCallOption],
      successHandler: () => setNewStaffCallOption(""),
    });
  };

  const handleDeleteStaffCallOption = (option: string) => {
    handleUpdateStore({
      key: "staffCallOptions",
      value: staffCallOptions.filter((o) => o !== option),
    });
  };

  return (
    <Form {...form}>
      <div className="flex h-full w-full flex-col items-center justify-start bg-white md:py-8 lg:py-10">
        <div className="flex w-full flex-col gap-8 px-5 pt-6 md:w-95 md:px-0 md:pt-0 lg:w-120">
          <h2 className="text-gray-0 text-lg font-semibold md:hidden md:text-2xl lg:block">설정</h2>
          <div className="flex flex-col gap-6">
            <SettingsSection title="매장">
              <p className="text-sm font-medium text-gray-100">
                주방 프린터기와 연결된 기기를 선택해주세요
              </p>
              <div className="flex items-center gap-3">
                {["POS", "HALL"].map((location) => (
                  <Button
                    key={location}
                    color={printerLocation === location ? "primary" : "grey"}
                    variant="outline"
                    responsive
                    responsiveButtons={{
                      lg: {
                        buttonSize: "custom",
                        className: cn(
                          "h-10 rounded-lg px-5 w-full",
                          printerLocation !== location && "border-gray-500 !text-gray-0"
                        ),
                      },
                      md: { buttonSize: "sm", className: "rounded-xl! w-full" },
                      sm: { buttonSize: "sm", className: "rounded-xl! w-full" },
                    }}
                    onClick={() => handleChangePrinterLocation(location as PrinterLocation)}
                  >
                    {location === "HALL" ? "홀" : "POS"}
                  </Button>
                ))}
              </div>
            </SettingsSection>
            <SettingsSection title="기기">
              <p className="text-sm font-medium text-gray-100">KSNET 단말기 번호</p>
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="기기 번호를 입력해주세요"
                  className="h-8! rounded-[10px]! py-1.5! text-xs! lg:h-9!"
                  {...form.register("ksnetDeviceNo", {
                    onChange: (e) => {
                      const filtered = e.target.value.toUpperCase().replaceAll(/[^A-Z0-9]/g, "");
                      form.setValue("ksnetDeviceNo", filtered);
                    },
                  })}
                />
                <Button
                  color="black"
                  responsive
                  responsiveButtons={{
                    lg: { buttonSize: "sm", className: "text-s! gap-0!" },
                    md: {
                      buttonSize: "custom",
                      className: "h-8! w-fit! px-4! rounded-lg! text-s! ",
                    },
                    sm: {
                      buttonSize: "custom",
                      className: "h-8! w-fit! px-4! rounded-lg! text-s!",
                    },
                  }}
                  onClick={handleRegisterDeviceNumber}
                  disabled={
                    storeDetail?.setting?.ksnetDeviceNo === deviceNo || isSubmitting.ksnetDeviceNo
                  }
                >
                  등록
                </Button>
              </div>
              <FormErrorMessage className="mb-[1.5px]">
                {form.formState.errors.ksnetDeviceNo?.message}
              </FormErrorMessage>
              {!form.formState.errors.ksnetDeviceNo?.message &&
                deviceNo?.startsWith("DPTOTEST") && (
                  <p className="-mt-1 flex gap-1 text-xs text-gray-400 lg:text-xs">
                    <Info className="mt-px size-4" /> 테스트용 기기입니다.
                  </p>
                )}
            </SettingsSection>
            <SettingsSection title="POS">
              <p className="text-sm font-medium text-gray-100">추가 테이블 수 설정</p>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  placeholder="추가 테이블 수 입력해주세요"
                  className="h-8! rounded-[10px]! py-1.5! text-xs! lg:h-9!"
                  {...form.register("extraTableCount", {
                    setValueAs: (value) => (value === "" ? 0 : Number(value)),
                    onChange: (e) => {
                      const number = e.target.value.replaceAll(/\D/g, "");
                      form.setValue("extraTableCount", number);
                    },
                  })}
                />
                <Button
                  color="black"
                  responsive
                  responsiveButtons={{
                    lg: { buttonSize: "sm", className: "text-s! gap-0!" },
                    md: {
                      buttonSize: "custom",
                      className: "h-8! w-fit! px-4! rounded-lg! text-s! ",
                    },
                    sm: {
                      buttonSize: "custom",
                      className: "h-8! w-fit! px-4! rounded-lg! text-s!",
                    },
                  }}
                  onClick={handleRegisterExtraTableCount}
                  disabled={
                    storeDetail?.setting?.extraTableCount === extraTableCount ||
                    isSubmitting.extraTableCount
                  }
                >
                  {isSubmitting.extraTableCount ? <Spinner /> : "등록"}
                </Button>
              </div>
              <FormErrorMessage className="mb-[1.5px]">
                {form.formState.errors.extraTableCount?.message}
              </FormErrorMessage>
            </SettingsSection>
            <SettingsSection title="홀">
              <SettingsSwitchItem
                propName="showOrderMenuImage"
                label="홀 주문 내역에서 메뉴 이미지 표시하기"
                onChange={(checked) => handleChangeSwitch("showOrderMenuImage", checked)}
              />
            </SettingsSection>
            <SettingsSection title="주문" className="pb-5">
              <SettingsSwitchItem
                propName="showMenuPopup"
                label="손님 테이블 메뉴 팝업창 띄우기"
                onChange={(checked) => handleChangeSwitch("showMenuPopup", checked)}
              />
              <SettingsSwitchItem
                propName="showOrderTotalPrice"
                label="손님 테이블 주문 내역에서 총 주문금액 표시하기"
                onChange={(checked) => handleChangeSwitch("showOrderTotalPrice", checked)}
              />
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="staff-call-options"
                  className="flex items-end gap-2.5 text-sm font-normal"
                >
                  직원 호출 페이지에 옵션 추가{" "}
                  <span className="text-xs font-normal text-gray-300">최대 12개</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <Input
                    placeholder="옵션명을 입력해주세요"
                    className="h-8! rounded-[10px]! py-1.5! text-xs! lg:h-9!"
                    value={newStaffCallOption}
                    onChange={(e) => setNewStaffCallOption(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing)
                        handleAddStaffCallOption();
                    }}
                  />
                  <Button
                    color="black"
                    responsive
                    responsiveButtons={{
                      lg: { buttonSize: "sm", className: "text-s! gap-0!" },
                      md: {
                        buttonSize: "custom",
                        className: "h-8! w-fit! px-2.5 rounded-lg! text-s! gap-0!",
                      },
                      sm: {
                        buttonSize: "custom",
                        className: "h-8! w-fit! px-2.5 rounded-lg! text-s! gap-0!",
                      },
                    }}
                    onClick={handleAddStaffCallOption}
                  >
                    추가
                  </Button>
                </div>
                <FormErrorMessage className="mb-[1.5px]">
                  {form.formState.errors.staffCallOptions?.message}
                </FormErrorMessage>
              </div>
              <DragList
                strategy={rectSortingStrategy}
                items={staffCallOptions}
                keyExtractor={(option) => option}
                onReorder={(items) => {
                  form.setValue("staffCallOptions", items);
                  handleUpdateStore({
                    key: "staffCallOptions",
                    value: items,
                  });
                }}
                renderItem={(option) => (
                  <SettingsStaffCallChip
                    key={option}
                    onDelete={() => {
                      if (isDragging) return;
                      handleDeleteStaffCallOption(option);
                    }}
                  >
                    {option}
                  </SettingsStaffCallChip>
                )}
                className="flex flex-wrap gap-x-3 gap-y-3 lg:gap-x-2 lg:gap-y-2"
                onDragStateChange={(isDragging) => setIsDragging(isDragging)}
              />
            </SettingsSection>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default MainSettingsPage;
