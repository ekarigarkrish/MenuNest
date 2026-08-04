import { Server } from 'socket.io';
import config from './config.js';
import socketService from '../services/socket.service.js';

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
      try {
        console.log(`🔌 New client connected: ${socket.id}`)

        socket.on("place_order", async (data) => {
          socketService.placeOrder(socket, data)
        })


      } catch (error) {
        socket.emit("socket_error", {
          success: false,
          message: "Error in socket connection",
        })
      }


      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
      })
    })

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
