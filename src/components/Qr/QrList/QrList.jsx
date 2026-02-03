import { QrCard } from "../QrCard/QrCard";
import "./QrList.scss";

export const QrList = ({ qrCodes, loading, onEdit, onDelete, filters }) => {
  // Filter QR codes by search term if provided
  const filteredQrCodes = filters?.search
    ? qrCodes.filter((qr) => qr.publicToken?.toLowerCase().includes(filters.search.toLowerCase()))
    : qrCodes;

  if (loading) {
    return <div className="qr-list qr-list--state">Cargando códigos QR...</div>;
  }

  if (!filteredQrCodes.length) {
    return (
      <div className="qr-list qr-list--state">
        {filters?.search ? "No se encontraron códigos QR con ese token" : "No hay códigos QR registrados"}
      </div>
    );
  }

  return (
    <div className="qr-list">
      {filteredQrCodes.map((qr) => (
        <QrCard key={qr._id} qr={qr} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

