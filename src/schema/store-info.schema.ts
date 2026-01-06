import z from "zod";

const storeInfoSchema = z.object({
  name: z.string(),
  license: z.string(),
  address: z.string(),
  origins: z.array(
    z.object({
      id: z.string(),
      item: z.string(),
      origin: z.string(),
    })
  ),
});

type StoreInfoSchema = z.infer<typeof storeInfoSchema>;

export { storeInfoSchema, type StoreInfoSchema };
