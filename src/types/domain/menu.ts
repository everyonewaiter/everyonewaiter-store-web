export interface Category {
  categoryId: string;
  name: string;
}

export type MenuState = "DEFAULT" | "HIDE" | "SOLD_OUT";
export type MenuLabel = "DEFAULT" | "NEW" | "BEST" | "RECOMMEND";
export type MenuOptionGroupType = "MANDATORY" | "OPTIONAL";

export interface Menu {
  menuId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  spicy: number;
  state: MenuState;
  label: MenuLabel;
  image: string;
}

interface MenuOption {
  name: string;
  price: number;
}
export interface MenuOptionGroup {
  menuOptionGroupId: string;
  name: string;
  type: MenuOptionGroupType;
  printEnabled: boolean;
  menuOptions: MenuOption[];
}

export interface MenuDetail extends Menu {
  printEnabled: boolean;
  menuOptionGroups: MenuOptionGroup[];
}
