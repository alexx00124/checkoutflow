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
}

const emptyFormData: FormData = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
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

  const validateField = useCallback((name: keyof FormData, value: string) => {
    const fieldSchema = checkoutSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    
    if (!result.success) {
      return result.error.issues[0]?.message || 'Campo inválido';
    }
    return undefined;
  }, []);

  const handleChange = useCallback((name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
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