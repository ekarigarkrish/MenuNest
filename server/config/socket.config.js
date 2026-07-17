import { Server } from 'socket.io';
import config from './config.js';

let io;

export const initSocket = (server) => {
  try {
    io = new Server(server, {
      cors: {
        origin: config.clientOrigin,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log(`🔌 New client connected: ${socket.id}`);

      // Add your socket event listeners here
      socket.on('ping', (data) => {
        console.log(`🏓 Received ping from ${socket.id}:`, data);
        socket.emit('pong', { message: 'Pong from server!' });
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });

    return io;
  } catch (error) {
    console.log(error.message);
  }
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
