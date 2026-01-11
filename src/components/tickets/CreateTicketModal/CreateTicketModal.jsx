import React from "react";

import { CustomButton, CustomInput, CustomSelect, CustomModal } from "@components/common";
import "./CreateTicketModal.scss";

export const CreateTicketModal = ({
  isOpen,
  onClose,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isDisabled,
  moduleOptions,
  onCreateTicket,
}) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Nuevo Turno" size="lg">
      <form className="create-ticket-modal" onSubmit={handleSubmit(onCreateTicket)}>
        <div className="create-ticket-modal__grid">
          <div className="create-ticket-modal__group">
            <CustomInput
              label="Número de Documento *"
              placeholder="Ingrese el número de documento"
              required
              error={errors.documentNumber?.message}
              {...register("documentNumber")}
            />
          </div>

          <div className="create-ticket-modal__group">
            <CustomInput
              label="Nombre Completo *"
              placeholder="Ingrese el nombre completo"
              required
              error={errors.fullName?.message}
              {...register("fullName")}
            />
          </div>

          <div className="create-ticket-modal__group">
            <CustomInput
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="create-ticket-modal__group">
            <CustomInput
              label="Teléfono"
              placeholder="Ingrese el teléfono"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div className="create-ticket-modal__group">
            <CustomSelect
              label="Módulo (Opcional)"
              error={errors.moduleId?.message}
              {...register("moduleId")}
              options={moduleOptions}
            />
          </div>
        </div>

        <div className="create-ticket-modal__actions">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancelar
          </CustomButton>

          <CustomButton type="submit" disabled={isDisabled || isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Turno"}
          </CustomButton>
        </div>
      </form>
    </CustomModal>
  );
};
