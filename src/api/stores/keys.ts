const STORE = "STORE";
const REGISTRATION = "REGISTRATION";

export const STORES_KEY = {
  store: () => [STORE],
  storeList: () => [STORE, "list"],
  storeDetail: (storeId: string) => [STORE, 'detail', storeId],
  registration: () => [REGISTRATION],
  registrationList: (page: number) => [REGISTRATION, "list", page],
  registrationDetail: (registrationId: string) => [REGISTRATION, "detail", registrationId],
};
