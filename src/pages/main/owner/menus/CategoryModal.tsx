import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CATEGORY_KEY } from "@/api/categories/keys";
import { categoryMutations } from "@/api/categories/mutations";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { DragDrop, Plus, Trash, UpsideDown } from "@/components/icons";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import { DragList } from "@/components/ui/Drag/DragList";
import { errorResponse } from "@/lib/error-response";
import { queryClient } from "@/lib/query-client";
import cn from "@/lib/utils";
import { useStoreId } from "@/stores/useStoreId";
import type { MoveRequest } from "@/types/api";
import type { Category } from "@/types/domain/menu";
import type { ModalProps } from "@/types/overlay";

interface CategoryModalProps extends ModalProps {
  categories: Category[];
}

function CategoryModal({ isOpen, close, categories }: Readonly<CategoryModalProps>) {
  const { storeId } = useStoreId();

  const form = useForm({ defaultValues: { categories } });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  const { mutateAsync: moveCategories } = useMutation(categoryMutations.moveCategories());
  const { mutateAsync: createCategory } = useMutation(categoryMutations.createCategory());

  useEffect(() => {
    form.reset({ categories });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  const [mode, setMode] = useState<"CREATE" | "CHANGE_ORDER">("CREATE");

  const [changeOrdersList, setChangeOrdersList] = useState<MoveRequest[]>([]);

  /**
   * 카테고리 저장 기능
   */
  const handleSave = async () => {
    try {
      const formCategories = form.getValues("categories");
      const newCategories = formCategories.filter(
        (fc) => !categories.some((c) => c.categoryId === fc.categoryId)
      );

      for (const category of newCategories) {
        await createCategory({ storeId: storeId!, data: { name: category.name } });
      }

      toast.success("카테고리 저장이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY.category() });
      close();
    } catch (error) {
      toast.error(errorResponse(error).data.message);
    }
  };

  /**
   * 카테고리 순서 저장 기능
   */
  const handleSaveChanges = async () => {
    try {
      for (const { sourceId, targetId, where } of changeOrdersList) {
        await moveCategories({ storeId: storeId!, sourceId, targetId, where });
      }

      setMode("CREATE");
      setChangeOrdersList([]);
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY.category() });
    } catch (error) {
      toast.error(errorResponse(error).data.message);
    }
  };

  /**
   * 카테고리 순서 초기화 기능
   */
  const handleResetChanges = () => {
    form.reset({ categories });
    setMode("CREATE");
    setChangeOrdersList([]);
  };

  return (
    <Form {...form}>
      <Modal
        title="카테고리"
        open={isOpen}
        onOpenChange={(open) => !open && close()}
        footerContent={{
          action: (
            <Button
              color={mode === "CREATE" ? "primary" : "black"}
              responsive
              responsiveButtons={{
                lg: { buttonSize: "xl", className: "w-full outline-none" },
                md: { buttonSize: "sm", className: "w-full" },
                sm: { buttonSize: "sm", className: "w-full" },
              }}
              onClick={mode === "CREATE" ? handleSave : handleSaveChanges}
            >
              {mode === "CREATE" ? "저장하기" : "순서 저장하기"}
            </Button>
          ),
          cancel: (
            <Button
              color="grey"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "xl", className: "w-30" },
                md: { buttonSize: "sm", className: "w-25" },
                sm: { buttonSize: "sm", className: "w-25" },
              }}
              onClick={mode === "CREATE" ? close : handleResetChanges}
            >
              {mode === "CREATE" ? "닫기" : "취소"}
            </Button>
          ),
        }}
        topRightContent={
          mode === "CREATE" ? (
            <button
              className="flex gap-1.5 text-sm font-medium text-gray-300"
              onClick={() => setMode("CHANGE_ORDER")}
            >
              <UpsideDown className="size-5 text-gray-300" />
              순서변경
            </button>
          ) : (
            <></>
          )
        }
      >
        <div className="flex w-full flex-1 flex-col overflow-hidden">
          <div className="hide-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto md:gap-3">
            <DragList
              items={fields}
              onReorder={(items, sourceId, targetId, where) => {
                form.setValue("categories", items);
                setChangeOrdersList((prev) => [...prev, { sourceId, targetId, where }]);
              }}
              className="flex flex-col gap-3"
              canDrag={mode === "CHANGE_ORDER"}
              keyExtractor={(item) => item.categoryId}
              renderItem={(category, index) => (
                <FormField
                  key={category.categoryId}
                  name={`categories.${index}.name`}
                  control={form.control}
                  label={`카테고리 ${index + 1}`}
                  inputProps={{
                    placeholder: "카테고리를 입력해주세요",
                    readOnly: mode === "CHANGE_ORDER",
                    className: mode === "CHANGE_ORDER" ? "cursor-default" : "",
                  }}
                  postfix={
                    <Button
                      variant="outline"
                      className={cn(
                        "center size-7 rounded-lg md:size-7 lg:size-10 lg:rounded-xl",
                        mode === "CREATE" ? "border-status-error" : "border-gray-600"
                      )}
                      onClick={() => {
                        if (mode === "CREATE") remove(index);
                      }}
                    >
                      {mode === "CREATE" ? (
                        <Trash className="text-status-error size-4 lg:size-6" />
                      ) : (
                        <DragDrop className="size-4 text-gray-100 lg:size-6" />
                      )}
                    </Button>
                  }
                />
              )}
            />
          </div>
          {mode === "CREATE" && (
            <div className="pt-5 lg:pt-1">
              <Button
                type="button"
                color="grey"
                variant="ghost"
                responsive
                responsiveButtons={{
                  lg: {
                    buttonSize: "lg",
                    className: "mt-4 w-full border-dashed font-normal!",
                  },
                  md: {
                    buttonSize: "sm",
                    className: "w-full border-dashed rounded-xl!",
                  },
                  sm: {
                    buttonSize: "sm",
                    className: "w-full border-dashed rounded-xl!",
                  },
                }}
                onClick={() => append({ categoryId: String(fields.length + 1), name: "" })}
              >
                <Plus className="size-7" /> 카테고리 추가
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </Form>
  );
}

export default CategoryModal;
