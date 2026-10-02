import z from "zod";

export const NameSchema = z.string().trim().min(1).max(255);

export const RenameSchema = z.object({ name: NameSchema });
