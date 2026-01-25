import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { storesMutations } from "@/api/stores/mutations";
import { storesQueries } from "@/api/stores/queries";
import Spinner from "@/components/feedback/Spinner";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { EditContained, Plus } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import { errorResponse } from "@/lib/error-response";
import { formatBusinessNumber, formatStorePhoneNumber } from "@/lib/format";
import cn from "@/lib/utils";
import InfoOriginBox from "@/pages/main/owner/info/InfoOriginBox";
import type { StoreInfoSchema } from "@/schema/store-info.schema";

function MainInfoPage() {
  const storeId = localStorage.getItem("storeId");
  const { data: storeDetail } = useQuery(storesQueries.getStoreDetail(storeId!));
  const { mutate: updateStore } = useMutation(storesMutations.updateStore());

  const form = useForm<StoreInfoSchema>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      license: "",
      address: "",
      landline: "",
      origins: [],
    },
  });

  useEffect(() => {
    if (storeDetail) {
      form.reset({
        name: storeDetail.name,
        license: storeDetail.license,
        address: storeDetail.address,
        landline: storeDetail.landline,
        origins: storeDetail.setting.countryOfOrigins.map((origin) => ({
          id: crypto.randomUUID(),
          item: origin.item,
          origin: origin.origin,
        })),
      });
    }
  }, [storeDetail, form]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const origins = useWatch({ control: form.control, name: "origins" });
  const landline = useWatch({ control: form.control, name: "landline" });

  const addOrigin = () => {
    if (origins.at(-1)?.item === "") return;
    form.setValue("origins", [...origins, { id: crypto.randomUUID(), item: "", origin: "" }]);
  };

  const handleSave = () => {
    if (!storeDetail) return;

    setIsSubmitting(true);
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

    const filteredOrigins = origins
      .filter((origin) => origin.item.trim().length > 0 && origin.origin.trim().length > 0)
      .map((origin) => ({
        ...origin,
        item: origin.item.trim(),
        origin: origin.origin.trim(),
      }));

    updateStore(
      {
        storeId: storeId!,
        landline: landline || "",
        setting: {
          ...storeDetail?.setting,
          countryOfOrigins: filteredOrigins,
        },
      },
      {
        onSuccess: () => {
          form.clearErrors("origins");
          form.setValue("origins", filteredOrigins);
          setIsEditing(false);
          setIsSubmitting(false);
        },
        onError: (error) => {
          const { data } = errorResponse(error);
          toast.error(data?.message);
        },
      }
    );
  };

  return (
    <div
      className={cn(
        "flex h-full w-full justify-center px-5 pt-6 md:px-0 md:pt-10",
        origins.length > 4 ? "items-start" : "items-start md:items-start lg:items-center lg:pb-6"
      )}
    >
      <div className="flex w-full flex-col gap-6 md:w-95 lg:w-120 lg:gap-8">
        <div className="flex flex-col gap-2 lg:gap-3">
          <h2 className="text-gray-0 text-lg font-semibold lg:text-2xl">매장 정보</h2>
          <p className="text-xs font-normal whitespace-pre-line text-gray-300 lg:text-sm">{`등록된 매장 정보를 확인할 수 있습니다.\n변경된 정보가 있다면 언제든지 수정해 주세요.`}</p>
        </div>
        <Form {...form}>
          <form className="mt-2 flex flex-col gap-3 md:mt-0 lg:gap-4">
            <FormField control={form.control} name="name" label="상호명" disabled />
            <FormField
              control={form.control}
              name="license"
              label="사업자번호"
              disabled
              inputProps={{ onChange: (e) => form.setValue("license", formatBusinessNumber(e)) }}
            />
            <FormField control={form.control} name="address" label="주소" disabled />
            <FormField
              control={form.control}
              name="landline"
              label="매장 전화번호"
              disabled={!isEditing}
              inputProps={{
                onChange: (e) => form.setValue("landline", formatStorePhoneNumber(e)),
                maxLength: 13,
              }}
            />
            <InfoOriginBox isEditing={isEditing} />
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

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              color="grey"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg", className: "text-lg !text-medium" },
                md: { buttonSize: "sm", className: "!h-8.5" },
                sm: { buttonSize: "sm", className: "!h-8.5" },
              }}
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              취소하기
            </Button>
            <Button
              color="black"
              variant={isEditing ? "default" : "outline"}
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg", className: "text-lg !text-medium flex-1" },
                md: { buttonSize: "sm", className: "!h-8.5 flex-1" },
                sm: { buttonSize: "sm", className: "!h-8.5 flex-1" },
              }}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "저장하기"}
            </Button>
          </div>
        ) : (
          <Button
            color="black"
            variant={isEditing ? "default" : "outline"}
            responsive
            responsiveButtons={{
              lg: { buttonSize: "lg", className: "text-lg !text-medium" },
              md: { buttonSize: "sm", className: "!h-8.5" },
              sm: { buttonSize: "sm", className: "!h-8.5" },
            }}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <EditContained className="size-5 lg:size-6" />
            수정하기
          </Button>
        )}
      </div>
    </div>
  );
}

export default MainInfoPage;
