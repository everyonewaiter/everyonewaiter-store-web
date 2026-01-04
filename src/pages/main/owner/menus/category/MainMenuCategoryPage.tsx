import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/form/Form";
import FormField from "@/components/form/FormField";
import { Plus } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import cn from "@/lib/utils";

function MainMenuCategoryPage() {
  const navigate = useNavigate();
  const form = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      categories: [{ id: 1, name: "카테고리 1" }],
    },
  });

  const categories = useWatch({ control: form.control, name: "categories" });

  const handleAddCategory = () => {
    if (categories.at(-1)?.name === "") return;
    form.setValue("categories", [...categories, { id: categories.length + 1, name: "" }]);
  };

  const handleSubmit = form.handleSubmit(() => {
    // TODO: 카테고리 저장 로직 구현
    navigate("/menus");
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "flex h-full justify-center md:py-6 lg:py-0",
            categories.length > 5 ? "items-start" : "items-center md:items-start"
          )}
        >
          <div className="flex flex-col md:w-75 md:gap-5 lg:w-120 lg:gap-6">
            <div className="flex flex-col md:gap-1 lg:gap-3">
              <h2 className="text-gray-0 font-semibold md:text-lg lg:text-2xl">카테고리</h2>
              <span className="md:text-s font-normal whitespace-pre-line text-gray-300 lg:text-sm">{`메뉴 카테고리를 등록하거나 수정할 수 있습니다.\n카테고리는 메뉴 정렬 및 노출에 활용됩니다.`}</span>
            </div>

            <div className="flex flex-col gap-3">
              {categories.map((category, index) => (
                <FormField
                  key={category.id}
                  label={`카테고리 ${index + 1}`}
                  inputProps={{ placeholder: "카테고리를 입력해주세요" }}
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
              }}
              onClick={handleSubmit}
            >
              확인
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default MainMenuCategoryPage;
