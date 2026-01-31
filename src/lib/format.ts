import type { ChangeEvent } from "react";

export const getFormattedMenuName: <T extends { name: string }>(menus: T[]) => string = (menus) => {
  if (!menus.length) return "-";
  if (menus.length === 1) return `${menus[0].name}`;
  return `${menus[0].name} 외 ${menus.length - 1}개`;
};

export const formatPrice = (value: string) => {
  const numbers = value.replaceAll(/\D/g, "");

  if (numbers === "") return numbers;

  return Number(numbers).toLocaleString("ko-KR");
};

export const formatPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
  const numbers = e.target.value.replaceAll(/\D/g, "");
  const len = numbers.length;

  const [start, mid, end] = [0, 3, 7];

  if (len === 0) {
    return "";
  } else if (len <= mid) {
    return numbers;
  } else if (len <= end) {
    return `${numbers.slice(start, mid)}-${numbers.slice(mid)}`;
  } else if (len <= mid + end) {
    return `${numbers.slice(start, mid)}-${numbers.slice(mid, end - 1)}-${numbers.slice(end - 1)}`;
  } else if (len === 11) {
    return `${numbers.slice(start, mid)}-${numbers.slice(mid, end)}-${numbers.slice(end)}`;
  } else {
    const sliced = numbers.slice(0, 11);
    return `${sliced.slice(start, mid)}-${sliced.slice(mid, end)}-${sliced.slice(end)}`;
  }
};

export const formatStorePhoneNumber = (value: string) => {
  const numbers = value.replaceAll(/\D/g, "");
  const len = numbers.length;

  if (len === 0) {
    return "";
  }

  // 02-0000-0000 (2자리-4자리-4자리)
  if (numbers.startsWith("02")) {
    const sliced = numbers.slice(0, 10);
    if (len <= 2) {
      return sliced;
    } else if (len <= 6) {
      return `${sliced.slice(0, 2)}-${sliced.slice(2)}`;
    } else {
      return `${sliced.slice(0, 2)}-${sliced.slice(2, 6)}-${sliced.slice(6)}`;
    }
  }

  // 0XX-XXX-XXXX (3자리-3자리-4자리)
  const sliced = numbers.slice(0, 10);
  if (len <= 3) {
    return sliced;
  } else if (len <= 6) {
    return `${sliced.slice(0, 3)}-${sliced.slice(3)}`;
  } else {
    return `${sliced.slice(0, 3)}-${sliced.slice(3, 6)}-${sliced.slice(6)}`;
  }
};

export const formatBusinessNumber = (e: ChangeEvent<HTMLInputElement>) => {
  const numbers = e.target.value.replaceAll(/\D/g, "");
  const len = numbers.length;

  if (len === 0) {
    return "";
  } else if (len <= 3) {
    return numbers;
  } else if (len <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    const sliced = numbers.slice(0, 10);
    return `${sliced.slice(0, 3)}-${sliced.slice(3, 5)}-${sliced.slice(5)}`;
  }
};
