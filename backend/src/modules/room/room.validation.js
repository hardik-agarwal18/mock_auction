import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  purse: z.number().positive("Purse must be greater than 0"),
  squadLimit: z.number().int().positive("Squad limit must be greater than 0"),
});
