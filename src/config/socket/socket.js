import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket = null;

export const createSocketConnection = (token) => {
  if (!token) return null;

  if (socket) {
    if (socket.connected) return socket;

    // Reconeccion
    socket.auth.token = token;
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    autoConnect: true,
    reconnectionAttempts: 5,
    // timeout: 10000,
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
