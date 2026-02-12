import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryQueries } from "@/api/categories/queries";
import { menuQueries } from "@/api/menus/queries";
import { useStoreId } from "@/stores/useStoreId";
import type { Menu } from "@/types/domain/menu";

function useMenu() {
  const { storeId } = useStoreId();
  const getCategories = useQuery(categoryQueries.getCategories({ storeId: storeId! }));

  const [orderedMenus, setOrderedMenus] = useState<Menu[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSetSelectedCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setOrderedMenus(null);
  };

  const effectiveCategory = selectedCategory ?? getCategories.data?.[0]?.categoryId ?? "";

  const getMenus = useQuery(
    menuQueries.getMenus({ storeId: storeId!, categoryId: effectiveCategory })
  );

  const menus = getMenus.data?.filter((menu) => menu.categoryId === effectiveCategory);
  const setMenus = (newMenus: Menu[]) => setOrderedMenus(newMenus);

  return {
    storeId,
    selectedCategory: effectiveCategory,
    setSelectedCategory: handleSetSelectedCategory,
    getCategories,
    menus: orderedMenus || menus,
    setMenus,
    resetOrderedMenus: () => setOrderedMenus(null),
  };
}

export default useMenu;
