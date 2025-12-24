import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일과 비밀번호를 다시 확인해주세요")
    .includes("@", { message: "올바른 이메일 형식이 아닙니다" }),
  password: z.string().min(1, "이메일과 비밀번호를 다시 확인해주세요"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };
