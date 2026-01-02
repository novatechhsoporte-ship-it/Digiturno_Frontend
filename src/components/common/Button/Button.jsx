import React from 'react';
import './Button.scss';

/**
 * Componente Button - Átomo reutilizable
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.fullWidth - Si ocupa todo el ancho
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Handler de click
 * @param {string} props.type - Tipo de botón (button, submit, reset)
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth && 'btn--full-width',
    disabled && 'btn--disabled',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};




