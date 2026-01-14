import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Socket singleton (una sola conexión)
let socket = null;

/**
 * Create Socket.IO connection
 * El frontend SOLO se conecta y escucha eventos
 * Las salas se asignan en el backend según el JWT
 *
 * @param {string} token - JWT token for authenticated connections
 * @returns {object} Socket.IO instance
 */
export const createSocketConnection = (token) => {
  console.log("🟡 Intentando conectar socket, token:", token);

  if (socket) return socket;

  socket = io("http://localhost:4000", {
    transports: ["websocket"],
    auth: token ? { token } : {},
  });
  // socket = io(SOCKET_URL, {
  //   transports: ["websocket"],
  //   auth: token ? { token } : {},
  // });

  socket.on("connect", () => {
    console.log("Socket conectado:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket desconectado:", reason);
  });

  socket.on("connect_error", (error) => {
    console.log("error in socket:>> ", error);
    console.error("Socket error:", error.message);
  });

  return socket;
};

/** Get current socket instance **/
export const getSocket = () => socket;

/** Close socket connection safely **/
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default createSocketConnection;

