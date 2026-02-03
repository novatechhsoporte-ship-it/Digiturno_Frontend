import { Can } from "@components/Permissions/Can";
import { CustomButton, CustomIcon } from "@components/common";
import "./QrHeader.scss";

export const QrHeader = ({ onNewQr }) => {
  return (
    <header className="qr-header">
      <div>
        <h1 className="qr-header__title">Gestión de Códigos QR</h1>
        <p className="qr-header__subtitle">Administra los códigos QR de acceso público</p>
      </div>

      <Can any={["qr.create", "qr.manage"]}>
        <CustomButton variant="primary" onClick={onNewQr}>
          <CustomIcon name="mdi:qrcode-plus" size="sm" />
          Crear Código QR
        </CustomButton>
      </Can>
    </header>
  );
};

