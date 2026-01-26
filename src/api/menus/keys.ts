const MENU = "MENU";

export const MENUS_KEY = {
  menu: [MENU],
  menus: (categoryId: string) => [MENU, categoryId],
  menuDetail: (menuId: string) => [MENU, "detail", menuId],
};
