import z from "zod";

export const UsernameSchema = z
  .string()
  .trim()
  .min(3, "3 caractères minimum")
  .max(20, "20 caractères maximum")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "Le pseudo ne peut contenir que des lettres, chiffres et tirets",
  );
