import type { AxiosError } from "axios";

export const errorResponse = (error: unknown) => {
  return (error as AxiosError).response?.data as {
    code: string;
    timestamp: string;
    message: string;
  };
};
