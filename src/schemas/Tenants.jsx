import { z } from "zod";

export const tenantSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  taxId: z.string().optional().or(z.literal("")),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z
    .string()
    .regex(/^[0-9]+$/, "El teléfono debe contener solo números")
    .min(10, "El teléfono debe tener 10 dígitos")
    .max(10, "El teléfono debe tener 10 dígitos"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
  serviceHoursStart: z.string().min(1, "Hora de inicio requerida"),
  serviceHoursEnd: z.string().min(1, "Hora de fin requerida"),
  maxWaitingTimeMinutes: z
    .string()
    .regex(/^[0-9]+$/, "Debe ser un número")
    .optional()
    .or(z.literal("")),
});

export const FORM_FIELDS = [
  { name: "name", label: "Nombre de la Notaría", required: true },
  { name: "taxId", label: "NIT" },
  { name: "address", label: "Dirección", required: true, full: true },
  { name: "city", label: "Ciudad" },
  { name: "phone", label: "Teléfono", type: "number", required: true },
  { name: "email", label: "Correo Electrónico", type: "email" },

  { name: "serviceHoursStart", label: "Hora de Inicio", type: "time" },
  { name: "serviceHoursEnd", label: "Hora de Fin", type: "time" },

  { name: "status", label: "Notaría activa", type: "checkbox", full: true },
];
