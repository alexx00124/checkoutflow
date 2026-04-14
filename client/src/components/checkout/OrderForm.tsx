import { useState, useCallback } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useCheckoutState } from '../../context/CheckoutContext';
import type { FormData } from '../../schemas/checkoutSchema';

export interface OrderFormProps {
  onFormChange?: (data: FormData, isValid: boolean) => void;
}

export type { FormData };

const COUNTRIES = [
  'México', 'Colombia', 'Argentina', 'Chile', 'Perú', 
  'Ecuador', 'Venezuela', 'Bolivia', 'Paraguay', 'Uruguay',
  'Costa Rica', 'Guatemala', 'Honduras', 'El Salvador', 
  'Nicaragua', 'Panamá', 'Cuba', 'República Dominicana', 
  'Puerto Rico'
];

const inputClass = "flex flex-col gap-1.5";
const labelClass = "text-xs font-medium uppercase tracking-wide";
const inputStyles = { fontFamily: 'Be Vietnam Pro, sans-serif' };

export function OrderForm({ onFormChange }: OrderFormProps) {
  const { formData: savedFormData, setFormData: saveFormData, setIsFormValid: setSavedIsFormValid } = useCheckoutState()
  const [paymentMethod, setPaymentMethod] = useState<'tarjeta' | 'paypal'>('tarjeta');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handleFormChangeWrapper = (data: FormData, isValid: boolean) => {
    saveFormData(data)
    setSavedIsFormValid(isValid)
    onFormChange?.(data, isValid)
  }

  const { formData, errors, handleChange, handleBlur } = useFormValidation({ 
    onFormChange: handleFormChangeWrapper,
    initialData: savedFormData || undefined
  });

  const formatCardNumber = useCallback((value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  }, []);

  const handleCardNumberChange = (value: string) => {
    setCardNumber(formatCardNumber(value));
  };

  const handleCardExpiryChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      setCardExpiry(digits.slice(0, 2) + ' / ' + digits.slice(2));
    } else {
      setCardExpiry(digits);
    }
  };

  const handleCardCvcChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(digits);
  };

  return (
    <div className="w-full max-w-xl">
      <div 
        className="p-6 rounded-[14px] bg-white"
        style={{ 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid #E2E4F0'
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: '#2563EB' }}
          >
            1
          </span>
          <h2 
            className="text-xl font-semibold"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#08060D' }}
          >
            Datos Personales
          </h2>
        </div>

        <div className="space-y-5 mb-8">
          <div className="flex gap-4">
            <div className={`${inputClass} flex-1`}>
              <label 
                htmlFor="fullName"
                className={labelClass}
                style={{ ...inputStyles, color: '#71749E' }}
              >
                Nombre Completo *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#71749E' }}>
                  👤
                </span>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Mateo García"
                  className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                  style={{ 
                    ...inputStyles,
                    paddingLeft: '3rem',
                    backgroundColor: errors.fullName ? '#FFF0F4' : '#E8EAFE',
                    border: `2px solid ${errors.fullName ? '#FF2E63' : formData.fullName.length >= 3 && !errors.fullName ? '#10B981' : '#E2E4F0'}`,
                    color: '#08060D',
                  }}
                />
              </div>
              {errors.fullName && (
                <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className={`${inputClass} flex-1`}>
              <label 
                htmlFor="email"
                className={labelClass}
                style={{ ...inputStyles, color: '#71749E' }}
              >
                Correo Electrónico *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#71749E' }}>
                  ✉
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="mateo@vibrashop.com"
                  className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                  style={{ 
                    ...inputStyles,
                    paddingLeft: '3rem',
                    backgroundColor: errors.email ? '#FFF0F4' : '#E8EAFE',
                    border: `2px solid ${errors.email ? '#FF2E63' : formData.email.includes('@') && formData.email.includes('.') && !errors.email ? '#10B981' : '#E2E4F0'}`,
                    color: '#08060D',
                  }}
                />
              </div>
              {errors.email && (
                <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: '#2563EB' }}
          >
            2
          </span>
          <h2 
            className="text-xl font-semibold"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#08060D' }}
          >
            Dirección de Envío
          </h2>
        </div>

        <div className="space-y-5 mb-8">
          <div className={inputClass}>
            <label 
              htmlFor="address"
              className={labelClass}
              style={{ ...inputStyles, color: '#71749E' }}
            >
              Calle y Número *
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Av. de la Libertad 123, Depto 48"
              className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
              style={{ 
                ...inputStyles,
                backgroundColor: errors.address ? '#FFF0F4' : '#E8EAFE',
                border: `2px solid ${errors.address ? '#FF2E63' : formData.address.length >= 5 && !errors.address ? '#10B981' : '#E2E4F0'}`,
                color: '#08060D',
              }}
            />
            {errors.address && (
              <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                {errors.address}
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <div className={`${inputClass} flex-[2]`}>
              <label 
                htmlFor="city"
                className={labelClass}
                style={{ ...inputStyles, color: '#71749E' }}
              >
                Ciudad *
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                onBlur={() => handleBlur('city')}
                placeholder="Ciudad de México"
                className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                style={{ 
                  ...inputStyles,
                  backgroundColor: errors.city ? '#FFF0F4' : '#E8EAFE',
                  border: `2px solid ${errors.city ? '#FF2E63' : formData.city.length >= 2 && !errors.city ? '#10B981' : '#E2E4F0'}`,
                  color: '#08060D',
                }}
              />
              {errors.city && (
                <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                  {errors.city}
                </span>
              )}
            </div>

            <div className={`${inputClass} flex-1`}>
              <label 
                htmlFor="postalCode"
                className={labelClass}
                style={{ ...inputStyles, color: '#71749E' }}
              >
                C. Postal *
              </label>
              <input
                id="postalCode"
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                onBlur={() => handleBlur('postalCode')}
                placeholder="06700"
                className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                style={{ 
                  ...inputStyles,
                  backgroundColor: errors.postalCode ? '#FFF0F4' : '#E8EAFE',
                  border: `2px solid ${errors.postalCode ? '#FF2E63' : formData.postalCode.length >= 4 && !errors.postalCode ? '#10B981' : '#E2E4F0'}`,
                  color: '#08060D',
                }}
              />
              {errors.postalCode && (
                <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                  {errors.postalCode}
                </span>
              )}
            </div>

            <div className={`${inputClass} flex-1`}>
              <label 
                htmlFor="country"
                className={labelClass}
                style={{ ...inputStyles, color: '#71749E' }}
              >
                País *
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                onBlur={() => handleBlur('country')}
                className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200 appearance-none cursor-pointer"
                style={{ 
                  ...inputStyles,
                  backgroundColor: errors.country ? '#FFF0F4' : '#E8EAFE',
                  border: `2px solid ${errors.country ? '#FF2E63' : formData.country && !errors.country ? '#10B981' : '#E2E4F0'}`,
                  color: '#08060D',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371749E'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.25rem',
                }}
              >
                <option value="">Selecciona</option>
                {COUNTRIES.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && (
                <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                  {errors.country}
                </span>
              )}
            </div>
          </div>

          <div className={inputClass}>
            <label 
              htmlFor="phone"
              className={labelClass}
              style={{ ...inputStyles, color: '#71749E' }}
            >
              Teléfono *
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="+52 55 1234 5678"
              className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
              style={{ 
                ...inputStyles,
                backgroundColor: errors.phone ? '#FFF0F4' : '#E8EAFE',
                border: `2px solid ${errors.phone ? '#FF2E63' : formData.phone.length >= 7 && !errors.phone ? '#10B981' : '#E2E4F0'}`,
                color: '#08060D',
              }}
            />
            {errors.phone && (
              <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6 mt-8">
          <span 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ backgroundColor: '#2563EB' }}
          >
            3
          </span>
          <h2 
            className="text-xl font-semibold"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#08060D' }}
          >
            Método de Pago
          </h2>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('tarjeta')}
            className="flex-1 py-3 px-4 rounded-lg text-base font-medium transition-all duration-200"
            style={{ 
              fontFamily: 'Be Vietnam Pro, sans-serif',
              backgroundColor: paymentMethod === 'tarjeta' ? '#2563EB' : '#E8EAFE',
              color: paymentMethod === 'tarjeta' ? '#fff' : '#08060D',
              border: paymentMethod === 'tarjeta' ? '2px solid #2563EB' : '2px solid #E2E4F0',
            }}
          >
            💳 Tarjeta
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className="flex-1 py-3 px-4 rounded-lg text-base font-medium transition-all duration-200"
            style={{ 
              fontFamily: 'Be Vietnam Pro, sans-serif',
              backgroundColor: paymentMethod === 'paypal' ? '#2563EB' : '#E8EAFE',
              color: paymentMethod === 'paypal' ? '#fff' : '#08060D',
              border: paymentMethod === 'paypal' ? '2px solid #2563EB' : '2px solid #E2E4F0',
            }}
          >
            🅿 PayPal
          </button>
        </div>

        {paymentMethod === 'tarjeta' ? (
          <div className="space-y-4">
            <div className={inputClass}>
              <label 
                htmlFor="cardNumber"
                className={labelClass}
                style={{ ...inputStyles, color: '#71749E' }}
              >
                Número de Tarjeta *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: '#71749E' }}>
                  🔒
                </span>
                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                  style={{ 
                    ...inputStyles,
                    paddingLeft: '3rem',
                    backgroundColor: '#E8EAFE',
                    border: cardNumber.length === 19 ? '#10B981' : '#E2E4F0',
                    color: '#08060D',
                    letterSpacing: '0.1em',
                  }}
                />
              </div>
              {false && (
                <span className="text-xs font-medium" style={{ color: '#FF2E63' }}>
                  {'error'}
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <div className={`${inputClass} flex-1`}>
                <label 
                  htmlFor="cardExpiry"
                  className={labelClass}
                  style={{ ...inputStyles, color: '#71749E' }}
                >
                  Vencimiento *
                </label>
                <input
                  id="cardExpiry"
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => handleCardExpiryChange(e.target.value)}
                  placeholder="MM / AA"
                  className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                  style={{ 
                    ...inputStyles,
                    backgroundColor: '#E8EAFE',
                    border: cardExpiry.length === 7 ? '#10B981' : '#E2E4F0',
                    color: '#08060D',
                  }}
                />
              </div>

              <div className={`${inputClass} flex-1`}>
                <label 
                  htmlFor="cardCvc"
                  className={labelClass}
                  style={{ ...inputStyles, color: '#71749E' }}
                >
                  CVC *
                </label>
                <input
                  id="cardCvc"
                  type="text"
                  value={cardCvc}
                  onChange={(e) => handleCardCvcChange(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  className="w-full h-12 px-4 rounded-lg text-base outline-none transition-all duration-200"
                  style={{ 
                    ...inputStyles,
                    backgroundColor: '#E8EAFE',
                    border: cardCvc.length >= 3 ? '#10B981' : '#E2E4F0',
                    color: '#08060D',
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="p-4 rounded-lg"
            style={{ backgroundColor: '#E8EAFE', color: '#08060D' }}
          >
            <p className="text-base" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Serás redirigido a PayPal para completar tu pago de forma segura.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}