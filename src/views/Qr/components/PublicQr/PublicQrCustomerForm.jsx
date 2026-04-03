import { CustomButton, CustomInput, CustomSelect } from "@components/common";

const DOCUMENT_TYPES = [
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PA", label: "Pasaporte" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "NIT", label: "NIT" },
  { value: "PASSPORT", label: "Pasaporte Int." },
];

export const PublicQrCustomerForm = ({ register, errors, onNext, onCancel }) => {
  const handleKeyPressNumeric = (e) => {
    // Allow only numbers
    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  return (
    <div className="public-qr__step fade-in">
      <div className="public-qr__step-header">
        <h2 className="public-qr__step-title">Ingresa tus Datos</h2>
        <p className="public-qr__step-subtitle">Necesitamos esta información para llamarte.</p>
      </div>

      <div className="public-qr__form">
        <div className="public-qr__form-grid">
          <div className="public-qr__field">
            <CustomSelect
              label="Tipo de Documento"
              required
              error={errors.documentType?.message}
              options={DOCUMENT_TYPES}
              {...register("documentType")}
            />
          </div>

          <div className="public-qr__field">
            <CustomInput
              label="Número de Documento"
              type="text"
              inputMode="numeric"
              required
              placeholder="Ej: 1012345678"
              error={errors.documentNumber?.message}
              {...register("documentNumber")}
              onKeyPress={handleKeyPressNumeric}
            />
          </div>

          <div className="public-qr__field public-qr__field--full">
            <CustomInput
              label="Nombre Completo"
              type="text"
              required
              placeholder="Ej: Juan Pérez"
              error={errors.fullName?.message}
              {...register("fullName")}
            />
          </div>

          <div className="public-qr__field">
            <CustomInput
              label="Celular"
              type="tel"
              inputMode="numeric"
              required
              placeholder="Ej: 3001234567"
              error={errors.phone?.message}
              {...register("phone")}
              onKeyPress={handleKeyPressNumeric}
              maxLength={10}
            />
          </div>

          <div className="public-qr__field">
            <CustomInput
              label="Correo Electrónico (Opcional)"
              type="email"
              placeholder="correo@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className="public-qr__field public-qr__field--full mt-2">
            <CustomInput
              type="checkbox"
              required
              error={errors.dataTreatmentAccepted?.message}
              {...register("dataTreatmentAccepted")}
              label={
                <span className="public-qr__checkbox-label-text">
                  He leído y acepto los{" "}
                  <a
                    href="/autorizacion-datos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="public-qr__link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    términos y condiciones de tratamiento de datos
                  </a>
                </span>
              }
            />
          </div>
        </div>

        <div className="public-qr__form-actions mt-6">
          <CustomButton type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
            Volver
          </CustomButton>
          <CustomButton type="button" variant="primary" onClick={onNext} className="w-full sm:w-auto">
            Continuar a Servicios
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
