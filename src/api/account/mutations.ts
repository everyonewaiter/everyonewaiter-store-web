import { mutationOptions } from "@tanstack/react-query";
import axios from "axios";
import type { SignupSchema } from "@/schema/auth/signup.schema";

export const accountMutations = {
  createAccount: () =>
    mutationOptions({
      mutationFn: async (body: Pick<SignupSchema, "email" | "phoneNumber" | "password">) => {
        const response = await axios.post(`/accounts`, body);
        return response.data;
      },
    }),
  verifyAuthMail: () =>
    mutationOptions({
      mutationFn: async (token: string) => {
        const response = await axios.post(`/accounts/verify-auth-mail?token=${token}`);
        return response.data;
      },
    }),
  verifyAuthCode: () =>
    mutationOptions({
      mutationFn: async (body: { phoneNumber: string; code: number }) => {
        const response = await axios.post(`/accounts/verify-auth-code`, body);
        return response.data;
      },
    }),
  signIn: () =>
    mutationOptions({
      mutationFn: async (body: Pick<SignupSchema, "email" | "password">) => {
        const response = await axios.post(`/accounts/sign-in`, body);
        return response.data;
      },
    }),
  sendAuthMail: () =>
    mutationOptions({
      mutationFn: async (body: Pick<SignupSchema, "email">) => {
        const response = await axios.post(`/accounts/send-auth-mail`, body);
        return response.data;
      },
    }),
  sendAuthCode: () =>
    mutationOptions({
      mutationFn: async (body: Pick<SignupSchema, "phoneNumber">) => {
        const response = await axios.post(`/accounts/send-auth-code`, body);
        return response.data;
      },
    }),
};
