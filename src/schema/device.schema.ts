import z from "zod";

const deviceSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  purpose: z.enum(["POS", "HALL", "TABLE", "WAITING"]),
  paymentType: z.enum(["POSTPAID", "PREPAID"]),
  state: z.enum(["ACTIVE", "INACTIVE"]),
  createdAt: z.string(),
  tableNo: z.number().min(1, "테이블 번호를 입력해주세요."),
});

type DeviceSchema = z.infer<typeof deviceSchema>;

export { deviceSchema, type DeviceSchema };
