import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/api";
import { MENUS_KEY } from "@/api/menus/keys";
import type { Menu, MenuDetail } from "@/types/domain/menu";

export const menuQueries = {
  getMenus: ({ storeId, categoryId }: { storeId: string; categoryId: string }) =>
    queryOptions<{ menus: Menu[] }, Error, Menu[]>({
      queryKey: MENUS_KEY.menus(categoryId),
      queryFn: async () => {
        const response = await instance.get(`/stores/${storeId}/categories/${categoryId}/menus`);
        return response.data;
      },
      enabled: !!storeId && !!categoryId && categoryId !== "all",
      select: (data) => data?.menus,
    }),
  getMenuDetail: ({
    storeId,
    menuId,
    categoryId,
  }: {
    storeId: string;
    menuId: string;
    categoryId: string;
  }) =>
    queryOptions<MenuDetail>({
      queryKey: MENUS_KEY.menuDetail(menuId),
      queryFn: async () => {
        const response = await instance.get(
          `/stores/${storeId}/categories/${categoryId}/menus/${menuId}`
        );
        return response.data;
      },
      enabled: !!storeId && !!menuId && !!categoryId,
    }),
};
