import { useEffect } from "react";
import { createSocketConnection, disconnectSocket } from "@config/socket";

/**
 * SocketProvider
 * - Conecta el socket cuando hay token
 * - Desconecta al desmontar
 */
export const SocketProvider = ({ token, children }) => {
  useEffect(() => {
    if (!token) return;

    createSocketConnection(token);
  }, [token]);

  return children;
};
