import z from "zod";

const signupSchema = z
  .object({
    email: z.email({ message: "올바른 이메일 형식이 아닙니다" }),
    phoneNumber: z
      .string()
      .min(1, "휴대폰 번호를 입력해주세요.")
      .regex(/^01[016789][1-9]\d{6,7}$/, "유효하지 않은 휴대폰 번호 형식입니다."),
    authCode: z
      .string()
      .min(1, "인증번호를 입력해주세요.")
      .regex(/^\d{6}$/, "인증번호는 6자리입니다."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 영문, 숫자, 특수문자를 조합하여 8자리 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "비밀번호는 영문, 숫자, 특수문자를 조합하여 8자리 이상이어야 합니다.."
      ),
    passwordConfirm: z.string().min(1, "비밀번호를 다시 입력해주세요."),
    agreeToTerms: z.boolean().refine((agreeToTerms) => agreeToTerms, {
      message: "개인정보 수집에 동의해주세요.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupSchema = z.infer<typeof signupSchema>;

export { signupSchema, type SignupSchema };
