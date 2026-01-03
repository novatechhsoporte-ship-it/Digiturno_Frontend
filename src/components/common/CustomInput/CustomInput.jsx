import React from "react";
import "./CustomInput.scss";

/**
 * Componente Input - Átomo reutilizable
 * @param {Object} props
 * @param {string} props.type - Tipo de input (text, email, password, etc.)
 * @param {string} props.label - Etiqueta del input
 * @param {string} props.error - Mensaje de error
 * @param {string} props.placeholder - Placeholder
 * @param {boolean} props.required - Campo requerido
 * @param {boolean} props.disabled - Estado deshabilitado
 */
export const CustomInput = ({
  type = "text",
  label,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`input ${error ? "input--error" : ""}`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
