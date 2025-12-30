import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Settings, Trash, UpsideDown } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import MenuCard from "@/pages/main/owner/menus/MenuCard";
import { CATEGORIES_MOCK, MENUS_MOCK } from "@/pages/main/owner/menus/mock";
import type { Menu } from "@/types/domain/menu";

function MainMenuPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");
  const [checkedMenus] = useState<Menu[]>([]);
  const hasCategory = CATEGORIES_MOCK.length > 0;

  // 카테고리 존재 여부 확인

  return hasCategory ? (
    <div className="overflow-y-auto">
      <div className="flex items-center justify-between pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Button
            color="grey"
            responsive
            responsiveButtons={{
              lg: { buttonSize: "custom", className: "size-8 bg-gray-700 rounded-xl" },
            }}
          >
            <Settings className="size-4.5 text-gray-300" />
          </Button>
          {[{ categoryId: "all", name: "전체" }, ...CATEGORIES_MOCK].map((category) => {
            const isSelected = selectedCategory === category.categoryId;
            return (
              <Button
                key={category.categoryId}
                color="black"
                variant={isSelected ? "default" : "outline"}
                responsive
                responsiveButtons={{
                  lg: {
                    buttonSize: "lg",
                    className: isSelected
                      ? "h-10!"
                      : "h-10! border-gray-300 text-[15px] font-normal text-gray-300",
                  },
                }}
                onClick={() => setSelectedCategory(category.categoryId)}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-lg font-medium text-gray-300">
            <UpsideDown className="size-6" />
            순서변경
          </button>
          <button className="text-status-error flex items-center gap-2 text-lg font-medium">
            <Trash className="size-6" />
            삭제
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-x-6.5 gap-y-10 py-4">
        <button className="center flex aspect-329/440 flex-col gap-2 rounded-3xl border border-dashed border-gray-400 bg-gray-700">
          <Plus className="size-10 text-gray-100" />
          <span className="text-gray-0 text-lg font-medium">메뉴 추가</span>
        </button>
        {MENUS_MOCK.map((menu) => (
          <MenuCard
            key={menu.menuId}
            menu={menu}
            isChecked={checkedMenus.includes(menu)}
            // onCheckedChange={setCheckedMenus}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col gap-10">
        <h2 className="text-gray-0 text-center text-2xl font-semibold whitespace-pre-line">{`음식의 카테고리가 등록되어있지 않아요.\n아래 버튼을 눌러 카테고리를 등록해주세요.`}</h2>
        <Button
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg", className: "w-100" },
          }}
          onClick={() => navigate("/menus/category")}
        >
          카테고리 등록하기
        </Button>
      </div>
    </div>
  );
}

export default MainMenuPage;
