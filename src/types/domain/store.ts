type StoreStatus = "OPEN" | "CLOSE";
type PrinterLocation = "POS" | "HALL";

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
  setting: {
    ksnetDeviceNo: string;
    extraTableCount: number;
    printerLocation: PrinterLocation;
    showMenuPopup: boolean;
    showOrderTotalPrice: boolean;
    showOrderMenuImage: boolean;
    countryOfOrigins: { item: string; origin: string }[];
    staffCallOptions: string[];
  };
  createdAt: string;
  updatedAt: string;
}
