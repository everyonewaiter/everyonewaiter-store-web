export const STORES_KEY = {
  store: ["STORE"],
  registrationId: (registrationId: string) => ["STORE", registrationId],
  storeDetail: (storeId: string) => ["STORE", storeId],
} as const;
