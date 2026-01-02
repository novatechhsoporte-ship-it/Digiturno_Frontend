import { Icon as IconifyIcon } from "@iconify/react";
import "./Icon.scss";

/**
 * Componente Icon - Administrador de iconos usando @iconify/react
 * Todos los iconos deben ser SVG desde Iconify
 * @param {Object} props
 * @param {string} props.name - Nombre del icono de Iconify (ej: 'mdi:home')
 * @param {string} props.size - Tamaño del icono ('sm' | 'md' | 'lg' | 'xl')
 * @param {string} props.color - Color del icono (usa variables SASS)
 * @param {Function} props.onClick - Handler de click (opcional)
 */
export const Icon = ({ name, size = "md", color = "currentColor", className = "", onClick, ...props }) => {
  const classes = ["icon", `icon--${size}`, onClick && "icon--clickable", className].filter(Boolean).join(" ");

  const style = {
    color: color !== "currentColor" ? color : undefined,
  };

  return <IconifyIcon icon={name} className={classes} style={style} onClick={onClick} {...props} />;
};
