import type { ContentWithPagination } from "@/types/pagination";

export type ApplicationStatus = "APPLY" | "REJECT" | "APPROVE" | "REAPPLY";

export type PrinterLocation = "POS" | "HALL";
export type StoreStatus = "OPEN" | "CLOSE";

export interface StoreApplication {
  registrationId: string;
  accountId: string;
  name: string;
  ceoName: string;
  address: string;
  landline: string;
  license: string;
  image: string;
  status: ApplicationStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export type StoreApplicationList = ContentWithPagination<StoreApplication[]>;

export interface StoreApplicationWithPagination {
  content: StoreApplication[];
  page: number;
  size: number;
  pageSkipSize: number;
  count: number;
  fastForwardPage: number;
  fastBackwardPage: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface StoreSetting {
  ksnetDeviceNo: string;
  extraTableCount: number;
  printerLocation: PrinterLocation;
  showMenuPopup: boolean;
  showOrderTotalPrice: boolean;
  showOrderMenuImage: boolean;
  countryOfOrigins: { item: string; origin: string }[];
  staffCallOptions: string[];
}

export interface StoreDetail {
  storeId: string;
  accountId: string;
  name: string;
  ceoName: string;
  address: string;
  landline: string;
  license: string;
  image: string;
  status: StoreStatus;
  lastOpenedAt: string;
  lastClosedAt: string;
  setting: StoreSetting;
  createdAt: string;
  updatedAt: string;
}

export interface SimpleStore {
  storeId: string;
  name: string;
}
