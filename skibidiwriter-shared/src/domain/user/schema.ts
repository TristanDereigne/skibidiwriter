import z from "zod";

export const UsernameSearchSchema = z
  .string()
  .trim()
  .min(1)
  .max(20, "20 caractères maximum")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "Le pseudo ne peut contenir que des lettres, chiffres et tirets",
  );

export const UsernameSchema = UsernameSearchSchema.min(
  3,
  "3 caractères minimum",
);
