import type { Category, Menu } from "@/types/domain/menu";

export const CATEGORIES_MOCK: Category[] = [
  {
    categoryId: "1",
    name: "카테고리 1",
  },
  {
    categoryId: "2",
    name: "카테고리 2",
  },
  {
    categoryId: "3",
    name: "카테고리 3",
  },
  {
    categoryId: "4",
    name: "카테고리 4",
  },
];

export const MENUS_MOCK: Menu[] = [
  {
    menuId: "1",
    categoryId: "1",
    name: "메뉴 1",
    description: "메뉴 1 설명",
    price: 10000,
    spicy: 1,
    state: "DEFAULT",
    label: "BEST",
    image: "https://via.placeholder.com/150",
  },
  {
    menuId: "2",
    categoryId: "1",
    name: "메뉴 2",
    description: "메뉴 2 설명",
    price: 10000,
    spicy: 2,
    state: "HIDE",
    label: "DEFAULT",
    image: "https://via.placeholder.com/150",
  },
  {
    menuId: "3",
    categoryId: "1",
    name: "메뉴 3",
    description: "메뉴 3 설명",
    price: 10000,
    spicy: 3,
    state: "DEFAULT",
    label: "NEW",
    image: "https://via.placeholder.com/150",
  },
  {
    menuId: "4",
    categoryId: "1",
    name: "메뉴 4",
    description: "메뉴 4 설명",
    price: 10000,
    spicy: 4,
    state: "DEFAULT",
    label: "DEFAULT",
    image: "https://via.placeholder.com/150",
  },
  {
    menuId: "5",
    categoryId: "1",
    name: "메뉴 5",
    description: "메뉴 5 설명",
    price: 10000,
    spicy: 5,
    state: "DEFAULT",
    label: "DEFAULT",
    image: "https://via.placeholder.com/150",
  },
  {
    menuId: "6",
    categoryId: "1",
    name: "메뉴 6",
    description: "메뉴 6 설명",
    price: 10000,
    spicy: 6,
    state: "DEFAULT",
    label: "DEFAULT",
    image: "https://via.placeholder.com/150",
  },
];
