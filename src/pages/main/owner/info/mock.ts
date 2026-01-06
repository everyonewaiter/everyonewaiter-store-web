import type { StoreDetail } from "@/types/domain/store";

export const STORE_DETAIL_MOCK: StoreDetail = {
  storeId: "1",
  accountId: "1",
  name: "매장 1",
  ceoName: "홍길동",
  address: "서울시 강남구 역삼동",
  landline: "02-1234-5678",
  license: "1234567890",
  image: "https://via.placeholder.com/150",
  status: "OPEN",
  lastOpenedAt: "2025-01-01 12:00:00",
  lastClosedAt: "2025-01-01 12:00:00",
  setting: {
    ksnetDeviceNo: "1234567890",
    extraTableCount: 10,
    printerLocation: "POS",
    showMenuPopup: true,
    showOrderTotalPrice: true,
    showOrderMenuImage: true,
    countryOfOrigins: [
      { item: "돼지고기", origin: "국내산" },
      { item: "소고기", origin: "국내산" },
    ],
    staffCallOptions: ["직원 호출", "포장"],
  },
  createdAt: "2025-01-01 12:00:00",
  updatedAt: "2025-01-01 12:00:00",
};
