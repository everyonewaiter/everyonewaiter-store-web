import { useMemo, useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { categoryQueries } from "@/api/categories/queries";
import { menuQueries } from "@/api/menus/queries";
import { useStoreId } from "@/stores/useStoreId";
import type { Menu } from "@/types/domain/menu";

function useMenu() {
  const { storeId } = useStoreId();
  const getCategories = useQuery(categoryQueries.getCategories({ storeId: storeId! }));

  const [manuallySelectedCategory, setManuallySelectedCategory] = useState<string | null>(null);
  const [manuallyOrderedMenus, setManuallyOrderedMenus] = useState<Menu[] | null>(null);

  const selectedCategory = useMemo(() => {
    return manuallySelectedCategory ?? getCategories.data?.[0]?.categoryId ?? "";
  }, [manuallySelectedCategory, getCategories.data]);

  const getMenus = useQuery(
    menuQueries.getMenus({ storeId: storeId!, categoryId: selectedCategory ?? "" })
  );

  const allMenusQueries = useQueries({
    queries:
      getCategories.data?.map((category) =>
        menuQueries.getMenus({ storeId: storeId!, categoryId: category.categoryId })
      ) ?? [],
  });

  const allMenus =
    selectedCategory === "all"
      ? allMenusQueries.flatMap((query) => query.data ?? [])
      : getMenus.data?.filter((menu) => menu.categoryId === selectedCategory);

  const menus = useMemo(() => {
    return manuallyOrderedMenus ?? allMenus ?? [];
  }, [manuallyOrderedMenus, allMenus]);

  const setMenus = (newMenus: Menu[]) => {
    setManuallyOrderedMenus(newMenus);
  };

  const handleSetSelectedCategory = (categoryId: string) => {
    setManuallySelectedCategory(categoryId);
    setManuallyOrderedMenus(null);
  };

  const resetManuallyOrderedMenus = () => {
    setManuallyOrderedMenus(null);
  };

  return {
    storeId,
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    getCategories,
    menus,
    setMenus,
    resetManuallyOrderedMenus,
  };
}

export default useMenu;
