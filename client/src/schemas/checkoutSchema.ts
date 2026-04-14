import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'Ingresa una ciudad válida'),
  postalCode: z.string().min(4, 'El código postal debe tener al menos 4 dígitos'),
  country: z.string().min(2, 'Ingresa un país válido'),
  phone: z.string().min(7, 'Ingresa un teléfono válido'),
});

export type FormData = z.infer<typeof checkoutSchema>;