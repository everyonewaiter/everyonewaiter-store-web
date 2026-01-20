export const DEVICE_KEY = {
  device: ["DEVICE"],
  deviceId: (deviceId: string) => [deviceId],
  storeId: (storeId: string) => [storeId],
  all: (deviceId: string, storeId: string) => [...DEVICE_KEY.device, deviceId, storeId],
};
