import { z } from "zod";

export const qrSchema = z.object({
  tenantId: z.string().min(1, "La notaría es requerida"),
});

export const FORM_FIELDS = [
  {
    name: "tenantId",
    label: "Notaría",
    type: "select",
    required: true,
    // Solo visible para SUPERADMIN
  },
];

