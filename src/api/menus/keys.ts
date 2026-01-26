const MENU = "MENU";

export const MENUS_KEY = {
  menu: () => [MENU],
  menuDetail: (menuId: string) => [MENU, menuId],
};
