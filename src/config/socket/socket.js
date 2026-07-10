import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket = null;

export const createSocketConnection = (token) => {
  if (!token) return null;

  if (socket) {
    // Si el token cambió, desconectamos y volvemos a conectar con el nuevo token
    if (socket.auth && socket.auth.token !== token) {
      console.log("Socket token changed. Reconnecting with new token...");
      socket.disconnect();
      socket.auth.token = token;
      socket.connect();
      return socket;
    }

    if (socket.connected) return socket;

    // Reconexión
    socket.auth.token = token;
    socket.connect();
    return socket;
  }

  console.log("Initializing new socket connection to:", SOCKET_URL);
  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    autoConnect: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully! ID:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected! Reason:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
};
