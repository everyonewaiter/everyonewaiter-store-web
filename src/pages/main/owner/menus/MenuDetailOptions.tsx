import { useState, type ChangeEvent } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
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
import { DragList } from "@/components/ui/Drag/DragList";
import Input from "@/components/ui/Input";
import { formatPrice } from "@/lib/format";
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: optionGroupsName as "requiredOptionGroups" | "optionalOptionGroups",
  });

  const [showInfo, setShowInfo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPopupMode, setSelectedPopupMode] = useState<"CHANGE_ORDER" | "DELETE" | null>(
    null
  );

  const handleAddOptionGroup = () => {
    append({
      name: "",
      type,
      printEnabled: true,
      menuOptions: [],
    });
  };

  /**
   *
   * @param groupIndex - 옵션 그룹 인덱스
   */
  const handleAddOption = (groupIndex: number) => {
    const newOption = {
      name: "",
      price: "",
    };

    const fieldPath = `${optionGroupsName}.${groupIndex}.menuOptions` as Parameters<
      typeof form.setValue
    >[0];

    const currentOptions =
      (form.getValues(fieldPath) as Array<{ name: string; price: string }>) || [];
    form.setValue(fieldPath, [...currentOptions, newOption]);
  };

  /**
   *
   * @param groupIndex - 옵션 그룹 인덱스
   * @param optionIndex - 하위 옵션 인덱스
   */
  const handleRemoveSingleOption = (groupIndex: number, optionIndex: number) => {
    const fieldPath =
      `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${groupIndex}.menuOptions` as Parameters<
        typeof form.setValue
      >[0];

    const currentOptions =
      (form.getValues(fieldPath) as Array<{ name: string; price: string }>) || [];
    form.setValue(
      fieldPath,
      currentOptions.filter(
        (_: { name: string; price: string }, idx: number) => idx !== optionIndex
      )
    );
  };

  const handleChangeOrderOption = (optionIndex: number) => {
    if (selectedPopupMode === "CHANGE_ORDER") {
      setSelectedPopupMode(null);
    } else {
      remove(optionIndex);
    }
  };

  const handleReorder = (
    items: typeof fields
    // sourceId: string,
    // targetId: string,
    // where: "PREV" | "NEXT"
  ) => {
    const currentValues = form.getValues(
      optionGroupsName as "requiredOptionGroups" | "optionalOptionGroups"
    );
    const reorderedData = items.map((field) => {
      const originalIndex = fields.findIndex((f) => f.id === field.id);
      return currentValues[originalIndex];
    });
    form.setValue(
      optionGroupsName as "requiredOptionGroups" | "optionalOptionGroups",
      reorderedData as MenuSchema["requiredOptionGroups"] | MenuSchema["optionalOptionGroups"]
    );
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
        "flex min-h-0 flex-col justify-start rounded-xl border border-gray-600 bg-transparent p-4 lg:rounded-3xl lg:p-6",
        selectedGroup === type
          ? "aspect-320/388 cursor-default md:aspect-auto md:flex-1"
          : "h-fit cursor-pointer"
      )}
      onClick={() => setSelectedGroup(type)}
    >
      <div className="relative flex w-full shrink-0 items-center justify-between">
        <div className="relative flex flex-1 items-center gap-1.5 lg:gap-2">
          <span className="text-gray-0 text-sm font-medium lg:text-lg">{text} 옵션</span>
          <Info
            className="text-gray-0 size-5 cursor-pointer lg:size-6"
            onClick={() => setShowInfo((prev) => !prev)}
          />
          {showInfo && (
            <div className="absolute bottom-9 left-7 z-999 rounded-2xl bg-white p-2.5 text-[10px] whitespace-pre-line text-[#505050] drop-shadow-[0px_2px_10px_rgba(0,0,0,0.08)] lg:bottom-11 lg:left-11.5 lg:p-3">
              {`첫번째 옵션 상세가 기본값으로 설정됩니다.\n순서변경 아이콘 클릭 시 옵션명 및 옵션상세의\n순서를 변경할 수 있습니다.`}
              <div className="absolute -bottom-3.5 left-6 h-0 w-0 border-t-14 border-r-[14.5px] border-l-[14.5px] border-t-white border-r-transparent border-l-transparent" />
            </div>
          )}
        </div>
        {selectedPopupMode === "CHANGE_ORDER" ? (
          <Button
            type="button"
            className="border-primary text-primary! text-s h-7 rounded-lg border bg-white px-4 font-normal hover:bg-white"
            onClick={() => setSelectedPopupMode(null)}
          >
            완료
          </Button>
        ) : (
          <button
            type="button"
            onClick={() => canEdit && fields.length > 0 && setShowPopup((prev) => !prev)}
          >
            {canEdit && fields.length > 0 ? (
              <Dot className="text-gray-0 size-5 lg:size-6" />
            ) : (
              <ChevronDown
                className={cn(
                  "text-gray-0 size-5 lg:size-6",
                  selectedGroup === type ? "rotate-180" : ""
                )}
              />
            )}
          </button>
        )}
        {showPopup && (
          <div className="absolute top-8 right-0 z-999 rounded-[16px] bg-white p-2.5 shadow-[0px_2px_10px_rgba(0,0,0,0.08)] lg:p-3">
            {["CHANGE_ORDER", "DELETE"].map((mode) => {
              const Icon = mode === "CHANGE_ORDER" ? UpsideDown : Trash;
              return (
                <button
                  key={mode}
                  type="button"
                  className={cn(
                    "flex w-29 items-center gap-2 rounded-lg p-2 text-[13px] font-normal text-gray-100 lg:w-auto lg:p-3 lg:text-[15px]",
                    selectedPopupMode === mode ? "bg-gray-700" : ""
                  )}
                  onClick={() => {
                    if (selectedPopupMode === mode) {
                      setSelectedPopupMode(null);
                    } else {
                      setSelectedPopupMode(mode as "CHANGE_ORDER" | "DELETE");
                    }
                    setShowPopup(false);
                  }}
                >
                  <Icon className="size-5 text-gray-100" />
                  {mode === "CHANGE_ORDER" ? "순서 변경" : "옵션 삭제"}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedGroup === type && (
        <>
          <div className="h-4 shrink-0" />
          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden md:justify-start">
            {fields.length ? (
              <div className="hide-scrollbar flex min-h-0 flex-col gap-4 overflow-y-auto whitespace-pre-line md:h-79 lg:h-100">
                <DragList
                  items={fields}
                  onReorder={handleReorder}
                  canDrag={selectedPopupMode === "CHANGE_ORDER"}
                  keyExtractor={(field) => field.id}
                  renderItem={(field, index) => {
                    const group = form.watch(
                      `${optionGroupsName}.${index}` as
                        | "requiredOptionGroups.0"
                        | "optionalOptionGroups.0"
                    );
                    return (
                      <div className="flex w-full items-center gap-3" key={field.id}>
                        <div
                          className={cn(
                            "flex w-full flex-col rounded-xl border border-gray-600 p-3 lg:p-4",
                            group.menuOptions.length > 0 ? "gap-3" : ""
                          )}
                        >
                          <div className="flex flex-1 flex-col">
                            <Input
                              placeholder="옵션명을 입력해주세요."
                              {...form.register(
                                `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${index}.name`
                              )}
                              disabled={!canEdit}
                            />
                            <div className="my-4 h-px w-full bg-gray-600" />
                            {group.menuOptions.length > 0 && (
                              <div className="flex flex-col gap-2 lg:gap-3">
                                {group.menuOptions.map(
                                  (_: { name: string; price: string }, optionIndex: number) => (
                                    <div
                                      className="flex items-center gap-2"
                                      key={`${field.id}-${optionIndex}`}
                                    >
                                      <Input
                                        className="flex-1 border-gray-600 md:border-gray-400 lg:h-12"
                                        placeholder="하위 옵션명을 입력해주세요."
                                        {...form.register(
                                          `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${index}.menuOptions.${optionIndex}.name`
                                        )}
                                        disabled={!canEdit}
                                      />
                                      <div className="relative flex-1">
                                        <Input
                                          className="border-gray-600 md:border-gray-400 lg:h-12 lg:pr-9"
                                          placeholder="ex. 33,000"
                                          value={group.menuOptions[optionIndex]?.price || ""}
                                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            const fieldPath =
                                              `${type === "MANDATORY" ? "required" : "optional"}OptionGroups.${index}.menuOptions.${optionIndex}.price` as Parameters<
                                                typeof form.setValue
                                              >[0];
                                            form.setValue(fieldPath, formatPrice(e.target.value));
                                          }}
                                          disabled={!canEdit}
                                        />
                                      </div>
                                      {canEdit && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveSingleOption(index, optionIndex)
                                          }
                                        >
                                          <Minus className="size-5 text-gray-300" />
                                        </button>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          {canEdit && (
                            <Button
                              type="button"
                              color="grey"
                              responsive
                              responsiveButtons={{
                                lg: {
                                  buttonSize: "custom",
                                  className:
                                    "h-8 rounded-lg border border-gray-600 bg-[F7F7F7]! gap-2 text-sm font-medium text-gray-100",
                                },
                                md: {
                                  buttonSize: "sm",
                                  className:
                                    "h-8! border border-gray-600 bg-[F7F7F7]! gap-1 text-xs font-normal text-gray-100",
                                },
                                sm: {
                                  buttonSize: "sm",
                                  className:
                                    "h-8! border border-gray-600 bg-[F7F7F7]! gap-1 text-xs font-normal text-gray-100",
                                },
                              }}
                              onClick={() => handleAddOption(index)}
                            >
                              하위 옵션 추가
                              <Plus className="size-4 text-gray-100" />
                            </Button>
                          )}
                        </div>
                        {selectedPopupMode && (
                          <button
                            type="button"
                            className="center h-8 w-8 rounded-lg border border-gray-600"
                            onClick={() => handleChangeOrderOption(index)}
                          >
                            {selectedPopupMode === "DELETE" ? (
                              <Trash className="text-gray-0 size-5" />
                            ) : (
                              <DragDrop className="text-gray-0 size-5" />
                            )}
                          </button>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <span className="text-xs font-normal text-gray-300 lg:text-sm">
                  현재 등록된 {text} 옵션이 없습니다.
                </span>
              </div>
            )}
            {canEdit && (
              <div className="mt-4 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  responsive
                  responsiveButtons={{
                    lg: {
                      buttonSize: "sm",
                      className: "border border-gray-600 rounded-lg w-full",
                    },
                    md: {
                      buttonSize: "sm",
                      className: "border border-gray-600 w-full h-8!",
                    },
                    sm: {
                      buttonSize: "sm",
                      className: "border border-gray-600 w-full h-8!",
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
