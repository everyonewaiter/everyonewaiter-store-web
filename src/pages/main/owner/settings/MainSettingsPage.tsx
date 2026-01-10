import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Form, FormErrorMessage } from "@/components/form/Form";
import { Info, Plus } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import cn from "@/lib/utils";
import SettingsSection from "@/pages/main/owner/settings/SettingsSection";
import SettingsStaffCallChip from "@/pages/main/owner/settings/SettingsStaffCallChip";
import SettingsSwitchItem from "@/pages/main/owner/settings/SettingsSwitchItem";
import { settingsSchema, type SettingsSchema } from "@/schema/stores/settings.schema";
import type { PrinterLocation } from "@/types/domain/store";

function MainSettingsPage() {
  const form = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      ksnetDeviceNo: "DPTOTEST03",
      printerLocation: "POS",
      showMenuPopup: false,
      showOrderTotalPrice: false,
      showOrderMenuImage: false,
      staffCallOptions: ["반찬 추가", "음료 추가", "직원 호출"],
      extraTableCount: 5,
    },
  });

  const [newStaffCallOption, setNewStaffCallOption] = useState<string>("");

  const printerLocation = useWatch({ control: form.control, name: "printerLocation" });
  const deviceNo = useWatch({ control: form.control, name: "ksnetDeviceNo" });
  const staffCallOptions = useWatch({ control: form.control, name: "staffCallOptions" });

  const handleAddStaffCallOption = () => {
    // TODO: 직원 호출 옵션 추가 로직
  };

  const handleChangePrinterLocation = (location: PrinterLocation) => {
    // TODO: 프린터 위치 변경 로직
    form.setValue("printerLocation", location);
  };

  const handleRegisterDeviceNumber = () => {
    // TODO: 기기 번호 등록 로직
  };

  return (
    <Form {...form}>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center bg-white md:justify-center",
          staffCallOptions.length > 5 && "py-8 md:justify-start"
        )}
      >
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
                  {...form.register("ksnetDeviceNo")}
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
                >
                  등록
                </Button>
              </div>
              <FormErrorMessage className="mb-[1.5px]" />
              {deviceNo?.startsWith("DPTOTEST") && (
                <p className="-mt-1 flex gap-1 text-xs text-gray-400 lg:text-xs">
                  <Info className="mt-px size-4" /> 테스트용 기기입니다.
                </p>
              )}
            </SettingsSection>
            <SettingsSection title="주문">
              <SettingsSwitchItem propName="showMenuPopup" label="손님 테이블 메뉴 팝업창 띄우기" />
              <SettingsSwitchItem
                propName="showOrderTotalPrice"
                label="손님 테이블 주문 내역에서 총 주문금액 표시하기"
              />
              <SettingsSwitchItem
                propName="showOrderMenuImage"
                label="홀 주문 내역에서 메뉴 이미지 표시하기"
              />
              <div className="flex flex-col gap-3">
                <Label className="flex items-end gap-2.5 text-sm font-normal">
                  추가 테이블 수 설정
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    placeholder="테이블 수를 입력해주세요"
                    className="h-8! rounded-[10px]! py-1.5! text-xs! lg:h-9!"
                    {...form.register("extraTableCount")}
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
                  >
                    등록
                  </Button>
                </div>
              </div>
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
                    <Plus className="size-5 text-white" />
                    추가
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-3 lg:gap-x-2 lg:gap-y-2">
                {staffCallOptions.map((option) => (
                  <SettingsStaffCallChip key={option}>{option}</SettingsStaffCallChip>
                ))}
              </div>
            </SettingsSection>
          </div>
        </div>
      </div>
    </Form>
  );
}

export default MainSettingsPage;
