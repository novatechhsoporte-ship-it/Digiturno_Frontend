import React, { forwardRef } from "react";
import { CustomIcon } from "../CustomIcon/CustomIcon";
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

export const CustomInput = forwardRef(
  ({ type = "text", label, error, icon, fullWidth = false, required = false, className = "", id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isCheckbox = type === "checkbox";

    // Contenedor principal
    const wrapperClass = [
      "custom-input",
      isCheckbox ? "custom-input--checkbox" : "",
      fullWidth ? "custom-input--full" : "",
      error ? "custom-input--has-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // RENDER PARA CHECKBOX
    if (isCheckbox) {
      return (
        <div className={wrapperClass}>
          <label htmlFor={inputId} className="custom-input__checkbox-label">
            <input ref={ref} id={inputId} type="checkbox" className="custom-input__checkbox" {...props} />
            <span className="custom-input__checkbox-text">
              {label}
              {required && <span className="custom-input__required">*</span>}
            </span>
          </label>
          {error && <span className="custom-input__error-msg">{error}</span>}
        </div>
      );
    }

    // RENDER PARA TEXT/PASSWORD/EMAIL
    return (
      <div className={wrapperClass}>
        {label && (
          <label htmlFor={inputId} className="custom-input__label">
            {label}
            {required && <span className="custom-input__required">*</span>}
          </label>
        )}
        <div className="custom-input__field-wrapper">
          {icon && (
            <span className="custom-input__icon">
              <CustomIcon name={icon} size="sm" />
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`custom-input__field ${icon ? "custom-input__field--with-icon" : ""}`}
            {...props}
          />
        </div>
        {error && <span className="custom-input__error-msg">{error}</span>}
      </div>
    );
  }
);
