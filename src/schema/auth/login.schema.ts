import { z } from 'zod';

const loginSchema = z.object({
	email: z.email('이메일과 비밀번호를 다시 확인해주세요'),
	password: z.string().min(1, '이메일과 비밀번호를 다시 확인해주세요')
})

type LoginSchema = z.infer<typeof loginSchema>;

export { loginSchema, type LoginSchema };