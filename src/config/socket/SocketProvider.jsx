import { useEffect } from "react";
import { createSocketConnection, disconnectSocket } from "./socket";

/**
 * SocketProvider
 * - Conecta el socket cuando hay token
 * - Desconecta al desmontar
 */
export const SocketProvider = ({ token, children }) => {
  useEffect(() => {
    console.log("token :>> ", token);
    if (!token) {
      disconnectSocket();
      return;
    }

    createSocketConnection(token);
  }, [token]);

  return children;
};
