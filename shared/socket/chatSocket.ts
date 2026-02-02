import {io, Socket} from "socket.io-client";

let socket : Socket | null = null;

export const getChatSocket = () => {
    if(!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/chat`, {
            withCredentials: true,
            autoConnect : false 
        });

        socket.on("connect", () => {
        });

        socket.on("connect_error", (err) => {
        });
    }

    return socket;
}

export const closeChatSocket = () => {
  socket?.disconnect();
  socket = null;
};
