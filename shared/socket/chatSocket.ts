import { io, Socket } from "socket.io-client";

export const createChatSocket = (): Socket => {
  return io(process.env.NEXT_PUBLIC_WS_URL!, {
    withCredentials: true,
    transports: ["websocket"],
  });
};
