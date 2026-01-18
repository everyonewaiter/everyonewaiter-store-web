export type DevicePurpose = "POS" | "HALL" | "TABLE" | "WAITING";
export type DeviceState = "ACTIVE" | "INACTIVE";
export type DevicePaymentType = "POSTPAID" | "PREPAID";

export interface Device {
  deviceId: string;
  storeId: string;
  name: string;
  purpose: DevicePurpose;
  state: DeviceState;
  paymentType: DevicePaymentType;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceDetail extends Device {
  storeName: string;
  tableNo: number;
}
