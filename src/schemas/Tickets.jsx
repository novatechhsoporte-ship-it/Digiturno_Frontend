import { z } from "zod";

export const ticketSchema = z.object({
  documentNumber: z.string().min(1, "El número de documento es requerido"),
  fullName: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  moduleId: z.string().optional(),
});

export const customerUpdateSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido").optional().or(z.literal("")),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const DEFAULT_FORM_VALUES = {
  documentNumber: "",
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

