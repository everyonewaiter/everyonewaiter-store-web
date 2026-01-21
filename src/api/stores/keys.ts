const STORE = "STORE";

export const STORES_KEY = {
  store: () => [STORE],
  stores: () => [STORE, "list"],
  storeDetail: (storeId: string) => [STORE, storeId],
  registrations: () => [STORE, "registrations"],
  registrationList: (page: number) => [STORE, "registrations", page],
  registrationDetail: (registrationId: string) => [STORE, "registrations", registrationId],
};
