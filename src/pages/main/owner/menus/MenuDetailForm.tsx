import { useFormContext } from "react-hook-form";
import { FormErrorMessage } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/Button/Button";
import type { ResponsiveButtonProps, ScreenSize } from "@/components/ui/Button/Button.types";
import Dropdown from "@/components/ui/Dropdown";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import cn from "@/lib/utils";
import { CATEGORIES_MOCK } from "@/pages/main/owner/menus/mock";
import type { MenuSchema } from "@/schema/menu.schema";
import type { MenuLabel, MenuState } from "@/types/domain/menu";

const STATE_TRNASLATE = {
  DEFAULT: "기본",
  HIDE: "숨김",
  SOLD_OUT: "품절",
};

const LABEL_TRNASLATE = {
  BEST: "BEST",
  NEW: "NEW",
  DEFAULT: "기본",
  RECOMMEND: "추천",
};

interface MenuDetailFormProps {
  canEdit: boolean;
  isDetail: boolean;
}

function MenuDetailForm({ canEdit, isDetail }: Readonly<MenuDetailFormProps>) {
  const categories = CATEGORIES_MOCK;

  const form = useFormContext<MenuSchema>();

  const commonStyle = (): ResponsiveButtonProps["responsiveButtons"][ScreenSize] => {
    return {
      buttonSize: "custom",
      className: cn(
        "w-fit px-3 h-7 rounded-[40px] text-xs font-normal",
        isDetail ? "cursor-default!" : "cursor-pointer!"
      ),
    };
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>카테고리</Label>
        <Dropdown
          dropdownItems={categories.map((category) => ({
            id: category.categoryId,
            name: category.name,
          }))}
          defaultText="카테고리를 선택해주세요."
          disabled={!canEdit}
          triggerClassName={form.formState.errors.categoryId && "border-status-error"}
        />
        {form.formState.errors.categoryId && (
          <FormErrorMessage>{form.formState.errors.categoryId.message}</FormErrorMessage>
        )}
      </div>
      <FormField
        control={form.control}
        name="name"
        label="메뉴명"
        inputProps={{ placeholder: "메뉴명을 입력해주세요." }}
        disabled={!canEdit}
      />
      <FormField
        control={form.control}
        name="description"
        label="메뉴 설명"
        inputProps={{ placeholder: "메뉴 설명을 입력해주세요." }}
        disabled={!canEdit}
      />
      {/* TODO: onChange 가격 포맷팅 */}
      <FormField
        control={form.control}
        name="price"
        label="가격"
        inputProps={{ placeholder: "가격을 입력해주세요." }}
        disabled={!canEdit}
      />
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label>태그</Label>
          {isDetail ? (
            <Button
              variant="outline"
              responsive
              responsiveButtons={{
                lg: {
                  buttonSize: "sm",
                  className: cn(
                    "w-fit rounded-[40px]!",
                    isDetail ? "cursor-default!" : "cursor-pointer!"
                  ),
                },
                md: commonStyle(),
                sm: commonStyle(),
              }}
            >
              기본
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {["기본", "BEST", "추천", "NEW"].map((label) => {
                const isSelected = LABEL_TRNASLATE[form.getValues("label") as MenuLabel] === label;
                return (
                  <Button
                    key={label}
                    variant="outline"
                    color={isSelected ? "primary" : "grey"}
                    responsive
                    responsiveButtons={{
                      lg: {
                        buttonSize: "sm",
                        className: cn("w-fit rounded-[40px]!", !isSelected && "border-gray-500!"),
                      },
                      md: commonStyle(),
                      sm: commonStyle(),
                    }}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        <div className="h-px w-full bg-gray-600" />
        {isDetail ? (
          <Button
            variant="outline"
            responsive
            responsiveButtons={{
              lg: {
                buttonSize: "sm",
                className: "w-fit rounded-[40px]! cursor-default!",
              },
              md: commonStyle(),
              sm: commonStyle(),
            }}
          >
            🌶️
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((spicy) => (
              <Button
                key={spicy}
                color={form.getValues("spicy") === spicy ? "primary" : "grey"}
                variant="outline"
                responsive
                responsiveButtons={{
                  lg: {
                    buttonSize: "sm",
                    className: cn(
                      "w-fit rounded-[40px]!",
                      form.getValues("spicy") === spicy ? "" : "border-gray-500!"
                    ),
                  },
                  md: commonStyle(),
                  sm: commonStyle(),
                }}
              >
                {`🌶️`.repeat(spicy)}
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label>상태</Label>
        {isDetail ? (
          <Button
            variant="outline"
            responsive
            responsiveButtons={{
              lg: {
                buttonSize: "sm",
                className: cn(
                  "w-fit rounded-[40px]!",
                  isDetail ? "cursor-default!" : "cursor-pointer!"
                ),
              },
              md: commonStyle(),
              sm: commonStyle(),
            }}
          >
            기본
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {["기본", "숨김", "품절"].map((state) => {
              const isSelected = STATE_TRNASLATE[form.getValues("state") as MenuState] === state;
              return (
                <Button
                  key={state}
                  variant="outline"
                  color={isSelected ? "primary" : "grey"}
                  responsive
                  responsiveButtons={{
                    lg: {
                      buttonSize: "sm",
                      className: cn("w-fit rounded-[40px]!", !isSelected && "border-gray-500!"),
                    },
                    md: commonStyle(),
                    sm: commonStyle(),
                  }}
                >
                  {state}
                </Button>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-0 text-xs font-normal lg:text-sm">주방 프린터에 출력하기</span>
        <Switch disabled={!canEdit} checked={form.getValues("printEnabled")} />
      </div>
    </>
  );
}

export default MenuDetailForm;
