import z from "zod";

const menuOptionsSchema = z.array(
  z.object({
    name: z.string().min(1, "옵션명을 입력해주세요.").max(30, "30자 이내로 입력해주세요."),
    price: z
      .string()
      .min(1, "가격을 입력해주세요.")
      .refine(
        (val) => {
          const num = Number(val);
          return !Number.isNaN(num) && num >= -10000000 && num <= 10000000;
        },
        { message: "가격은 -10,000,000원부터 10,000,000원까지 입력 가능합니다." }
      ),
  })
);

const menuSchema = z.object({
  categoryId: z.string().min(1, "카테고리를 선택해주세요."),
  name: z.string().min(1, "메뉴명을 입력해주세요.").max(30, "30자 이내로 입력해주세요."),
  description: z.string().max(100, "100자 이내로 입력해주세요.").optional(),
  price: z.string().min(1, "가격을 입력해주세요.").max(10000000, "1000만원 이내로 입력해주세요."),
  image: z.string().min(1, "이미지를 등록해주세요."),
  label: z.enum(["BEST", "NEW", "DEFAULT", "RECOMMEND"]),
  spicy: z.number().min(0, "맵기 정도를 선택해주세요.").max(10, "맵기 정도를 선택해주세요."),
  state: z.enum(["DEFAULT", "HIDE", "SOLD_OUT"]),
  printEnabled: z.boolean(),
  requiredOptionGroups: z.array(
    z.object({
      name: z.string().min(1, "옵션 그룹명을 입력해주세요.").max(30, "30자 이내로 입력해주세요."),
      type: z.enum(["MANDATORY", "OPTIONAL"]),
      printEnabled: z.boolean(),
      menuOptions: menuOptionsSchema,
    })
  ),
  optionalOptionGroups: z.array(
    z.object({
      name: z.string().min(1, "옵션 그룹명을 입력해주세요.").max(30, "30자 이내로 입력해주세요."),
      type: z.enum(["MANDATORY", "OPTIONAL"]),
      printEnabled: z.boolean(),
      menuOptions: menuOptionsSchema,
    })
  ),
});

type MenuSchema = z.infer<typeof menuSchema>;

export { menuSchema, type MenuSchema };
