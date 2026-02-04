import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getChatSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL,{
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      console.log("socket connected", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("socket connect error", err.message);
    });
  }

  return socket;
};

export const closeChatSocket = () => {
  socket?.disconnect();
  socket = null;
};
