import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { DragDrop, Plus, Trash, UpsideDown } from "@/components/icons";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import { DragList } from "@/components/ui/Drag/DragList";
import cn from "@/lib/utils";
import type { Category } from "@/types/domain/menu";
import type { ModalProps } from "@/types/overlay";

interface CategoryModalProps extends ModalProps {
  categories: Category[];
  onSave?: (categories: Category[]) => void;
}

function CategoryModal({ isOpen, close, categories, onSave }: Readonly<CategoryModalProps>) {
  const form = useForm({
    defaultValues: {
      categories,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  useEffect(() => {
    form.reset({ categories });
  }, [categories, form]);

  const [mode, setMode] = useState<"CREATE" | "CHANGE_ORDER">("CREATE");
  const isCreating = mode === "CREATE";
  const isChangingOrder = mode === "CHANGE_ORDER";

  const [changeOrdersList, setChangeOrdersList] = useState<
    { sourceId: string; targetId: string; where: "PREV" | "NEXT" }[]
  >([]);

  const handleAddCategory = () => append({ categoryId: String(fields.length + 1), name: "" });
  const handleDeleteCategory = (index: number) => remove(index);

  const handleSave = () => {
    // TODO: 카테고리 저장 API 호출

    onSave?.(form.getValues().categories);
    close();
  };

  const handleSaveChanges = async () => {
    changeOrdersList.forEach(() => {
      // TODO: 카테고리 순서 변경 API 호출 (sourceId, targetId, where)
    });

    onSave?.(form.getValues().categories);
    setMode("CREATE");
    setChangeOrdersList([]);
  };

  const handleResetChanges = () => {
    // TODO: 카테고리 순서 변경 초기화 로직 구현

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
              color={isCreating ? "primary" : "black"}
              responsive
              responsiveButtons={{
                lg: { buttonSize: "xl", className: "w-full outline-none" },
                md: { buttonSize: "sm", className: "w-full" },
                sm: { buttonSize: "sm", className: "w-full" },
              }}
              onClick={isCreating ? handleSave : handleSaveChanges}
            >
              {isCreating ? "저장하기" : "순서 저장하기"}
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
              onClick={isCreating ? close : handleResetChanges}
            >
              {isCreating ? "닫기" : "취소"}
            </Button>
          ),
        }}
        topRightContent={
          isCreating ? (
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
          <div className="hide-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto pb-4 md:gap-3 md:pb-0">
            <DragList
              items={fields}
              onReorder={(items, sourceId, targetId, where) => {
                form.setValue("categories", items);
                setChangeOrdersList((prev) => [...prev, { sourceId, targetId, where }]);
              }}
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
                    readOnly: isChangingOrder,
                    className: isChangingOrder ? "cursor-default" : "",
                  }}
                  postfix={
                    <Button
                      variant="outline"
                      className={cn(
                        "center size-7 rounded-lg md:size-7 lg:size-10 lg:rounded-xl",
                        isCreating ? "border-status-error" : "border-gray-600"
                      )}
                      onClick={() => {
                        if (mode === "CREATE") {
                          handleDeleteCategory(index);
                        }
                      }}
                    >
                      {isCreating ? (
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
          {isCreating && (
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
              onClick={handleAddCategory}
            >
              <Plus className="size-7" /> 카테고리 추가
            </Button>
          )}
        </div>
      </Modal>
    </Form>
  );
}

export default CategoryModal;
