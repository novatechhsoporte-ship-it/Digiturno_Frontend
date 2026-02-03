import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().optional().or(z.literal("")),
  tenantId: z.string().min(1, "La notaría es requerida"),
  active: z.boolean().default(true),
});

export const FORM_FIELDS = [
  { name: "name", label: "Nombre del Servicio", required: true },
  { name: "description", label: "Descripción", full: true },
  { name: "tenantId", label: "Notaría", required: true, type: "select" },
  { name: "active", label: "Servicio activo", type: "checkbox", full: true },
];

