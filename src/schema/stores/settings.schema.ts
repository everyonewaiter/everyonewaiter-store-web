import z from "zod";

const settingsSchema = z.object({
  ksnetDeviceNo: z
    .string()
    .min(1, "기기 번호를 입력해주세요.")
		.max(10, "기기 번호는 10자 이내로 입력해주세요."),
	printerLocation: z.enum(["POS", "HALL"]),
	showMenuPopup: z.boolean(),
	showOrderTotalPrice: z.boolean(),
	showOrderMenuImage: z.boolean(),
	countryOfOrigins: z.array(z.object({
		item: z.string(),
		origin: z.string(),
	})),
	staffCallOptions: z.array(z.string()),
});

type SettingsSchema = z.infer<typeof settingsSchema>;

export { settingsSchema, type SettingsSchema };
