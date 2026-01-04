import { z } from "zod";

export const userSchema = z
  .object({
    fullName: z.string().min(1, "El nombre completo es requerido").max(200),
    email: z.string().email("Correo inválido"),
    password: z.string().optional().or(z.literal("")),
    roleName: z.enum(["SUPERADMIN", "ADMIN", "ATTENDANT"]).optional(),
    tenantId: z.string().optional().or(z.literal("")),
    documentType: z.enum(["CC", "CE", "PA", "TI", "NIT", "PASSPORT"]).optional().or(z.literal("")),
    documentNumber: z.string().optional().or(z.literal("")),
    status: z.boolean().default(true),
  })
  .refine((data) => !data.password || data.password.length >= 8, {
    message: "La contraseña debe tener al menos 8 caracteres",
    path: ["password"],
  });

export const FORM_FIELDS = [
  { name: "fullName", label: "Nombre Completo", required: true },
  { name: "email", label: "Correo Electrónico", type: "email", required: true },
  { name: "password", label: "Contraseña", type: "password", required: false },
  { name: "roleName", label: "Rol", type: "select", required: true },
  { name: "tenantId", label: "Notaría", type: "select" },
  { name: "documentType", label: "Tipo de Documento", type: "select" },
  { name: "documentNumber", label: "Número de Documento" },
  { name: "status", label: "Usuario activo", type: "checkbox", full: true },
];

export const DEFAULT_FORM_VALUES = {
  fullName: "",
  email: "",
  password: "",
  roleName: "",
  tenantId: "",
  documentType: "",
  documentNumber: "",
  status: true,
};

export const ROLE_LABELS = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Admin",
  ATTENDANT: "Asesor",
};

export const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "true", label: "Activos" },
  { value: "false", label: "Inactivos" },
];

export const ROL_OPTIONS = [
  { value: "", label: "Todos los roles" },
  { value: "SUPERADMIN", label: "Super Administrador" },
  { value: "ADMIN", label: "Administrador" },
  { value: "ATTENDANT", label: "Asesor" },
];
