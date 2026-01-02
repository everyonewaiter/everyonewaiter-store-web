import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  ChevronDown,
  Dot,
  DragDrop,
  Info,
  Minus,
  Plus,
  Trash,
  UpsideDown,
} from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input";
import cn from "@/lib/utils";
import type { MenuSchema } from "@/schema/menu.schema";
import type { MenuOptionGroupType } from "@/types/domain/menu";

interface MenuDetailOptionsProps {
  type: "MANDATORY" | "OPTIONAL";
  selectedGroup: MenuOptionGroupType;
  setSelectedGroup: (group: MenuOptionGroupType) => void;
  canEdit: boolean;
}

function MenuDetailOptions({
  type,
  selectedGroup,
  setSelectedGroup,
  canEdit = true,
}: Readonly<MenuDetailOptionsProps>) {
  const form = useFormContext<MenuSchema>();

  const text = type === "MANDATORY" ? "필수" : "선택";
  const optionGroupsName = type === "MANDATORY" ? "requiredOptionGroups" : "optionalOptionGroups";

  const [showPopup, setShowPopup] = useState(false);
  const [selectedPopupMode, setSelectedPopupMode] = useState<"CHANGE_ORDER" | "DELETE" | null>(
    null
  );

  const handleAddOptionGroup = () => {
    form.setValue(optionGroupsName, [
      ...form.getValues(optionGroupsName),
      {
        name: "",
        type: "MANDATORY",
        printEnabled: false,
        menuOptions: [],
      },
    ]);
  };

  /**
   *
   * @param groupIndex - 옵션 그룹 인덱스
   */
  const handleAddOption = () => {
    // TODO: 하위 옵션 추가 로직 구현
  };

  /**
   *
   * @param groupIndex - 옵션 그룹 인덱스
   * @param optionIndex - 하위 옵션 인덱스
   */
  const handleRemoveOption = () => {
    // TODO: 하위 옵션 삭제 로직 구현
  };

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setSelectedGroup(type);
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "flex min-h-0 flex-col justify-start rounded-3xl border border-gray-600 bg-transparent p-6",
        selectedGroup === type ? "flex-1 cursor-default" : "h-fit cursor-pointer"
      )}
      onClick={() => setSelectedGroup(type)}
    >
      <div className="relative flex w-full shrink-0 items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <span className="text-gray-0 text-lg font-medium">{text} 옵션</span>
          <Info className="text-gray-0 size-6" />
        </div>
        {selectedPopupMode === "CHANGE_ORDER" ? (
          <Button
            className="border-primary text-primary! text-s h-7 rounded-lg border bg-white px-4 font-normal hover:bg-white"
            onClick={() => setSelectedPopupMode(null)}
          >
            완료
          </Button>
        ) : (
          <button type="button" onClick={() => canEdit && setShowPopup((prev) => !prev)}>
            {canEdit ? (
              <Dot className="text-gray-0 size-6" />
            ) : (
              <ChevronDown
                className={cn("text-gray-0 size-6", selectedGroup === type ? "rotate-180" : "")}
              />
            )}
          </button>
        )}
        {showPopup && (
          <div className="absolute top-8 right-0 z-999 rounded-[16px] bg-white p-3 shadow-[0px_2px_10px_rgba(0,0,0,0.08)]">
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-lg p-3 text-[15px] font-normal text-gray-100",
                selectedPopupMode === "CHANGE_ORDER" ? "bg-gray-700" : ""
              )}
              onClick={() => {
                if (selectedPopupMode === "CHANGE_ORDER") {
                  setSelectedPopupMode(null);
                } else {
                  setSelectedPopupMode("CHANGE_ORDER");
                }
                setShowPopup(false);
              }}
            >
              <UpsideDown className="size-4.5 text-gray-100" />
              순서 변경
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 rounded-lg p-3 text-[15px] font-normal text-gray-100",
                selectedPopupMode === "DELETE" ? "bg-gray-700" : ""
              )}
              onClick={() => {
                if (selectedPopupMode === "DELETE") {
                  setSelectedPopupMode(null);
                } else {
                  setSelectedPopupMode("DELETE");
                }
                setShowPopup(false);
              }}
            >
              <Trash className="size-4.5 text-gray-100" />
              옵션 삭제
            </button>
          </div>
        )}
      </div>

      {selectedGroup === type && (
        <>
          <div className="h-4 shrink-0" />
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {form.watch(optionGroupsName)?.length ? (
              <div className="hide-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto whitespace-pre-line">
                {form.watch(optionGroupsName).map((group, index) => (
                  <div className="flex w-full items-center gap-3" key={group.name}>
                    <div className="flex w-full flex-col gap-3 rounded-xl border border-gray-600 p-4">
                      <div className="flex flex-1 flex-col gap-4">
                        <Input
                          className="h-12 border-gray-400"
                          placeholder="옵션명을 입력해주세요."
                          {...form.register(
                            `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${index}.name`
                          )}
                        />
                        <div className="h-px w-full bg-gray-600" />
                        <div className="flex flex-col gap-3">
                          {group.menuOptions.map((_, optionIndex) => (
                            <div
                              className="flex items-center gap-2"
                              key={`${index}-${optionIndex}`}
                            >
                              <Input
                                className="h-12 flex-1 border-gray-400"
                                placeholder="하위 옵션명을 입력해주세요."
                                {...form.register(
                                  `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${index}.menuOptions.${optionIndex}.name`
                                )}
                              />
                              <div className="relative flex-1">
                                {/*  TODO: onChange 가격 포맷팅 */}
                                <Input
                                  className="h-12 border-gray-400 pr-9"
                                  placeholder="ex. 33,000"
                                  {...form.register(
                                    `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${index}.menuOptions.${optionIndex}.price`
                                  )}
                                />
                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-[15px] font-medium text-[#7C7C7C]">
                                  원
                                </span>
                              </div>
                              {canEdit && (
                                <button onClick={() => handleRemoveOption()}>
                                  <Minus className="size-5 text-gray-300" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      {canEdit && (
                        <Button
                          color="grey"
                          responsive
                          responsiveButtons={{
                            lg: {
                              buttonSize: "custom",
                              className:
                                "h-8 rounded-lg border border-gray-600 bg-[F7F7F7]! gap-2 text-sm font-medium text-gray-100",
                            },
                          }}
                          onClick={() => handleAddOption()}
                        >
                          하위 옵션 추가
                          <Plus className="size-4 text-gray-100" />
                        </Button>
                      )}
                    </div>
                    {selectedPopupMode && (
                      <button className="center h-8 w-8 rounded-lg border border-gray-600">
                        {selectedPopupMode === "DELETE" ? (
                          <Trash className="text-gray-0 size-5" />
                        ) : (
                          <DragDrop className="text-gray-0 size-5" />
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <span className="text-sm font-normal text-gray-300">
                  현재 등록된 {text} 옵션이 없습니다.
                </span>
              </div>
            )}
            {canEdit && (
              <div className="mt-4 shrink-0">
                <Button
                  variant="outline"
                  responsive
                  responsiveButtons={{
                    lg: {
                      buttonSize: "sm",
                      className: "border border-gray-600 rounded-lg w-full",
                    },
                  }}
                  onClick={handleAddOptionGroup}
                >
                  <Plus className="text-gray-0 size-5" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MenuDetailOptions;
