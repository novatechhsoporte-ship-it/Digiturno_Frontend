/**
 * Estructura del menú del Sidebar
 * Se filtra según los roles del usuario
 * Por ahora solo Dashboard para todos los usuarios
 */
export const SIDEBAR_MENU = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "mdi:view-dashboard",
    roles: [], // Vacío significa que todos los usuarios pueden verlo
  },
  // Más opciones se agregarán según el rol del usuario
  {
    path: "/turnos",
    label: "Turnos",
    icon: "mdi:ticket",
    roles: ["Usuario", "Admin", "SuperAdmin"],
  },
];
