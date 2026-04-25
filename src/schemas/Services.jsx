import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255, "El nombre no puede exceder 255 caracteres"),
  description: z.string().optional().or(z.literal("")),
  tenantId: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
  averageServiceTimeMinutes: z
    .number({ invalid_type_error: "Debe ser un número" })
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1 minuto")
    .optional()
    .nullable(),
  maxServiceTimeMinutes: z
    .number({ invalid_type_error: "Debe ser un número" })
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1 minuto")
    .optional()
    .nullable(),
});

export const DEFAULT_SERVICE_VALUES = {
  name: "",
  description: "",
  tenantId: "",
  active: true,
  averageServiceTimeMinutes: null,
  maxServiceTimeMinutes: null,
};

export const FORM_FIELDS = [
  { name: "name", label: "Nombre del Servicio", required: true },
  { name: "description", label: "Descripción", full: true },
  { name: "tenantId", label: "Notaría", required: true, type: "select" },
  {
    name: "averageServiceTimeMinutes",
    label: "T. Promedio de Atención (min)",
    type: "number",
    hint: "⚠️ Sin este valor no se calcularán estadísticas en el panel Andon.",
  },
  {
    name: "maxServiceTimeMinutes",
    label: "T. Máximo de Atención (min)",
    type: "number",
    hint: "⚠️ Sin este valor no habrá alertas rojas por tiempo en el panel Andon.",
  },
  { name: "active", label: "Servicio activo", type: "checkbox", full: true },
];
