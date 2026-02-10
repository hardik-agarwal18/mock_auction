import { z } from "zod";

export const createPlayerSchema = z.object({
  name: z.string().min(2, "Player name must be at least 2 characters"),
  role: z.string().min(2, "Role must be specified"),
  basePrice: z.number().int().positive("Base price must be positive"),
});
