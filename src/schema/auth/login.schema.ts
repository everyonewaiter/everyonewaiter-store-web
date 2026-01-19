import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .includes("@", { message: "올바른 이메일 형식이 아닙니다" }),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };
