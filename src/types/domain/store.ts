export type ApplicationStatus = "APPLY" | "REJECT" | "APPROVE" | "REAPPLY";

export type PrinterLocation = "POS" | "HALL";

export type StoreStatus = "OPEN" | "CLOSE";

export interface StoreApplication {
  registrationId: string;
  accountid: string;
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
