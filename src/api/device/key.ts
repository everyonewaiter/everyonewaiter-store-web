const DEVICE = "DEVICE";

export const DEVICE_KEY = {
  device: () => [DEVICE],
  list: (storeId: string, page: number, size: number) => [DEVICE, "LIST", storeId, page, size],
  listPrefix: (storeId: string) => [DEVICE, "LIST", storeId],
  detail: (storeId: string, deviceId: string) => [DEVICE, "DETAIL", storeId, deviceId],
};
