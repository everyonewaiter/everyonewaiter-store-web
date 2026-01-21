const USER = "USER";

export const ACCOUNT_KEY = {
  user: () => [USER],
  userId: (userId: string) => [USER, userId],
  phoneNumber: (phoneNumber: string) => [USER, phoneNumber],
};
