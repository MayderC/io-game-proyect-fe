import { io } from "socket.io-client";
const URL = import.meta.env.VITE_API_URL;

export const setSocket = () => {
  return io(URL);
};
