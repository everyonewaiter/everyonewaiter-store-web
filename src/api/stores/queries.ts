import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/api";
import { STORES_KEY } from "@/api/stores/keys";
import type {
  SimpleStore,
  StoreApplication,
  StoreApplicationWithPagination,
  StoreDetail,
} from "@/types/domain/store";

export const storesQueries = {
  getRegistrations: (page: number, size: number = 20) =>
    queryOptions<StoreApplicationWithPagination>({
      queryKey: [STORES_KEY.store, "registrations"],
      queryFn: async () => {
        const response = await instance.get(`/stores/registrations?page=${page}&size=${size}`);
        return response.data;
      },
    }),
  getRegistrationDetail: (registrationId: string) =>
    queryOptions<StoreApplication>({
      queryKey: [STORES_KEY.registrationId(registrationId)],
      queryFn: async () => {
        const response = await instance.get(`/stores/registrations/${registrationId}`);
        return response.data;
      },
    }),
  getStores: () =>
    queryOptions<{ stores: SimpleStore[] }>({
      queryKey: [STORES_KEY.store],
      queryFn: async () => {
        const response = await instance.get(`/stores`);
        return response.data;
      },
    }),
  getStoreDetail: (storeId: string) =>
    queryOptions<StoreDetail>({
      queryKey: [STORES_KEY.storeDetail(storeId)],
      queryFn: async () => {
        const response = await instance.get(`/stores/${storeId}`);
        return response.data;
      },
    }),
};
