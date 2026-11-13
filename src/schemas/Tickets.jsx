import { z } from "zod";
import React from "react";

export const ticketSchema = z.object({
  documentNumber: z
    .string()
    .min(1, "El número de documento es requerido")
    .min(6, "El número de documento debe tener al menos 6 dígitos")
    .regex(/^\d+$/, "El documento debe contener solo números"),
  documentType: z
    .enum(["CC", "CE", "PA", "TI", "NIT", "PASSPORT", "PPT"], {
      errorMap: () => ({ message: "Tipo de documento inválido" }),
    })
    .optional()
    .default("CC"),
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(3, "El nombre completo debe tener al menos 3 caracteres"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, "El teléfono debe contener entre 7 y 15 dígitos numéricos")
    .optional()
    .or(z.literal("")),
  moduleId: z.string().optional(),
  serviceTypeId: z.string().min(1, "El tipo de servicio es requerido"),
  dataTreatmentAccepted: z.boolean().optional().default(true),
  isPriority: z.boolean().optional().default(false),
});

export const customerUpdateSchema = z.object({
  documentType: z.enum(["CC", "CE", "PA", "TI", "NIT", "PASSPORT", "PPT"], {
    errorMap: () => ({ message: "Tipo de documento inválido" }),
  }),
  documentNumber: z
    .string()
    .min(1, "El número de documento es requerido")
    .min(6, "El número de documento debe tener al menos 6 dígitos")
    .regex(/^\d+$/, "El documento debe contener solo números"),
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .min(3, "El nombre completo debe tener al menos 3 caracteres"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos numéricos")
    .optional()
    .or(z.literal("")),
});

export const DEFAULT_FORM_VALUES = {
  documentNumber: "",
  documentType: "CC",
  fullName: "",
  email: "",
  phone: "",
  moduleId: "",
  serviceTypeId: "",
  dataTreatmentAccepted: true,
  isPriority: false,
};

export const DEFAULT_CUSTOMER_UPDATE_VALUES = {
  documentType: "CC",
  documentNumber: "",
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
  { label: "PPT (Permiso por Protección Temporal)", value: "PPT" },
];

export const TICKET_FORM_FIELDS = [
  {
    name: "documentNumber",
    label: "Número de Documento *",
    required: true,
    placeholder: "Ingrese el número de documento",
  },
  {
    name: "fullName",
    label: "Nombre Completo *",
    required: true,
    placeholder: "Ingrese el nombre completo",
    full: true,
  },
  {
    name: "serviceTypeId",
    label: "Tipo de servicio *",
    type: "select",
    required: true,
    placeholder: "Seleccione un servicio",
    optionsKey: "services",
  },
  {
    name: "documentType",
    label: "Tipo de Documento",
    type: "select",
    placeholder: "Seleccione tipo documento (opcional)",
    optionsKey: "documentTypes",
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "Ingrese el teléfono (opcional)",
  },
  {
    name: "email",
    label: "Correo Electrónico",
    type: "email",
    placeholder: "correo@ejemplo.com (opcional)",
  },
  {
    name: "isPriority",
    label: "¿Requiere atención prioritaria? (Adulto mayor, embarazo o discapacidad)",
    type: "checkbox",
    full: true,
  },
  {
    name: "dataTreatmentAccepted",
    label: (
      <span>
        He leído y acepto los{" "}
        <a href="/autorizacion-datos" target="_blank" rel="noopener noreferrer" className="generic-form-modal__link">
          términos y condiciones
        </a>
      </span>
    ),
    type: "checkbox",
    full: true,
  },
];
