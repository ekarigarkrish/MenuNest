import { Server } from 'socket.io';
import config from './config.js';
import customerModel from '../model/customer.model.js'
import tableModel from '../model/table.model.js'
import orderModel from '../model/order.model.js';

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
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on("place_order", async (data) => {
          const { tableToken, cart,tax,gst_type, gst_rate, total, firstName, lastName, phone, orderId, paymentMode } = data;
          // console.log("🏓 Received place_order from " + socket.id, data);

           if (!phone) {
            socket.emit("order_error", {
              success: false,
              message: "Something went wrong!",
              isphoneExist:false
            })
            return
          }

          const customerPromise = customerModel.findOrCreate({
            where: { phone: phone.trim() },
            defaults: {
              name: `${firstName.trim()} ${lastName.trim()}`,
              phone: phone.trim()
            }
          })

          const tablePromise = tableModel.findOne({ where: { tableToken }, attributes: ['id', 'name'] })
          const [[customer], table] = await Promise.all([customerPromise, tablePromise])

          if (!table) {
            socket.emit("order_error", {
              success: false,
              message: "Table not found. Please scan a valid QR code.",
            })
            return
          }

          const order = await orderModel.create({
            tableId: table.id, customerId: customer.id, order: cart,
            ...(paymentMode === 'online' && { total, tax, gst_type, gst_rate, orderId, paymentStatus: 'paid', paymentMode })
          }, { raw: true })

          io.emit("display_orders", {
            success: true,
            message: 'order placed',
            total, table,
            order: {
              id: order.id,
              status: order.status,
              createdAt: order.createdAt,
              items: order.order.map(item => ({ id: item.id, quantity: item.qty, price: item.discountPrice, name: item.name, isVeg: item.isVeg === 1 }))
            }
          })
          
          socket.emit("order_success", {
            success: true,
            message: "Order placed successfully!",
          })
        });

      } catch (error) {
        socket.emit("order_error", {
          success: false,
          message: "Order failed",
        })
      }


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
