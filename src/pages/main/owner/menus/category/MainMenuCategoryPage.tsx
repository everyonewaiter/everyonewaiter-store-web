import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CATEGORY_KEY } from "@/api/categories/keys";
import { categoryMutations } from "@/api/categories/mutations";
import { categoryQueries } from "@/api/categories/queries";
import Spinner from "@/components/feedback/Spinner";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { Plus } from "@/components/icons";
import MobileTitle from "@/components/layout/MobileTitle";
import Button from "@/components/ui/Button/Button";
import { errorResponse } from "@/lib/error-response";
import { queryClient } from "@/lib/query-client";
import cn from "@/lib/utils";
import { useStoreId } from "@/stores/useStoreId";

function MainMenuCategoryPage() {
  const navigate = useNavigate();

  const { storeId } = useStoreId();
  const { data } = useQuery(categoryQueries.getCategories({ storeId: storeId! }));
  const { mutateAsync: createCategory } = useMutation(categoryMutations.createCategory());

  const form = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      categories: [{ id: 1, name: "카테고리 1" }],
    },
  });

  const categories = useWatch({ control: form.control, name: "categories" });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (data) {
      form.reset({
        categories: data?.map((category) => ({
          id: Number(category.categoryId),
          name: category.name,
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleAddCategory = () => {
    if (categories.at(-1)?.name === "") return;
    form.setValue("categories", [...categories, { id: categories.length + 1, name: "" }]);
  };

  const handleSubmit = form.handleSubmit(async () => {
    setIsSubmitting(true);
    try {
      categories.forEach(async (categoryInput) => {
        await createCategory({ storeId: storeId!, data: { name: categoryInput.name } });
      });
      toast.success("카테고리 저장이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEY.category() });
      navigate("/menus", { replace: true });
    } catch (error) {
      setIsSubmitting(false);
      toast.error(errorResponse(error).data.message);
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col gap-4 px-5 py-3 md:gap-0 md:p-0"
      >
        <MobileTitle>카테고리</MobileTitle>
        <div
          className={cn(
            "flex h-full w-full py-4 md:justify-center md:py-6 lg:py-0",
            categories.length > 5 ? "items-start" : "items-start lg:items-center"
          )}
        >
          <div className="flex w-full flex-col gap-5 md:w-75 lg:w-120 lg:gap-6">
            <div className="flex flex-col gap-2 md:gap-1 lg:gap-3">
              <h2 className="text-gray-0 text-lg font-semibold lg:text-2xl">카테고리</h2>
              <span className="md:text-s text-xs font-normal whitespace-pre-line text-gray-300 lg:text-sm">{`메뉴 카테고리를 등록하거나 수정할 수 있습니다.\n카테고리는 메뉴 정렬 및 노출에 활용됩니다.`}</span>
            </div>

            <div className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <FormField
                  key={category.id}
                  label={`카테고리 ${index + 1}`}
                  inputProps={{ placeholder: "카테고리를 입력해주세요", readOnly: isSubmitting }}
                  {...form.register(`categories.${index}.name`)}
                />
              ))}
              <Button
                type="button"
                color="grey"
                variant="ghost"
                responsive
                responsiveButtons={{
                  lg: { buttonSize: "lg", className: "h-10! w-full border-dashed font-normal!" },
                  md: { buttonSize: "sm", className: "w-full border-dashed" },
                  sm: { buttonSize: "sm", className: "w-full border-dashed" },
                }}
                onClick={handleAddCategory}
              >
                <Plus className="size-7" /> 카테고리 추가
              </Button>
            </div>

            <Button
              type="submit"
              responsive
              responsiveButtons={{
                lg: { buttonSize: "lg" },
                md: { buttonSize: "sm", className: "w-full" },
                sm: { buttonSize: "sm", className: "w-full" },
              }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : "저장"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default MainMenuCategoryPage;
