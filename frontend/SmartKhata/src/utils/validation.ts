import { z } from 'zod';

const indianPhoneRegex = /^[6-9]\d{9}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  // Section 1: Owner Info
  name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .regex(indianPhoneRegex, { message: 'Enter a valid 10-digit Indian phone number (e.g. 9876543210)' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),

  // Section 2: Shop Info
  shopName: z
    .string()
    .min(2, { message: 'Shop name must be at least 2 characters' }),
  shopPhone: z
    .string()
    .regex(indianPhoneRegex, { message: 'Enter a valid 10-digit Indian phone number' }),
  shopAddress: z
    .string()
    .min(3, { message: 'Shop address must be at least 3 characters' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
