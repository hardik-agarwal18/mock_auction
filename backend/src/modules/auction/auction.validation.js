import { z } from "zod";

export const bidSchema = z.object({
  amount: z.number().int().positive("Bid amount must be positive"),
});
