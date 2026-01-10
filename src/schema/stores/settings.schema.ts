import z from "zod";

const settingsSchema = z.object({
  ksnetDeviceNo: z
    .string()
    .min(1, "기기 번호를 입력해주세요.")
    .max(20, "기기 번호는 20자 이내로 입력해주세요."),
  printerLocation: z.enum(["POS", "HALL"]),
  showMenuPopup: z.boolean(),
  showOrderTotalPrice: z.boolean(),
  showOrderMenuImage: z.boolean(),
  countryOfOrigins: z.array(
    z.object({
      item: z.string(),
      origin: z.string(),
    })
  ),
  staffCallOptions: z.array(z.string()),
  extraTableCount: z.number().min(0, "추가 테이블 수는 0 이상이어야 합니다."),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export { settingsSchema, type SettingsSchema };
