import { useMemo } from "react";
import { createSocketConnection, disconnectSocket } from "./socket";

/**
 * SocketProvider
 * - Conecta el socket cuando hay token de forma síncrona
 * - Desconecta al desmontar o cuando el token es nulo
 */
export const SocketProvider = ({ token, children }) => {
  useMemo(() => {
    console.log("SocketProvider token changed :>> ", token);
    if (!token) {
      disconnectSocket();
      return;
    }

    createSocketConnection(token);
  }, [token]);

  return children;
};
