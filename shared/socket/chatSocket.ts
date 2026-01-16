import {io, Socket} from "socket.io-client";

let socket : Socket | null = null;

export const getChatSocket = () => {
    if(!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/chat`, {
            withCredentials: true,
            autoConnect : false 
        });

        socket.on("connect", () => {
            console.log("socket connected", socket?.id)
        });

        socket.on("connect_error", (err) => {
            console.log("socket connect error", err.message)
        });
    }

    return socket;
}

export const closeChatSocket = () => {
  socket?.disconnect();
  socket = null;
};
