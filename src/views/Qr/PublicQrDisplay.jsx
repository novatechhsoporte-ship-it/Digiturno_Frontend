// PublicQrDisplay.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QrApi } from "@core/api/qr";
import "./PublicQrDisplay.scss";

export const PublicQrDisplay = () => {
  const { token } = useParams();
  const [qr, setQr] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const response = await QrApi.getQrByToken(token);
        console.log("response :>> ", response);
        const data = response.data?.data || response.data;

        setQr(data.qrBase64);
        setTenant(data.tenant);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQr();
  }, [token]);

  if (loading) {
    return (
      <div className="qr-display">
        <p>Cargando QR...</p>
      </div>
    );
  }

  if (!qr || !tenant) {
    return (
      <div className="qr-display">
        <p>No se pudo cargar el código QR</p>
      </div>
    );
  }

  return (
    <div className="qr-display">
      {tenant?.logo && <img src={tenant.logo} alt={`Logo de ${tenant.name}`} className="qr-display__logo" />}
      {tenant?.name && <h1>{tenant.name}</h1>}

      <img src={qr} alt="Escanea para tomar turno" className="qr-display__image" />

      <p>Escanea este código para tomar tu turno</p>
    </div>
  );
};
