import { z } from "zod";

export const ticketSchema = z.object({
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  documentType: z.enum(["CC", "CE", "PA", "TI", "NIT", "PASSPORT"], {
    errorMap: () => ({ message: "Tipo de documento inválido" }),
  }),
  fullName: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "El teléfono es requerido"),
  moduleId: z.string().optional(),
  serviceTypeId: z.string(),
});

export const customerUpdateSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido").optional().or(z.literal("")),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const DEFAULT_FORM_VALUES = {
  documentNumber: "",
  documentType: "CC",
  fullName: "",
  email: "",
  phone: "",
  moduleId: "",
};

export const DEFAULT_CUSTOMER_UPDATE_VALUES = {
  fullName: "",
  email: "",
  phone: "",
};

export const DOCUMENT_TYPE_OPTIONS = [
  { label: "Cédula de Ciudadanía", value: "CC" },
  { label: "Cédula de Extranjería", value: "CE" },
  { label: "Tarjeta de Identidad", value: "TI" },
  { label: "Pasaporte", value: "PA" },
  { label: "NIT", value: "NIT" },
  { label: "Pasaporte Internacional", value: "PASSPORT" },
];

export const TICKET_FORM_FIELDS = [
  {
    name: "fullName",
    label: "Nombre Completo",
    required: true,
    placeholder: "Ingrese el nombre completo",
    full: true,
  },
  {
    name: "documentNumber",
    label: "Número de Documento",
    required: true,
    placeholder: "Ingrese el número de documento",
  },
  {
    name: "documentType",
    label: "Typo de Documento",
    required: true,
    type: "select",
    placeholder: "Seleccione tipo documento",
    optionsKey: "documentTypes",
  },
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    placeholder: "correo@ejemplo.com",
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "Ingrese el teléfono",
    required: true,
  },
  {
    name: "serviceTypeId",
    label: "Tipo de servicio",
    type: "select",
    optionsKey: "services",
  },
];
