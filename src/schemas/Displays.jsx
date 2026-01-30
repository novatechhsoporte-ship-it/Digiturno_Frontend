import { z } from "zod";

export const displaySchema = z.object({
  pairingCode: z.string().length(6, "El código debe tener 6 dígitos").regex(/^\d+$/, "El código debe ser numérico").optional(), // Required for create, optional for edit
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  type: z.enum(["TV", "KIOSK", "TABLET"], {
    errorMap: () => ({ message: "El tipo debe ser TV, KIOSK o TABLET" }),
  }),
  location: z.string().max(200, "La ubicación no puede exceder 200 caracteres").optional().or(z.literal("")),
  tenantId: z.string().min(1, "La notaría es requerida"),
  moduleIds: z.array(z.string()).optional().default([]),
});

export const pairingCodeSchema = z.object({
  pairingCode: z.string().length(6, "El código debe tener 6 dígitos").regex(/^\d+$/, "El código debe ser numérico"),
});

export const FORM_FIELDS = [
  {
    name: "pairingCode",
    label: "Código de Emparejamiento",
    type: "text",
    required: true,
    placeholder: "Ingrese el código de 6 dígitos",
    maxLength: 6,
  },
  {
    name: "name",
    label: "Nombre de la Pantalla",
    type: "text",
    required: true,
    placeholder: "Ej: TV Recepción Principal",
  },
  {
    name: "type",
    label: "Tipo de Dispositivo",
    type: "select",
    required: true,
    options: [
      { value: "TV", label: "TV" },
      { value: "KIOSK", label: "Kiosco" },
      { value: "TABLET", label: "Tablet" },
    ],
  },
  {
    name: "location",
    label: "Ubicación",
    type: "text",
    required: false,
    placeholder: "Ej: Recepción Principal, Sala de Espera",
  },
  {
    name: "tenantId",
    label: "Notaría",
    type: "select",
    required: true,
    // Solo visible para SUPERADMIN
  },
];
