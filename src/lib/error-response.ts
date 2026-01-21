import type { AxiosError } from "axios";

export const errorResponse = (error: unknown) => {
  const axiosError = error as AxiosError;

  return {
    status: axiosError.response?.status,
    data: axiosError.response?.data as {
      code: string;
      timestamp: string;
      message: string;
    },
  };
};
