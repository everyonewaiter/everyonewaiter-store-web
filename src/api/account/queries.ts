import { queryOptions } from "@tanstack/react-query";
import { instance } from "@/api";
import { ACCOUNT_KEY } from "@/api/account/key";

export const accountQueries = {
  getMe: (userId: string) =>
    queryOptions({
      queryKey: [ACCOUNT_KEY.userId(userId)],
      queryFn: async () => {
        const response = await instance.get(`/accounts/me`);
        return response.data;
      },
    }),
  getAccountByPhoneNumber: (phoneNumber: string) =>
    queryOptions({
      queryKey: ["phoneNumber"],
      queryFn: async () => {
        const response = await instance.get(`/accounts/phone-number/${phoneNumber}/me`);
        return response.data;
      },
    }),
};
