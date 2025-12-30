export interface Category {
  categoryId: string;
  name: string;
}

type MenuState = "DEFAULT" | "HIDE" | "SOLD_OUT";
type MenuLabel = "DEFAULT" | "NEW" | "BEST" | "RECOMMEND";

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
