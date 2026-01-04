import React from "react";
import "./CustomSelect.scss";

/**
 * Componente Select - Átomo reutilizable
 * @param {Object} props
 * @param {string} props.label - Etiqueta del select
 * @param {string} props.error - Mensaje de error
 * @param {string} props.placeholder - Placeholder
 * @param {boolean} props.required - Campo requerido
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {Array} props.options - Array de opciones [{value, label}]
 */
export const CustomSelect = ({
  label,
  error,
  placeholder = "Seleccione una opción",
  required = false,
  disabled = false,
  className = "",
  options = [],
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`select-wrapper ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`select ${error ? "select--error" : ""}`}
        disabled={disabled}
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};

