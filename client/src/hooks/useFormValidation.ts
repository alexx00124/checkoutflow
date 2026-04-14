import { useState, useCallback, useEffect } from 'react';
import { checkoutSchema } from '../schemas/checkoutSchema';
import type { FormData } from '../schemas/checkoutSchema';

interface UseFormValidationProps {
  onFormChange?: (data: FormData, isValid: boolean) => void;
  initialData?: FormData | null;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  paymentMethod?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  paypalCountry?: string;
  paypalFirstName?: string;
  paypalLastName?: string;
  paypalEmail?: string;
  paypalPassword?: string;
  paypalPasswordConfirm?: string;
}

const emptyFormData: FormData = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
  paymentMethod: 'tarjeta',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  paypalCountry: '',
  paypalFirstName: '',
  paypalLastName: '',
  paypalEmail: '',
  paypalPassword: '',
  paypalPasswordConfirm: '',
}

export function useFormValidation({ onFormChange, initialData }: UseFormValidationProps = {}) {
  const [formData, setFormData] = useState<FormData>(initialData || emptyFormData);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateField = useCallback((name: keyof FormData, value: string, nextData?: FormData) => {
    const dataToValidate = nextData || { ...formData, [name]: value }
    const result = checkoutSchema.safeParse(dataToValidate)

    if (result.success) {
      return undefined
    }

    const issue = result.error.issues.find((entry) => entry.path[0] === name)
    return issue?.message || undefined
  }, [formData]);

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const updatedData = { ...formData, [name]: value };
      const error = validateField(name, value, updatedData);
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    const updatedData = { ...formData, [name]: value };
    const validationResult = checkoutSchema.safeParse(updatedData);
    const isValid = validationResult.success;
    
    onFormChange?.(updatedData, isValid);
  }, [touched, formData, validateField, onFormChange]);

  const handleBlur = useCallback((name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const value = formData[name];
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [formData, validateField]);

  const validateAll = useCallback(() => {
    const result = checkoutSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof FormData;
        if (field) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setTouched({
        fullName: true,
        email: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        phone: true,
        paymentMethod: true,
        cardNumber: true,
        cardExpiry: true,
        cardCvc: true,
        paypalCountry: true,
        paypalFirstName: true,
        paypalLastName: true,
        paypalEmail: true,
        paypalPassword: true,
        paypalPasswordConfirm: true,
      });
      return false;
    }
    return true;
  }, [formData]);

  const isValid = checkoutSchema.safeParse(formData).success;

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid,
  };
}
