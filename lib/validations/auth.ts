import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["consumer", "farmer"]).default("consumer"),
});

export const signUpSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name is too long"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a number"),
    role: z.enum(["consumer", "farmer"]),
    phone: z
      .string()
      .min(10, "Phone must be at least 10 digits")
      .max(20, "Phone is too long")
      .regex(/^[+\d\s-]+$/, "Phone can only contain digits, spaces, + and -"),
    address: z.string().min(3, "Address is required").max(200),
    city: z.string().min(2, "City is required").max(60),
    state: z.string().min(2, "State is required").max(60),
    country: z.string().min(2, "Country is required").max(60),
    zip_code: z
      .string()
      .min(3, "Zip code is required")
      .max(12, "Zip code is too long"),
  })
  .strict();

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;