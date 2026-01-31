import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { storesMutations } from "@/api/stores/mutations";
import Spinner from "@/components/feedback/Spinner";
import { EditContained, Plus } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import { errorResponse } from "@/lib/error-response";
import type { StoreInfoSchema } from "@/schema/store-info.schema";
import { useStoreId } from "@/stores/useStoreId";
import type { StoreDetail } from "@/types/domain/store";

interface InfoBottomButtonGroupProps {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  storeDetail: StoreDetail;
  onCancel: () => void;
}

function InfoBottomButtonGroup({
  isEditing,
  setIsEditing,
  storeDetail,
  onCancel,
}: Readonly<InfoBottomButtonGroupProps>) {
  const { storeId } = useStoreId();

  const form = useFormContext<StoreInfoSchema>();
  const landline = useWatch({ control: form.control, name: "landline" });
  const origins = useWatch({ control: form.control, name: "origins" });

  const { mutate: updateStore } = useMutation(storesMutations.updateStore());

  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (!hasItem || !hasOrigin) {
        form.setError("origins", {
          message: "품목과 원산지를 모두 입력해주세요.",
        });
        return;
      }
    }

    updateStore(
      {
        storeId: storeId!,
        landline: landline || "",
        setting: {
          ...storeDetail?.setting,
          countryOfOrigins: origins,
        },
      },
      {
        onSuccess: () => {
          form.clearErrors("origins");
          form.setValue("origins", origins);
          setIsEditing(false);
        },
        onError: (error) => {
          const { data } = errorResponse(error);
          toast.error(data?.message);
        },
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  return (
    <>
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
            onClick={onCancel}
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
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
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
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <EditContained className="size-5 lg:size-6" />
          수정하기
        </Button>
      )}
    </>
  );
}

export default InfoBottomButtonGroup;
