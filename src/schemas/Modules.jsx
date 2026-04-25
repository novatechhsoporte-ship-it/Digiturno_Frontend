import { z } from "zod";

export const moduleSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().optional().or(z.literal("")),
  tenantId: z.string().min(1, "La notaría es requerida"),
  attendantId: z.string().optional().or(z.literal("")),
  services: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
  maxQueueCapacity: z
    .number({ invalid_type_error: "Debe ser un número" })
    .int("Debe ser un número entero")
    .min(0, "Debe ser 0 o mayor")
    .optional()
    .nullable(),
});

export const FORM_FIELDS = [
  { name: "name", label: "Nombre del Módulo", required: true },
  { name: "description", label: "Descripción", full: true },
  {
    name: "tenantId",
    label: "Notaría",
    type: "select",
    required: true,
    optionsKey: "tenantId",
  },
  {
    name: "attendantId",
    label: "Asesor Asignado",
    type: "select",
    optionsKey: "attendantId",
  },
  {
    name: "services",
    label: "Servicios",
    type: "select",
    full: true,
    optionsKey: "services",
  },
  {
    name: "maxQueueCapacity",
    label: "Capacidad Máx. de Cola (turnos)",
    type: "number",
    hint: "⚠️ Sin este valor no habrá alertas por cantidad de espera en el panel Andon.",
  },
  {
    name: "active",
    label: "Módulo activo",
    type: "checkbox",
    full: true,
  },
];
