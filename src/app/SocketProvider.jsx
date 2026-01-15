import { useEffect } from "react";
import { createSocketConnection, disconnectSocket } from "@config/socket";
// import { createSocketConnection } from "../config/socket";

/**
 * SocketProvider
 * - Conecta el socket cuando hay token
 * - Desconecta al desmontar
 */
export const SocketProvider = ({ token, children }) => {
  useEffect(() => {
    if (token) {
      createSocketConnection(token);
    } else {
      disconnectSocket();
    }
  }, [token]);

  return children;
};
