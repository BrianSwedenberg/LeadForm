import { z } from 'zod'
import { validateZip } from '../utils/validateZip'

export const step1Schema = z.object({
  zip_code: z
    .string()
    .regex(/^\d{5}$/, 'Please enter a valid 5-digit zip code')
    .refine(validateZip, "Sorry, we don't yet have service in this area, please try back on a future date."),
  own_rent: z.enum(['Own', 'Rent']).nullable().optional(),
  water_source: z.enum(['Well Water', 'City Water']).nullable().optional(),
  taste_odor: z.enum(['Yes', 'No']).nullable().optional(),
})

export const step2Schema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[A-Za-z\s'\-]+$/, 'No special characters allowed'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
})

export const step3Schema = z.object({
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  timeline: z
    .enum(['Immediately', '1-2 Weeks', 'Flexible'])
    .nullable()
    .optional(),
  financing: z.boolean().nullable().optional(),
})

export type Step1Fields = z.infer<typeof step1Schema>
export type Step2Fields = z.infer<typeof step2Schema>
export type Step3Fields = z.infer<typeof step3Schema>
