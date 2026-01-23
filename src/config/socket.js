import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket = null;

export const createSocketConnection = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    auth: { token },
  });

  // logs for debugs
  // socket.on("disconnect", (reason) => {
  //   console.log("Socket desconectado:", reason);
  // });

  // socket.on("connect_error", (error) => {
  //   console.log("error :>> ", error);
  //   console.error("Socket error:", error.message);
  // });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
