import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { DragDrop, Plus, Trash, UpsideDown } from "@/components/icons";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button/Button";
import cn from "@/lib/utils";
import { CATEGORIES_MOCK } from "@/pages/main/owner/menus/mock";
import type { ModalProps } from "@/types/overlay";

function CategoryModal({ isOpen, close }: Readonly<ModalProps>) {
  const form = useForm({
    defaultValues: {
      categories:
        CATEGORIES_MOCK.map((category) => ({
          id: category.categoryId,
          name: category.name,
        })) ?? [],
    },
  });

  const [mode, setMode] = useState<"CREATE" | "CHANGE_ORDER">("CREATE");
  const isCreating = mode === "CREATE";
  const isChangingOrder = mode === "CHANGE_ORDER";

  const categories = useWatch({ control: form.control, name: "categories" });

  const handleAddCategory = () => {
    form.setValue("categories", [...categories, { id: String(categories.length + 1), name: "" }]);
  };

  const handleDeleteCategory = (index: number) => {
    form.setValue(
      "categories",
      categories.filter((_, i) => i !== index)
    );
  };

  /**
   *
   * @param index - 카테고리 인덱스
   */
  const handleChangeOrderCategory = () => {
    // TODO: 카테고리 순서 변경 로직 구현
    setMode("CHANGE_ORDER");
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
              }}
            >
              {isCreating ? "저장하기" : "순서 저장하기"}
            </Button>
          ),
          cancel: (
            <Button
              color="grey"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "xl", className: "w-30 outline-none" },
                md: { buttonSize: "sm", className: "w-25" },
              }}
              onClick={() => (isCreating ? close() : setMode("CREATE"))}
            >
              {isCreating ? "닫기" : "취소"}
            </Button>
          ),
        }}
        topRightContent={
          isCreating ? (
            <Button
              color="grey"
              responsive
              responsiveButtons={{
                lg: {
                  buttonSize: "md",
                  className:
                    "h-full! rounded-3xl! gap-1.5 items-center text-gray-300 text-sm font-medium px-4!",
                },
                md: { buttonSize: "sm", className: "bg-transparent" },
              }}
              onClick={() => setMode("CHANGE_ORDER")}
            >
              <UpsideDown className="size-5 text-gray-300" />
              순서변경
            </Button>
          ) : (
            <></>
          )
        }
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="hide-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto md:gap-4">
            {categories.map((category, index) => (
              <FormField
                key={category.id}
                label={`카테고리 ${index + 1}`}
                inputProps={{
                  placeholder: "카테고리를 입력해주세요",
                  readOnly: isChangingOrder,
                  className: isChangingOrder ? "cursor-default" : "",
                }}
                {...form.register(`categories.${index}.name`)}
                postfix={
                  <Button
                    variant="outline"
                    className={cn(
                      "center h-10 w-10 rounded-xl",
                      isCreating ? "border-status-error" : "border-gray-600"
                    )}
                    onClick={() => {
                      if (mode === "CREATE") {
                        handleDeleteCategory(index);
                      } else {
                        handleChangeOrderCategory();
                      }
                    }}
                  >
                    {isCreating ? (
                      <Trash className="text-status-error size-5" />
                    ) : (
                      <DragDrop className="size-6 text-gray-100" />
                    )}
                  </Button>
                }
              />
            ))}
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
