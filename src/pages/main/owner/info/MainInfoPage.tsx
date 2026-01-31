import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { storesQueries } from "@/api/stores/queries";
import { Skeleton } from "@/components/feedback/Skeleton";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { formatBusinessNumber, formatStorePhoneNumber } from "@/lib/format";
import cn from "@/lib/utils";
import InfoBottomButtonGroup from "@/pages/main/owner/info/InfoBottomButtonGroup";
import InfoOriginBox from "@/pages/main/owner/info/InfoOriginBox";
import type { StoreInfoSchema } from "@/schema/store-info.schema";
import { useStoreId } from "@/stores/useStoreId";

function MainInfoPage() {
  const { storeId } = useStoreId();
  const { data: storeDetail, isLoading } = useQuery(storesQueries.getStoreDetail(storeId!));

  const [isCancelling, setIsCancelling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
        name: storeDetail.name ?? "",
        license: storeDetail.license ?? "",
        address: storeDetail.address,
        landline: storeDetail.landline ?? "",
        origins: storeDetail.setting.countryOfOrigins.map((origin) => ({
          id: crypto.randomUUID(),
          item: origin.item,
          origin: origin.origin,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeDetail, isCancelling]);

  const origins = useWatch({ control: form.control, name: "origins" });

  return (
    <div
      className={cn(
        "flex h-full w-full justify-center px-5 pt-6 md:px-0 md:pt-10",
        origins.length > 4 ? "items-start" : "items-start md:items-start lg:items-center lg:pb-6"
      )}
    >
      <div className="flex w-full flex-col gap-6 md:w-95 lg:w-120 lg:gap-8">
        {isLoading || !storeDetail?.accountId ? (
          <>
            <div className="flex flex-col gap-2 lg:gap-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="mt-2 flex flex-col gap-3 md:mt-0 lg:gap-4">
              <Skeleton.FieldGroup total={4} />
              <Skeleton className="h-22 rounded-xl" />
              <Skeleton className="h-8.5" />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2 lg:gap-3">
              <h2 className="text-gray-0 text-lg font-semibold lg:text-2xl">매장 정보</h2>
              <p className="text-xs font-normal whitespace-pre-line text-gray-300 lg:text-sm">{`등록된 매장 정보를 확인할 수 있습니다.\n변경된 정보가 있다면 언제든지 수정해 주세요.`}</p>
            </div>
            <Form {...form}>
              <form className="mt-2 flex flex-col gap-3 md:mt-0 lg:gap-4">
                {isLoading ? (
                  <>
                    <Skeleton.FieldGroup total={4} />
                    <Skeleton className="h-24 rounded-xl" />
                  </>
                ) : (
                  <>
                    <FormField control={form.control} name="name" label="상호명" disabled />
                    <FormField
                      control={form.control}
                      name="license"
                      label="사업자번호"
                      disabled
                      inputProps={{
                        onChange: (e) => form.setValue("license", formatBusinessNumber(e)),
                      }}
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
                  </>
                )}
              </form>
              <InfoBottomButtonGroup
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                storeDetail={storeDetail}
                onCancel={() => {
                  setIsCancelling(true);
                  setIsEditing(false);
                }}
              />
            </Form>
          </>
        )}
      </div>
    </div>
  );
}

export default MainInfoPage;
