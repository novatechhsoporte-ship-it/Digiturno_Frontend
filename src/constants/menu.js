/**
 * Estructura del menú del Sidebar
 * Se filtra según los roles del usuario
 * Vacío significa que todos los usuarios pueden verlo
 */
export const SIDEBAR_MENU = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "mdi:view-dashboard",
    roles: [],
  },
  {
    path: "/tenants",
    label: "Notarias",
    icon: "mdi:home-analytics",
    roles: ["SUPERADMIN", "ADMIN", "ATTENDANT"],
  },
  {
    path: "/modules",
    label: "Modulos",
    icon: "mdi:view-module-outline",
    roles: ["SUPERADMIN", "ADMIN", "ATTENDANT"],
  },
  {
    path: "/users",
    label: "Usuarios",
    icon: "mdi:users-group",
    roles: ["SUPERADMIN", "ADMIN", "ATTENDANT"],
  },
];
