import { rectSortingStrategy } from "@dnd-kit/sortable";
import { overlay } from "overlay-kit";
import useMediaQuery from "react-responsive";
import { useNavigate } from "react-router-dom";
import { menuQueries } from "@/api/menus/queries";
import { Plus, Settings, Trash, UpsideDown } from "@/components/icons";
import MobileTitle from "@/components/layout/MobileTitle";
import Button from "@/components/ui/Button/Button";
import { DragList } from "@/components/ui/Drag/DragList";
import useCheckMenu from "@/hooks/menu/useCheckMenu";
import useMenu from "@/hooks/menu/useMenu";
import useMenuMove from "@/hooks/menu/useMenuMove";
import { queryClient } from "@/lib/query-client";
import CategoryEmptyState from "@/pages/main/owner/menus/CategoryEmptyState";
import CategoryModal from "@/pages/main/owner/menus/CategoryModal";
import MenuCard from "@/pages/main/owner/menus/MenuCard";
import MenuDeleteAlert from "@/pages/main/owner/menus/MenuDeleteAlert";
import MenuDetailModal from "@/pages/main/owner/menus/MenuDetailModal";
import { useStoreId } from "@/stores/useStoreId";
import type { Menu } from "@/types/domain/menu";

function MainMenuPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 959 });
  const { storeId } = useStoreId();

  const { selectedCategory, setSelectedCategory, getCategories, menus, setMenus } = useMenu();
  const {
    isChangedToMenuOrder,
    isSubmittingOrderChange,
    changeToMenuOrder,
    saveMoves,
    resetMoves,
    addToChangeList,
  } = useMenuMove();
  const { checkedMenus, toggleCheckMenu, resetCheckedMenus } = useCheckMenu();

  /**
   * 카테고리 모달 열기 기능
   */
  const handleOpenCategoryModal = () => {
    overlay.open((overlayProps) => (
      <CategoryModal {...overlayProps} categories={getCategories.data ?? []} />
    ));
  };

  /**
   * 메뉴 추가 모달 열기 기능
   */
  const handleOpenCreateMenuModal = () => {
    overlay.open((overlayProps) => (
      <MenuDetailModal
        {...overlayProps}
        entry="create"
        initialCategoryId={selectedCategory === "all" ? "" : selectedCategory}
      />
    ));
  };

  /**
   * 메뉴 상세 모달 열기 기능
   */
  const handleOpenMenuDetailModal = (menu: Menu) => {
    overlay.open((overlayProps) => (
      <MenuDetailModal
        initialCategoryId={menu.categoryId}
        {...overlayProps}
        entry="detail"
        menuId={menu.menuId}
      />
    ));
  };

  /**
   * 메뉴 삭제 알림 모달 열기 기능
   */
  const handleOpenMenuDeleteAlert = () => {
    overlay.open((overlayProps) => (
      <MenuDeleteAlert {...overlayProps} deleteItems={checkedMenus} />
    ));
  };

  /**
   * 카테고리 데이터 미리 가져오기 기능
   * @param categoryId 카테고리 ID
   */
  const handlePrefetch = (categoryId: string) => {
    if (isChangedToMenuOrder) return;
    if (categoryId === selectedCategory) return;
    queryClient.prefetchQuery(menuQueries.getMenus({ storeId: storeId!, categoryId }));
  };

  /**
   * 현재 카테고리 변경 기능
   */
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    resetCheckedMenus();
  };

  const categoryLgClassName = (isSelected: boolean) => {
    if (isSelected) return "h-10!";
    if (isChangedToMenuOrder) return "h-10! text-[15px] font-normal text-gray-300";
    return "h-10! border-gray-300 text-[15px] font-normal text-gray-300";
  };

  const categoryMdSmClassName = (isSelected: boolean) => {
    if (isSelected) return "";
    if (isChangedToMenuOrder) return "text-s font-normal text-gray-300";
    return "border-gray-300 text-s font-normal text-gray-300";
  };

  if (getCategories.isLoading) return null;

  return getCategories.data && getCategories.data.length > 0 ? (
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
                  "shrink-0 size-10 py-1 rounded-xl bg-gray-700 items-center justify-center",
              },
              md: {
                buttonSize: "custom",
                className: "rounded-xl shrink-0 size-9 bg-gray-700 items-center justify-center p-0",
              },
              sm: {
                buttonSize: "custom",
                className:
                  "rounded-xl shrink-0 size-10 bg-gray-700 items-center justify-center p-0",
              },
            }}
            onClick={() => !isChangedToMenuOrder && handleOpenCategoryModal()}
            disabled={isChangedToMenuOrder}
            aria-label="카테고리 설정 버튼"
          >
            <Settings className="size-5 text-gray-300 lg:size-6" />
          </Button>
          {[...(getCategories.data ?? [])].map((category) => {
            const isSelected = selectedCategory === category.categoryId;
            return (
              <Button
                key={category.categoryId}
                color="black"
                variant={isSelected || isChangedToMenuOrder ? "default" : "outline"}
                responsive
                responsiveButtons={{
                  lg: {
                    buttonSize: "lg",
                    className: categoryLgClassName(isSelected),
                  },
                  md: {
                    buttonSize: "sm",
                    className: categoryMdSmClassName(isSelected),
                  },
                  sm: {
                    buttonSize: "sm",
                    className: categoryMdSmClassName(isSelected),
                  },
                }}
                onClick={() => handleCategoryChange(category.categoryId)}
                onMouseEnter={() => handlePrefetch(category.categoryId)}
                disabled={isChangedToMenuOrder}
              >
                {category.name}
              </Button>
            );
          })}
        </div>
        {isChangedToMenuOrder ? (
          <div className="flex items-center justify-end gap-2">
            <div className="text-primary center h-9 rounded-lg bg-[#F220200A] px-4 text-xs font-normal md:text-sm">
              메뉴의 순서 변경은 메뉴를 꾹 누르신 후, 원하시는 자리로 메뉴를 이동해주세요
            </div>
            <Button
              variant="outline"
              className="button-sm"
              disabled={isSubmittingOrderChange}
              onClick={saveMoves}
            >
              {isSubmittingOrderChange ? "저장중..." : "저장"}
            </Button>
            <Button color="grey" className="button-sm" onClick={resetMoves}>
              취소
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-4 lg:justify-start lg:gap-6">
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-300 lg:gap-2 lg:text-lg"
              onClick={changeToMenuOrder}
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
        {!isChangedToMenuOrder && !getCategories.isLoading && (
          <button
            className="center flex aspect-152/210 flex-col gap-1 rounded-xl border border-dashed border-gray-400 bg-gray-700 md:aspect-159/220 lg:aspect-329/440 lg:gap-2 lg:rounded-3xl"
            onClick={() => {
              if (isMobile === true || isMobile === undefined) {
                navigate(`/menus/create`, { state: { categoryId: selectedCategory } });
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
            addToChangeList({ sourceId: String(sourceId), targetId: String(targetId), where });
          }}
          canDrag={isChangedToMenuOrder}
          keyExtractor={(item) => item.menuId}
          strategy={rectSortingStrategy}
          renderItem={(menu, index) => (
            <MenuCard
              className={isChangedToMenuOrder ? "pointer-events-none" : ""}
              key={menu.menuId}
              menu={menu}
              isChecked={checkedMenus.includes(menu)}
              onCheckedChange={() => toggleCheckMenu(menu)}
              onClick={() => {
                if (isMobile === true || isMobile === undefined) {
                  navigate(`/menus/${menu.menuId}/${menu.categoryId}`);
                } else {
                  handleOpenMenuDetailModal(menu);
                }
              }}
              disabled={isChangedToMenuOrder}
              index={index}
            />
          )}
        />
      </div>
    </div>
  ) : (
    <CategoryEmptyState />
  );
}

export default MainMenuPage;
