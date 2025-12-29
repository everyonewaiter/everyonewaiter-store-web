import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { EditContained, Plus } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import cn from "@/lib/utils";
import InfoOriginBox from "@/pages/main/owner/info/InfoOriginBox";
import { STORE_DETAIL_MOCK } from "@/pages/main/owner/info/mock";
import type { StoreInfoSchema } from "@/schema/store-info.schema";

function MainInfoPage() {
  const data = STORE_DETAIL_MOCK;

  const form = useForm<StoreInfoSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: data.name,
      // TODO: 사업자번호 포매팅 추가
      license: data.license,
      address: data.address,
      origins: data.setting.countryOfOrigins.map((origin) => ({
        id: crypto.randomUUID(),
        item: origin.item,
        origin: origin.origin,
      })),
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const origins = useWatch({ control: form.control, name: "origins" });

  const addOrigin = () => {
    if (origins.at(-1)?.item === "") return;
    form.setValue("origins", [...origins, { id: crypto.randomUUID(), item: "", origin: "" }]);
  };

  const handleDelete = (id: string) => {
    form.setValue(
      "origins",
      origins.filter((origin) => origin.id !== id)
    );
  };

  const handleSave = () => {
    if (isEditing) {
      const origins = form.getValues("origins");

      for (const origin of origins) {
        const hasItem = origin.item.trim().length > 0;
        const hasOrigin = origin.origin.trim().length > 0;

        if ((hasItem && !hasOrigin) || (!hasItem && hasOrigin)) {
          form.setError("origins", {
            message: "품목과 원산지를 모두 입력해주세요.",
          });
          return;
        }
      }

      const filteredOrigins = origins.filter(
        (origin) => origin.item.trim().length > 0 && origin.origin.trim().length > 0
      );

      // TODO: 저장 로직
      form.clearErrors("origins");
      form.setValue("origins", filteredOrigins);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={cn(
        "flex h-full w-full justify-center px-5 pt-10 md:px-0",
        origins.length > 4 ? "items-start md:pt-10" : "py-6 md:items-start lg:items-center"
      )}
    >
      <div className="flex w-full flex-col gap-6 md:w-68 lg:w-120 lg:gap-8">
        <div className="flex flex-col gap-2 lg:gap-3">
          <h2 className="text-gray-0 text-lg font-semibold lg:text-2xl">매장 정보</h2>
          <p className="text-xs font-normal whitespace-pre-line text-gray-300 lg:text-sm">{`등록된 매장 정보를 확인할 수 있습니다.\n변경된 정보가 있다면 언제든지 수정해 주세요.`}</p>
        </div>
        <Form {...form}>
          <form className="mt-2 flex flex-col gap-3 md:mt-0 lg:gap-4">
            <FormField control={form.control} name="name" label="상호명" disabled />
            <FormField control={form.control} name="license" label="사업자번호" disabled />
            <FormField
              control={form.control}
              name="address"
              label="주소"
              disabled
              inputProps={{
                onChange: (e) => {
                  // TODO: 사업자번호 포매팅
                  form.setValue("address", e.target.value);
                },
              }}
            />
            <InfoOriginBox isEditing={isEditing} onDelete={handleDelete} />
          </form>
        </Form>
        {isEditing && (
          <Button
            color="black"
            variant="ghost"
            responsive
            responsiveButtons={{
              lg: {
                buttonSize: "md",
                className: "!h-10 border-2 border-dashed border-gray-300 rounded-xl",
              },
              md: { buttonSize: "sm", className: "border-dashed" },
              sm: { buttonSize: "sm", className: "border-dashed" },
            }}
            onClick={addOrigin}
          >
            <Plus className="size-7 text-gray-300" />
          </Button>
        )}
        <Button
          color="black"
          variant={isEditing ? "default" : "outline"}
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg", className: "text-lg !text-medium" },
            md: { buttonSize: "sm", className: "!h-8.5" },
            sm: { buttonSize: "sm", className: "!h-8.5" },
          }}
          onClick={handleSave}
        >
          {!isEditing && <EditContained className="size-5 lg:size-6" />}
          {isEditing ? "저장하기" : "수정하기"}
        </Button>
      </div>
    </div>
  );
}

export default MainInfoPage;
