import { z } from "zod";

export const qrSchema = z.object({
  tenantId: z.string().min(1, "La notaría es requerida"),
  expiresAt: z.string().optional().or(z.literal("")),
});

export const FORM_FIELDS = [
  {
    name: "tenantId",
    label: "Notaría",
    type: "select",
    required: true,
    // Solo visible para SUPERADMIN
  },
  {
    name: "expiresAt",
    label: "Fecha de Expiración (Opcional)",
    type: "datetime-local",
    required: false,
    placeholder: "Seleccione una fecha de expiración",
  },
];

