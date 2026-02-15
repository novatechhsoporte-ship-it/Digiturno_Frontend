/**
 * Estructura del menú del Sidebar
 * Se filtra según los roles del usuario
 * Vacío significa que todos los usuarios pueden verlo
 */
export const SIDEBAR_MENU = [
  // {
  //   path: "/dashboard",
  //   label: "Dashboard",
  //   icon: "mdi:view-dashboard",
  //   roles: [],
  // },
  {
    path: "/tickets",
    label: "Turnos",
    icon: "mdi:ticket-account",
    roles: ["SUPERADMIN", "ADMIN", "RECEPTION"],
  },
  {
    path: "/attendant-tickets",
    label: "Mis Turnos",
    icon: "mdi:ticket-account",
    roles: ["ATTENDANT"],
  },
  {
    path: "/tenants",
    label: "Notarias",
    icon: "mdi:home-analytics",
    roles: ["SUPERADMIN", "ADMIN", "ATTENDANT", "RECEPTION"],
  },
  {
    path: "/modules",
    label: "Modulos",
    icon: "mdi:view-module-outline",
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    path: "/users",
    label: "Usuarios",
    icon: "mdi:users-group",
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    path: "/displays",
    label: "Pantallas",
    icon: "mdi:television",
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    path: "/qr",
    label: "Códigos QR",
    icon: "mdi:qrcode",
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    path: "/services",
    label: "Servicios",
    icon: "mdi:briefcase",
    roles: ["SUPERADMIN", "ADMIN"],
  },
];
