import React, { useEffect } from "react";

import { CustomIcon } from "@components/common";
import "./CustomModal.scss";

/**
 * Componente Modal - Reutilizable con overlay y cierre al hacer clic fuera
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado de apertura del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {React.ReactNode} props.children - Contenido dinámico del modal
 * @param {string} props.title - Título del modal (opcional)
 * @param {string} props.size - Tamaño del modal: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} props.showCloseButton - Mostrar botón de cerrar (default: true)
 * @param {boolean} props.closeOnOverlayClick - Cerrar al hacer clic en overlay (default: true)
 * @param {boolean} props.closeOnEscape - Cerrar con tecla Escape (default: true)
 * @param {string} props.className - Clase CSS adicional
 */
export const CustomModal = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = "",
}) => {
  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (e) => {
    // Prevenir que el clic dentro del contenido cierre el modal
    e.stopPropagation();
  };

  return (
    <div className={`modal ${className}`} onClick={handleOverlayClick}>
      <div
        className={`modal__overlay ${isOpen ? "modal__overlay--open" : ""}`}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div
        className={`modal__container modal__container--${size} ${isOpen ? "modal__container--open" : ""}`}
        onClick={handleContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 id="modal-title" className="modal__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button className="modal__close-btn" onClick={onClose} aria-label="Cerrar modal" type="button">
                <CustomIcon name="mdi:close" size="md" />
              </button>
            )}
          </div>
        )}
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};
