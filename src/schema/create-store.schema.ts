import z from "zod";

const createStoreSchema = z.object({
  name: z.string().min(1, "상호명을 입력해주세요.").max(30, "상호명은 30자 이내로 입력해주세요."),
  ceoName: z
    .string()
    .min(1, "대표자명을 입력해주세요.")
    .max(20, "대표자명은 20자 이내로 입력해주세요."),
  address: z.string().min(1, "소재지를 선택해주세요."),
  detailAddress: z.string().optional(),
  landline: z
    .string()
    .min(1, "전화번호를 입력해주세요.")
    .regex(/^(02-\d{3,4}-\d{4}|0[1-9]\d-\d{3}-\d{4})$/, "유효하지 않은 전화번호 형식입니다."),
  license: z
    .string()
    .min(1, "사업자번호를 입력해주세요.")
    .regex(/^\d{3}-\d{2}-\d{5}$/, "유효하지 않은 사업자번호 형식입니다."),
  file: z.instanceof(File).nullable(),
});

const applicationFormSchema = createStoreSchema.omit({ file: true }).extend({
  file: z.union([z.instanceof(File), z.string()]),
  createdAt: z.string(),
  reason: z.string().optional(),
});

type CreateStoreSchema = z.infer<typeof createStoreSchema>;
type ApplicationFormSchema = z.infer<typeof applicationFormSchema>;

export {
  createStoreSchema,
  type CreateStoreSchema,
  applicationFormSchema,
  type ApplicationFormSchema,
};
