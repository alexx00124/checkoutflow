import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'Ingresa una ciudad válida'),
  postalCode: z.string().regex(/^\d{4,10}$/, 'Ingresa un codigo postal valido solo con numeros'),
  country: z.string().min(2, 'Ingresa un país válido'),
  phone: z.string().regex(/^\d{10}$/, 'Ingresa un numero telefonico de 10 digitos'),
  paymentMethod: z.enum(['tarjeta', 'paypal'], {
    message: 'Selecciona un método de pago',
  }),
  cardNumber: z.string(),
  cardExpiry: z.string(),
  cardCvc: z.string(),
  paypalCountry: z.string(),
  paypalFirstName: z.string(),
  paypalLastName: z.string(),
  paypalEmail: z.string(),
  paypalPassword: z.string(),
  paypalPasswordConfirm: z.string(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod !== 'tarjeta') {
    if (data.paypalCountry.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paypalCountry'],
        message: 'Selecciona un pais o region',
      })
    }

    if (data.paypalFirstName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paypalFirstName'],
        message: 'Ingresa tu nombre',
      })
    }

    if (data.paypalLastName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paypalLastName'],
        message: 'Ingresa tus apellidos',
      })
    }

    if (!z.string().email().safeParse(data.paypalEmail).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paypalEmail'],
        message: 'Ingresa un correo electronico valido',
      })
    }

    if (data.paypalPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paypalPassword'],
        message: 'La contrasena debe tener al menos 6 caracteres',
      })
    }

    if (data.paypalPasswordConfirm !== data.paypalPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['paypalPasswordConfirm'],
        message: 'Las contrasenas no coinciden',
      })
    }

    return
  }

  if (data.cardNumber.replace(/\s/g, '').length !== 16) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cardNumber'],
      message: 'Ingresa una tarjeta válida de 16 dígitos',
    })
  }

  if (!/^\d{2} \/ \d{2}$/.test(data.cardExpiry)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cardExpiry'],
      message: 'Usa el formato MM / AA',
    })
  }

  if (!/^\d{3,4}$/.test(data.cardCvc)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['cardCvc'],
      message: 'Ingresa un CVC válido',
    })
  }
})

export type FormData = z.infer<typeof checkoutSchema>;
