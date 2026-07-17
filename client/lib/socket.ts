import { io, Socket } from 'socket.io-client';
import config from '../config/config';

let socket: Socket | undefined;

export const getSocket = (): Socket => {
  if (!socket) {
    const serverUrl = config.serverOrigin;
    socket = io(serverUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Allow fallback
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket?.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
};
