import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { categoryQueries } from "@/api/categories/queries";
import { FormErrorMessage } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import Button from "@/components/ui/Button/Button";
import type { ResponsiveButtonProps, ScreenSize } from "@/components/ui/Button/Button.types";
import Dropdown from "@/components/ui/Dropdown";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/Switch";
import { formatPrice } from "@/lib/format";
import cn from "@/lib/utils";
import type { MenuSchema } from "@/schema/menu.schema";
import { useStoreId } from "@/stores/useStoreId";
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
  const { storeId } = useStoreId();
  const { data: categories } = useQuery(categoryQueries.getCategories({ storeId: storeId! }));

  const form = useFormContext<MenuSchema>();
  const currentLabel = form.watch("label");
  const currentSpicy = form.watch("spicy");
  const currentState = form.watch("state");
  const currentCategoryId = form.watch("categoryId");
  const currentPrintEnabled = form.watch("printEnabled");

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
          dropdownItems={
            categories?.map((category) => ({
              id: category.categoryId,
              name: category.name,
            })) ?? []
          }
          value={currentCategoryId}
          defaultText={
            categories?.find((category) => category.categoryId === currentCategoryId)?.name ??
            "카테고리를 선택해주세요."
          }
          disabled={!canEdit}
          triggerClassName={form.formState.errors.categoryId && "border-status-error"}
          onChange={(item) => {
            if (canEdit) {
              form.setValue("categoryId", item.id);
            }
          }}
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
        inputProps={{
          placeholder: "가격을 입력해주세요.",
          onChange: (e) => form.setValue("price", formatPrice(e.target.value)),
        }}
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
              {Object.keys(LABEL_TRNASLATE).map((labelKey) => {
                const displayLabel = LABEL_TRNASLATE[labelKey as MenuLabel];
                const isSelected = currentLabel === labelKey;
                return (
                  <Button
                    key={labelKey}
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
                    onClick={() => {
                      if (canEdit) {
                        form.setValue("label", labelKey as MenuLabel);
                      }
                    }}
                    disabled={!canEdit}
                  >
                    {displayLabel}
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
            {[1, 2, 3].map((spicy) => {
              const isSelected = currentSpicy === spicy;
              return (
                <Button
                  key={spicy}
                  color={isSelected ? "primary" : "grey"}
                  variant="outline"
                  responsive
                  responsiveButtons={{
                    lg: {
                      buttonSize: "sm",
                      className: cn("w-fit rounded-[40px]!", isSelected ? "" : "border-gray-500!"),
                    },
                    md: commonStyle(),
                    sm: commonStyle(),
                  }}
                  onClick={() => {
                    if (canEdit) {
                      form.setValue("spicy", isSelected ? 0 : spicy);
                    }
                  }}
                  disabled={!canEdit}
                >
                  {`🌶️`.repeat(spicy)}
                </Button>
              );
            })}
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
            {(Object.keys(STATE_TRNASLATE) as MenuState[]).map((stateKey) => {
              const state = STATE_TRNASLATE[stateKey];
              const isSelected = currentState === stateKey;
              return (
                <Button
                  key={stateKey}
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
                  onClick={() => {
                    if (canEdit) {
                      form.setValue("state", stateKey);
                    }
                  }}
                  disabled={!canEdit}
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
        <Switch
          disabled={!canEdit}
          checked={currentPrintEnabled}
          onCheckedChange={(checked) => {
            if (canEdit) {
              form.setValue("printEnabled", checked);
            }
          }}
        />
      </div>
    </>
  );
}

export default MenuDetailForm;
