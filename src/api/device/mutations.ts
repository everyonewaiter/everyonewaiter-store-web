import { mutationOptions } from "@tanstack/react-query";
import { instance } from "@/api";
import type { DeviceDetail } from "@/types/domain/device";

export const deviceMutations = {
  updateDevice: () =>
    mutationOptions({
      mutationFn: async (
        data: Pick<
          DeviceDetail,
          "name" | "purpose" | "tableNo" | "paymentType" | "deviceId" | "storeId"
        >
      ) => {
        const response = await instance.put(`/stores/${data.storeId}/devices/${data.deviceId}`, {
          name: data.name,
          purpose: data.purpose,
          tableNo: data.tableNo,
          paymentType: data.paymentType,
        });
        return response.data;
      },
    }),
  deleteDevice: () =>
    mutationOptions({
      mutationFn: async (data: Pick<DeviceDetail, "deviceId" | "storeId">) => {
        const response = await instance.delete(`/stores/${data.storeId}/devices/${data.deviceId}`);
        return response.data;
      },
    }),
};
