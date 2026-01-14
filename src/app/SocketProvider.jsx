import { useEffect } from "react";
import createSocketConnection, { disconnectSocket } from "@config/socket";

/**
 * SocketProvider
 * - Conecta el socket cuando hay token
 * - Desconecta al desmontar
 */
export default function SocketProvider({ token, children }) {
  useEffect(() => {
    if (!token) return;

    const socket = createSocketConnection(token);
    console.log("socket provider:>> ", socket);

    return () => {
      disconnectSocket();
    };
  }, [token]);

  return children;
}
