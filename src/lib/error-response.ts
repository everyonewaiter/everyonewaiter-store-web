import { toast } from "sonner";
import type { AxiosError } from "axios";

export const errorResponse = (error: unknown) => {
  const axiosError = error as AxiosError;

  if (!axiosError.response?.data) {
    toast.error("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
  }

  return {
    status: axiosError.response?.status,
    data: axiosError.response?.data as {
      code: string;
      timestamp: string;
      message: string;
    },
  };
};
