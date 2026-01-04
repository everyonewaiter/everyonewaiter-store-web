import { useState } from "react";
import Lottie from "lottie-react";
import { overlay } from "overlay-kit";
import { useNavigate } from "react-router-dom";
import successApplication from "@/assets/json/success-application.json";
import { Plus, Settings, Trash, UpsideDown } from "@/components/icons";
import Button from "@/components/ui/Button/Button";
import CategoryModal from "@/pages/main/owner/menus/CategoryModal";
import MenuCard from "@/pages/main/owner/menus/MenuCard";
import MenuDeleteAlert from "@/pages/main/owner/menus/MenuDeleteAlert";
import MenuDetailModal from "@/pages/main/owner/menus/MenuDetailModal";
import { CATEGORIES_MOCK, MENUS_MOCK } from "@/pages/main/owner/menus/mock";
import type { Menu } from "@/types/domain/menu";

function MainMenuPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");
  const [checkedMenus, setCheckedMenus] = useState<Menu[]>([]);

  // 카테고리 존재 여부 확인
  // const hasCategory = CATEGORIES_MOCK.length > 0;
  const hasCategory = true;

  const menus =
    selectedCategory === "all"
      ? MENUS_MOCK
      : MENUS_MOCK.filter((menu) => menu.categoryId === selectedCategory);

  const [isChangedMenuOrder, setIsChangedMenuOrder] = useState(false);

  /**
   * TODO:
   * @param menuId - 메뉴 ID
   */
  const handleOpenMenuDetailModal = () => {
    overlay.open((overlayProps) => <MenuDetailModal {...overlayProps} entry="detail" />);
  };

  const handleOpenCreateMenuModal = () => {
    overlay.open((overlayProps) => <MenuDetailModal {...overlayProps} entry="create" />);
  };

  const handleOpenCategoryModal = () => {
    overlay.open((overlayProps) => <CategoryModal {...overlayProps} />);
  };

  const handleOpenMenuDeleteAlert = () => {
    overlay.open((overlayProps) => <MenuDeleteAlert {...overlayProps} />);
  };

  const handleSaveChanges = () => {
    // TODO: 메뉴 순서 변경 로직 구현
    setIsChangedMenuOrder(false);
  };

  return hasCategory ? (
    <div className="w-full overflow-x-hidden">
      <div className="flex w-full shrink-0 justify-between gap-5 pt-6 pb-2 md:flex-col lg:flex-row lg:items-center">
        <div className="hide-scrollbar flex flex-1 shrink-0 items-center overflow-x-auto md:gap-2 lg:gap-3">
          <Button
            color="grey"
            responsive
            responsiveButtons={{
              lg: {
                buttonSize: "custom",
                className: "size-8 flex-shrink-0 bg-gray-700 rounded-xl",
              },
              md: {
                buttonSize: "custom",
                className: "size-8 flex-shrink-0 bg-gray-700 rounded-xl",
              },
            }}
            onClick={handleOpenCategoryModal}
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
                  md: {
                    buttonSize: "sm",
                    className: isSelected ? "" : "border-gray-300 text-s font-normal text-gray-300",
                  },
                }}
                onClick={() => setSelectedCategory(category.categoryId)}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
        {isChangedMenuOrder ? (
          <div className="flex items-center gap-2">
            <div className="text-primary center h-9 rounded-lg bg-[#F220200A] px-4 text-sm font-normal">
              메뉴의 순서 변경은 메뉴를 꾹 누르신 후, 원하시는 자리로 메뉴를 이동해주세요
            </div>
            <Button variant="outline" className="button-sm" onClick={handleSaveChanges}>
              저장
            </Button>
          </div>
        ) : (
          <div className="flex items-center md:gap-4 lg:gap-6">
            <button
              className="flex items-center font-medium text-gray-300 md:gap-1 md:text-sm lg:gap-2 lg:text-lg"
              onClick={() => setIsChangedMenuOrder(true)}
            >
              <UpsideDown className="md:size-5 lg:size-6" />
              순서변경
            </button>
            <button
              className="text-status-error flex items-center font-medium md:gap-1 md:text-sm lg:gap-2 lg:text-lg"
              onClick={handleOpenMenuDeleteAlert}
            >
              <Trash className="md:size-5 lg:size-6" />
              삭제
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 py-4 md:gap-x-3.5 md:gap-y-4 lg:gap-x-6.5 lg:gap-y-10">
        <button
          className="center flex flex-col rounded-xl border border-dashed border-gray-400 bg-gray-700 md:aspect-159/220 md:gap-1 lg:aspect-329/440 lg:gap-2 lg:rounded-3xl"
          onClick={handleOpenCreateMenuModal}
        >
          <Plus className="text-gray-100 md:size-8 lg:size-10" />
          <span className="text-gray-0 font-medium md:text-base lg:text-lg">메뉴 추가</span>
        </button>
        {menus.map((menu) => (
          <MenuCard
            key={menu.menuId}
            menu={menu}
            isChecked={checkedMenus.includes(menu)}
            onCheckedChange={() => {
              if (checkedMenus.includes(menu)) {
                setCheckedMenus(checkedMenus.filter((m) => m.menuId !== menu.menuId));
              } else {
                setCheckedMenus([...checkedMenus, menu]);
              }
            }}
            onClick={() => handleOpenMenuDetailModal()}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center md:gap-6 lg:gap-10">
        <Lottie
          animationData={successApplication}
          loop={true}
          className="md:h-25 md:w-25 lg:h-40 lg:w-40"
        />
        <h2 className="text-gray-0 text-center font-semibold whitespace-pre-line md:text-base lg:text-2xl">{`음식의 카테고리가 등록되어있지 않아요.\n아래 버튼을 눌러 카테고리를 등록해주세요.`}</h2>
        <Button
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg", className: "w-100" },
            md: { buttonSize: "sm", className: "w-90" },
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
