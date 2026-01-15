import { useState } from "react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import Lottie from "lottie-react";
import { overlay } from "overlay-kit";
import useMediaQuery from "react-responsive";
import { useNavigate } from "react-router-dom";
import successApplication from "@/assets/json/success-application.json";
import { Plus, Settings, Trash, UpsideDown } from "@/components/icons";
import MobileTitle from "@/components/layout/MobileTitle";
import Button from "@/components/ui/Button/Button";
import { DragList } from "@/components/ui/Drag/DragList";
import CategoryModal from "@/pages/main/owner/menus/CategoryModal";
import MenuCard from "@/pages/main/owner/menus/MenuCard";
import MenuDeleteAlert from "@/pages/main/owner/menus/MenuDeleteAlert";
import MenuDetailModal from "@/pages/main/owner/menus/MenuDetailModal";
import { CATEGORIES_MOCK, MENUS_MOCK } from "@/pages/main/owner/menus/mock";
import type { Menu } from "@/types/domain/menu";

function MainMenuPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 959 });

  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");
  const [checkedMenus, setCheckedMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState(CATEGORIES_MOCK);

  const filteredMenus =
    selectedCategory === "all"
      ? MENUS_MOCK
      : MENUS_MOCK.filter((menu) => menu.categoryId === selectedCategory);

  const [menus, setMenus] = useState<Menu[]>(filteredMenus);
  const [originalMenus, setOriginalMenus] = useState<Menu[]>(filteredMenus);

  const hasCategory = categories.length > 0;

  const [isSaving, setIsSaving] = useState(false);
  const [isChangedMenuOrder, setIsChangedMenuOrder] = useState(false);
  const [changeOrdersList, setChangeOrdersList] = useState<
    {
      sourceId: string;
      targetId: string;
      where: "PREV" | "NEXT";
    }[]
  >([]);

  const handleCategoryChange = (categoryId: string) => {
    const newFilteredMenus =
      categoryId === "all"
        ? MENUS_MOCK
        : MENUS_MOCK.filter((menu) => menu.categoryId === categoryId);

    setSelectedCategory(categoryId);
    setMenus(newFilteredMenus);
    setOriginalMenus(newFilteredMenus);
    setCheckedMenus([]);
  };

  const handleOpenCategoryModal = () => {
    overlay.open((overlayProps) => (
      <CategoryModal {...overlayProps} categories={categories} onSave={setCategories} />
    ));
  };

  const handleOpenMenuDetailModal = (menuId: string) => {
    overlay.open((overlayProps) => (
      <MenuDetailModal {...overlayProps} entry="detail" menuId={menuId} />
    ));
  };

  const handleOpenCreateMenuModal = () => {
    overlay.open((overlayProps) => <MenuDetailModal {...overlayProps} entry="create" />);
  };

  const handleOpenMenuDeleteAlert = () => {
    overlay.open((overlayProps) => (
      <MenuDeleteAlert {...overlayProps} deleteItems={checkedMenus} />
    ));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    changeOrdersList.forEach(() => {
      // TODO: 메뉴 순서 변경 로직 구현
    });

    setOriginalMenus(menus);
    setChangeOrdersList([]);
    setIsChangedMenuOrder(false);
    setIsSaving(false);
  };

  const handleResetChanges = () => {
    setMenus(originalMenus);
    setChangeOrdersList([]);
    setIsChangedMenuOrder(false);
  };

  const handleStartChangeOrder = () => {
    setOriginalMenus(menus);
    setIsChangedMenuOrder(true);
  };

  return hasCategory ? (
    <div className="hide-scrollbar w-full overflow-x-hidden px-5 py-4.5 md:px-0">
      <MobileTitle>메뉴 관리</MobileTitle>
      <div className="flex w-full shrink-0 flex-col justify-between gap-5 py-5 md:pt-6 md:pb-2 lg:flex-row lg:items-center">
        <div className="hide-scrollbar flex flex-1 shrink-0 items-center gap-1 overflow-x-auto md:gap-2 lg:gap-3">
          <Button
            color="grey"
            responsive
            responsiveButtons={{
              lg: {
                buttonSize: "custom",
                className:
                  "shrink-0 size-12 rounded-xl bg-gray-700 items-center justify-center p-0",
              },
              md: {
                buttonSize: "custom",
                className: "rounded-xl shrink-0 size-9 bg-gray-700 items-center justify-center p-0",
              },
              sm: {
                buttonSize: "custom",
                className: "rounded-xl shrink-0 size-9 bg-gray-700 items-center justify-center p-0",
              },
            }}
            onClick={() => !isChangedMenuOrder && handleOpenCategoryModal()}
            disabled={isChangedMenuOrder}
          >
            <Settings className="size-4.5 text-gray-300" />
          </Button>
          {[{ categoryId: "all", name: "전체" }, ...categories].map((category) => {
            const isSelected = selectedCategory === category.categoryId;
            return (
              <Button
                key={category.categoryId}
                color="black"
                variant={isSelected || isChangedMenuOrder ? "default" : "outline"}
                responsive
                responsiveButtons={{
                  lg: {
                    buttonSize: "lg",
                    className: isSelected
                      ? "h-10!"
                      : isChangedMenuOrder
                        ? "h-10! text-[15px] font-normal text-gray-300"
                        : "h-10! border-gray-300 text-[15px] font-normal text-gray-300",
                  },
                  md: {
                    buttonSize: "sm",
                    className: isSelected
                      ? ""
                      : isChangedMenuOrder
                        ? "text-s font-normal text-gray-300"
                        : "border-gray-300 text-s font-normal text-gray-300",
                  },
                  sm: {
                    buttonSize: "sm",
                    className: isSelected
                      ? ""
                      : isChangedMenuOrder
                        ? "text-s font-normal text-gray-300"
                        : "border-gray-300 text-s font-normal text-gray-300",
                  },
                }}
                onClick={() => handleCategoryChange(category.categoryId)}
                disabled={isChangedMenuOrder}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
        {isChangedMenuOrder ? (
          <div className="flex items-center justify-end gap-2">
            <div className="text-primary center h-9 rounded-lg bg-[#F220200A] px-4 text-xs font-normal md:text-sm">
              메뉴의 순서 변경은 메뉴를 꾹 누르신 후, 원하시는 자리로 메뉴를 이동해주세요
            </div>
            <Button
              variant="outline"
              className="button-sm"
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "저장중..." : "저장"}
            </Button>
            <Button color="grey" className="button-sm" onClick={handleResetChanges}>
              취소
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-4 lg:justify-start lg:gap-6">
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-300 lg:gap-2 lg:text-lg"
              onClick={handleStartChangeOrder}
            >
              <UpsideDown className="size-5 lg:size-6" />
              순서변경
            </button>
            <button
              className="text-status-error flex items-center gap-1 text-sm font-medium lg:gap-2 lg:text-lg"
              onClick={handleOpenMenuDeleteAlert}
            >
              <Trash className="size-5 lg:size-6" />
              삭제
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4 md:grid-cols-4 md:gap-x-3.5 lg:gap-x-6.5 lg:gap-y-10">
        {!isChangedMenuOrder && (
          <button
            className="center flex aspect-152/210 flex-col gap-1 rounded-xl border border-dashed border-gray-400 bg-gray-700 md:aspect-159/220 lg:aspect-329/440 lg:gap-2 lg:rounded-3xl"
            onClick={() => {
              if (isMobile === true || isMobile === undefined) {
                navigate(`/menus/create`, { state: { menuId: "create", entry: "create" } });
              } else {
                handleOpenCreateMenuModal();
              }
            }}
          >
            <Plus className="size-8 text-gray-100 lg:size-10" />
            <span className="text-gray-0 text-base font-medium lg:text-lg">메뉴 추가</span>
          </button>
        )}
        <DragList
          items={menus}
          onReorder={(items, sourceId, targetId, where) => {
            setMenus(items);
            setChangeOrdersList((prev) => [
              ...prev,
              { sourceId: String(sourceId), targetId: String(targetId), where },
            ]);
          }}
          canDrag={isChangedMenuOrder}
          keyExtractor={(item) => item.menuId}
          strategy={rectSortingStrategy}
          renderItem={(menu) => (
            <MenuCard
              className={isChangedMenuOrder ? "pointer-events-none" : ""}
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
              onClick={() => {
                if (isMobile === true || isMobile === undefined) {
                  navigate(`/menus/${menu.menuId}`, {
                    state: { menuId: menu.menuId, entry: "detail" },
                  });
                } else {
                  handleOpenMenuDetailModal(menu.menuId);
                }
              }}
              disabled={isChangedMenuOrder}
            />
          )}
        />
      </div>
    </div>
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-start gap-4 px-5 pt-6 md:flex-row md:justify-center md:px-0 md:pt-0">
      <MobileTitle />
      <div className="flex h-[calc(100%-160px)] w-full flex-col items-center justify-center gap-4 pt-5 md:h-auto md:w-auto md:justify-start md:gap-6 md:pt-0 lg:gap-10">
        <Lottie
          animationData={successApplication}
          loop={true}
          className="h-25 w-25 lg:h-40 lg:w-40"
        />
        <h2 className="text-gray-0 text-center text-base font-semibold whitespace-pre-line lg:text-2xl">{`음식의 카테고리가 등록되어있지 않아요.\n아래 버튼을 눌러 카테고리를 등록해주세요.`}</h2>
        <Button
          responsive
          responsiveButtons={{
            lg: { buttonSize: "lg", className: "w-100" },
            md: { buttonSize: "sm", className: "w-90" },
            sm: { buttonSize: "sm", className: "w-full absolute bottom-10 w-[calc(100%-72px)]" },
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
