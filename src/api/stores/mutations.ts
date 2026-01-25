import { mutationOptions } from "@tanstack/react-query";
import { instance } from "@/api";
import type { CreateStoreSchema } from "@/schema/create-store.schema";
import type { StoreDetail } from "@/types/domain/store";

export const storesMutations = {
  createStore: () =>
    mutationOptions({
      mutationFn: async (data: CreateStoreSchema) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("ceoName", data.ceoName);
        formData.append("address", data.address);
        if (data.detailAddress) {
          formData.append("detailAddress", data.detailAddress);
        }
        formData.append("landline", data.landline);
        formData.append("license", data.license);
        formData.append("file", data.file!);

        const response = await instance.post("/stores/registrations", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      },
    }),
  reapplyStore: () =>
    mutationOptions({
      mutationFn: async ({
        registrationId,
        ...data
      }: CreateStoreSchema & { registrationId: string }) => {
        const response = await instance.put(`/stores/registrations/${registrationId}`, {
          name: data.name,
          ceoName: data.ceoName,
          address: data.detailAddress ? `${data.address} ${data.detailAddress}` : data.address,
          landline: data.landline,
          license: data.license,
        });
        return response.data;
      },
    }),
  reapplyStoreWithFile: () =>
    mutationOptions({
      mutationFn: async ({
        registrationId,
        ...data
      }: CreateStoreSchema & { registrationId: string }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("ceoName", data.ceoName);
        formData.append("address", data.address);
        if (data.detailAddress) {
          formData.append("detailAddress", data.detailAddress);
        }
        formData.append("landline", data.landline);
        formData.append("license", data.license);
        formData.append("file", data.file!);

        const response = await instance.put(
          `/stores/registrations/${registrationId}/with-image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      },
    }),
  updateStore: () =>
    mutationOptions({
      mutationFn: async (data: Pick<StoreDetail, "landline" | "setting" | "storeId">) => {
        const response = await instance.put(`/stores/${data.storeId}`, data);
        return response.data;
      },
    }),
};
