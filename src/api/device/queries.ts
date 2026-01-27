import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/api";
import { DEVICE_KEY } from "@/api/device/key";
import type { Device, DeviceDetail } from "@/types/domain/device";
import type { ContentWithPagination } from "@/types/pagination";

export const deviceQueries = {
  getDevices: (storeId: string, page: number, size: number = 20) =>
    queryOptions<ContentWithPagination<Device[]>>({
      queryKey: DEVICE_KEY.list(storeId, page, size),
      queryFn: async () => {
        const response = await instance.get(`/stores/${storeId}/devices?page=${page}&size=${size}`);
        return response.data;
      },
      enabled: !!storeId,
    }),
  getDeviceDetail: (storeId: string, deviceId: string) =>
    queryOptions<DeviceDetail>({
      queryKey: DEVICE_KEY.detail(storeId, deviceId),
      queryFn: async () => {
        const response = await instance.get(`/stores/${storeId}/devices/${deviceId}`);
        return response.data;
      },
      enabled: !!storeId && !!deviceId,
    }),
}; 
