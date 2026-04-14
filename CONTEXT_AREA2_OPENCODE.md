# PROMPT PARA OPENCODE — ÁREA 2
## Formulario de Envío y Validación

---

## CONTEXTO DEL PROYECTO

Eres parte del equipo del **Sprint 4** de un e-commerce de ropa juvenil llamado **Vibra Shop**.
El proyecto completo tiene 5 sprints desarrollados por grupos diferentes. Tu trabajo es el **Área 2** del Sprint 4.

El repositorio ya tiene:
- `client/` → proyecto React + Vite + TypeScript (ya configurado)
- `server/` → backend Node.js + Express + TypeScript
- `prisma/` → base de datos PostgreSQL con Prisma ORM
- `docs/` → documentación completa del proyecto

---

## TU TAREA: Área 2 — Formulario de Envío y Validación

### Criterios de aceptación que DEBES cumplir:
- ✅ **Criterio 5** — El formulario solicita nombre del destinatario
- ✅ **Criterio 6** — El formulario solicita dirección de envío
- ✅ **Criterio 7** — El formulario solicita ciudad
- ✅ **Criterio 8** — El formulario solicita información de contacto (teléfono y correo)
- ✅ **Criterio 9** — Todos los campos obligatorios están marcados con asterisco (*)
- ✅ **Criterio 10** — El sistema valida que no existan campos obligatorios vacíos
- ✅ **Criterio 11** — El sistema muestra errores claros cuando faltan datos

---

## STACK TECNOLÓGICO OBLIGATORIO

- **React + Vite + TypeScript** (ya instalado)
- **Tailwind CSS** para todos los estilos (instalar si no está)
- **Zod** para validación de esquemas (instalar)
- **NO** cambiar librerías base del proyecto

### Instalación requerida:
```bash
cd client
npm install zod
npm install -D tailwindcss @tailwindcss/vite
```

---

## DESIGN SYSTEM — colores EXACTOS del profesor

```
Primary:    #2563EB  → azul principal (botones, círculos, bordes activos)
Secondary:  #7C3AED  → púrpura
Tertiary:   #FF2E63  → rojo/coral (errores, acentos)
Neutral:    #71749E  → gris azulado
Fondo app:  #0F0F1A  → fondo oscuro con puntos
Superficie: #FFFFFF  → tarjetas blancas
Borde:      #E2E4F0  → bordes suaves
```

### Tipografías (importar de Google Fonts):
```html
Plus Jakarta Sans → títulos y labels
Be Vietnam Pro   → textos y placeholders
```

---

## DISEÑO VISUAL ESPERADO (basado en mockup del profesor)

### Vista general del checkout:
```
┌─────────────────────────────────┐  ┌──────────────────┐
│  FORMULARIO (columna izquierda) │  │   TU PEDIDO      │
│                                 │  │  (columna derecha)│
│  ① Datos Personales            │  │                  │
│  ┌──────────────┬─────────────┐ │  │  [producto img]  │
│  │ Nombre*      │ Correo*     │ │  │  nombre $precio  │
│  └──────────────┴─────────────┘ │  │                  │
│                                 │  │  Subtotal  $165  │
│  ② Dirección de Envío          │  │  Envío    GRATIS  │
│  ┌───────────────────────────┐  │  │  TOTAL    $165   │
│  │ Calle y número*           │  │  │                  │
│  └───────────────────────────┘  │  │ [FINALIZAR →]    │
│  ┌──────────┬────────┬───────┐  │  └──────────────────┘
│  │ Ciudad*  │C.Post* │ País* │  │
│  └──────────┴────────┴───────┘  │
│  ┌───────────────────────────┐  │
│  │ Teléfono*                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ③ Método de Pago              │
│  [ 💳 Tarjeta ] [ 🅿 PayPal ]  │
└─────────────────────────────────┘
```

### Especificaciones visuales:
- Fondo de la página: `#0F0F1A` oscuro con patrón de puntos
- Cada sección es una **tarjeta blanca** con `border-radius: 14px` y sombra suave
- Los **círculos numerados** (①②③) son azules `#2563EB` con texto blanco
- Los **inputs** tienen fondo `#F0F1F9`, borde `#E2E4F0`, altura 48px
- Al **focus**: borde azul `#2563EB` con sombra `0 0 0 3px rgba(37,99,235,0.12)`
- Al **error**: borde rojo `#FF2E63`, fondo `#FFF0F4`, mensaje rojo debajo
- Los **labels** son en mayúsculas pequeñas, color `#71749E`, fuente Plus Jakarta Sans
- El **layout** es de 2 columnas en desktop: formulario a la izquierda, resumen a la derecha

---

## ARCHIVOS QUE DEBES CREAR

```
client/src/
├── components/
│   └── checkout/
│       ├── OrderForm.tsx          ← componente principal del formulario
│       └── OrderForm.css          ← estilos adicionales si necesitas
├── hooks/
│   └── useFormValidation.ts       ← hook con lógica de validación
└── schemas/
    └── checkoutSchema.ts          ← esquema Zod de validación
```

---

## TIPOS E INTERFACES REQUERIDOS

```typescript
// Datos del formulario
export interface FormData {
  fullName:   string;  // Nombre completo
  email:      string;  // Correo electrónico
  address:    string;  // Calle y número
  city:       string;  // Ciudad
  postalCode: string;  // Código postal
  country:    string;  // País
  phone:      string;  // Teléfono
}

// Props del componente
export interface OrderFormProps {
  onFormChange: (data: FormData, isValid: boolean) => void;
}
```

---

## ESQUEMA DE VALIDACIÓN ZOD

```typescript
import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName:   z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email:      z.string().email('Ingresa un correo electrónico válido'),
  address:    z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city:       z.string().min(2, 'Ingresa una ciudad válida'),
  postalCode: z.string().min(4, 'El código postal debe tener al menos 4 dígitos'),
  country:    z.string().min(2, 'Ingresa un país válido'),
  phone:      z.string().min(7, 'Ingresa un teléfono válido'),
});
```

---

## COMPORTAMIENTO ESPERADO

1. El formulario arranca con todos los campos vacíos
2. Los errores **NO** se muestran al cargar, solo al hacer blur (salir del campo) o al intentar enviar
3. Cuando un campo tiene error → borde rojo + mensaje debajo
4. Cuando un campo es válido → borde verde
5. El componente llama a `onFormChange(data, isValid)` cada vez que cambia un campo
6. `isValid` es `true` solo cuando TODOS los campos pasan la validación
7. La interfaz está completamente en **español**

---

## INTEGRACIÓN CON OTROS COMPAÑEROS

- **Área 1** (ya hecha) → maneja la navegación y el hook `useCart` con los productos
- **Tú (Área 2)** → exportas `FormData` e `isValid` para que Área 3 y Área 4 los usen
- **Área 3** → usa tus datos para mostrar el resumen de compra
- **Área 4** → usa `isValid` para habilitar/deshabilitar el botón de pagar
- **Área 5** → hará el tema visual global al final en grupo

---

## CONVENCIONES OBLIGATORIAS

- Todo en **TypeScript** con tipos explícitos, sin `any`
- Comentarios del código en **español**
- Textos de la interfaz en **español**
- Usar **Tailwind CSS** para estilos responsive
- Responsive: diseño **desktop primero**, luego mobile
- Cero errores de TypeScript en build final
- No duplicar lógica que ya existe en el proyecto

---

## EJEMPLO DE USO DEL COMPONENTE

```tsx
import OrderForm, { FormData } from './components/checkout/OrderForm';

function CheckoutPage() {
  const handleFormChange = (data: FormData, isValid: boolean) => {
    console.log('Formulario válido:', isValid);
    console.log('Datos:', data);
  };

  return (
    <div className="checkout-layout">
      <OrderForm onFormChange={handleFormChange} />
    </div>
  );
}
```

---

## NOTAS FINALES

- Lee todos los archivos en `docs/` antes de empezar para entender el proyecto completo
- El proyecto ya tiene configurado Vite, ESLint y TypeScript en `client/`
- El backend en `server/` ya tiene las rutas de checkout configuradas
- Usa los docs del proyecto como fuente de verdad para cualquier duda
- El área 5 (tema visual global) se hará en grupo al final, por ahora usa los colores directamente en Tailwind