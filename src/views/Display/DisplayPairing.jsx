import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { DisplaysApi } from "@core/api/displays";
import "./DisplayPairing.scss";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

const DISPLAY_TOKEN_KEY = "display_token";
const PAIRING_CODE_KEY = "display_pairing_code";

export const DisplayPairing = () => {
  const navigate = useNavigate();
  const [pairingCode, setPairingCode] = useState(null);
  const [pairingExpiresAt, setPairingExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingCode, setGeneratingCode] = useState(false);

  // Check for existing token on mount and generate code automatically
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem(DISPLAY_TOKEN_KEY);

      if (token) {
        // If there's already a token, verify and redirect
        await verifyTokenAndRedirect(token);
      } else {
        // No token, check if there's a saved pairing code
        const savedCode = localStorage.getItem(PAIRING_CODE_KEY);
        if (savedCode) {
          setPairingCode(savedCode);
          setPairingExpiresAt(new Date(Date.now() + 5 * 60 * 1000));
          setLoading(false);
        } else {
          // No saved code, generate one automatically
          await handleGeneratePairingCode();
        }
      }
    };

    checkToken();
  }, []);

  // Listen for pairing confirmation via Socket.IO
  useEffect(() => {
    if (!pairingCode) return;

    // Create a temporary socket connection to listen for pairing confirmation
    // We need to connect without token for pairing
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {}, // No token for pairing
    });

    socket.on("connect", () => {
      console.log("Socket conectado para pairing");
      socket.emit("join-pairing", pairingCode);
    });

    socket.on("connect_error", (error) => {
      console.error("Error conectando Socket.IO para pairing:", error);
    });

    socket.on("display:paired", (data) => {
      console.log("data en socket:>> ", data);
      if (data.pairingCode === pairingCode && data.token) {
        // Save token and redirect
        localStorage.setItem(DISPLAY_TOKEN_KEY, data.token);
        localStorage.removeItem(PAIRING_CODE_KEY);
        socket.disconnect();
        navigate(`/display/${data.tenantId}`);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("display:paired");
      socket.disconnect();
    };
  }, [pairingCode, navigate]);

  // Verify token and redirect if valid
  const verifyTokenAndRedirect = async (token) => {
    try {
      const response = await DisplaysApi.getCurrentDisplay(token);
      // The response from axios is already response.data
      const displayInfo = response.data?.data || response.data;
      const tenantId = displayInfo.tenantId?._id || displayInfo.tenantId;

      if (tenantId) {
        // Redirect to display view with tenantId
        navigate(`/display/${tenantId}`);
      } else {
        throw new Error("No tenant ID found");
      }
    } catch (error) {
      console.error("Error verificando token del display:", error);
      // Token is invalid, clear it and show pairing screen
      localStorage.removeItem(DISPLAY_TOKEN_KEY);
      setLoading(false);
    }
  };

  // Generate pairing code
  const handleGeneratePairingCode = async () => {
    try {
      setGeneratingCode(true);
      const response = await DisplaysApi.generatePairingCode();
      // The response from axios is already response.data
      const data = response.data?.data || response.data;
      const { pairingCode: code, expiresAt } = data;
      setPairingCode(code);
      setPairingExpiresAt(new Date(expiresAt));
      // Save pairing code to localStorage
      localStorage.setItem(PAIRING_CODE_KEY, code);
      setLoading(false);
    } catch (error) {
      console.error("Error generando código:", error);
      toast.error(error?.response?.data?.error || "Error generando código de emparejamiento");
      setLoading(false);
    } finally {
      setGeneratingCode(false);
    }
  };

  if (loading || generatingCode) {
    return (
      <div className="display-pairing">
        <div className="display-pairing__container">
          <div className="display-pairing__loading">
            <div className="display-pairing__spinner"></div>
            <p className="display-pairing__loading-text">Preparando dispositivo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Split code into individual digits for display
  const codeDigits = pairingCode ? pairingCode.split("") : [];

  return (
    <div className="display-pairing">
      <div className="display-pairing__container">
        <div className="display-pairing__brand">
          <div className="display-pairing__logo">📺</div>
          {/* <h1 className="display-pairing__brand-name">Sistema de Turnos</h1> */}
        </div>

        <div className="display-pairing__content">
          <h2 className="display-pairing__title">Vincular Dispositivo</h2>
          <p className="display-pairing__subtitle">
            Para registrar esta pantalla, ingrese el siguiente código en el panel de administración
          </p>

          <div className="display-pairing__code-wrapper">
            <div className="display-pairing__code-boxes">
              {codeDigits.map((digit, index) => (
                <div key={index} className="display-pairing__code-box">
                  {digit}
                </div>
              ))}
            </div>
          </div>

          {pairingExpiresAt && (
            <div className="display-pairing__info">
              <div className="display-pairing__info-icon">⏱️</div>
              <p className="display-pairing__info-text">
                Este código expira en <strong>{Math.max(0, Math.ceil((pairingExpiresAt - new Date()) / 1000 / 60))}</strong>{" "}
                minutos
              </p>
            </div>
          )}

          <button className="display-pairing__refresh" onClick={handleGeneratePairingCode} disabled={generatingCode}>
            <span className="display-pairing__refresh-icon">🔄</span>
            <span>Generar Nuevo Código</span>
          </button>
        </div>

        <div className="display-pairing__footer">
          <p className="display-pairing__footer-text">Una vez registrado, esta pantalla mostrará los turnos automáticamente</p>
        </div>
      </div>
    </div>
  );
};
