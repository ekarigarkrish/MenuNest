import customerModel from "../model/customer.model.js";
import tableModel from "../model/table.model.js";
import orderModel from "../model/order.model.js";
import { getIo } from "../config/socket.config.js";
import userModel from "../model/user.model.js";
import { sendWhatsAppMessage } from "./sendMessage.service.js";

export default {
    placeOrder: async (socket, data) => {
        try {
            const io = getIo()
            const { tableToken, cart, tax, gst_type, gst_rate, total, firstName, lastName, phone, orderId, paymentMode } = data;
            //  console.log("🏓 Received place_order from " + socket.id, data);

            const customerPromise = await customerModel.findOrCreate({
                where: { phone: phone.trim() },
                defaults: {
                    name: `${firstName.trim()} ${lastName.trim()}`,
                    phone: phone.trim()
                }
            })

            const tablePromise = tableModel.findOne({ where: { tableToken }, attributes: ['id', 'name', 'userId'] })
            const [[customer], table] = await Promise.all([customerPromise, tablePromise])

            if (!table) {
                socket.emit("order_error", {
                    success: false,
                    message: "Table not found. Please scan a valid QR code.",
                })
                return
            }

            const staff = await userModel.findOne({ where: { id: table.userId }, attributes: ['phone'], raw: true })
            const orderDetails = cart.map(item => `${item.qty} x ${item.name}`).join('\n');
            const messageBody = `*New Order* 🍽️\n*Table:* ${table.name}\n*Status:* pending\n*Customer:* ${firstName.trim()} ${lastName.trim()}\n\n*Order Details:*\n${orderDetails}`;

            sendWhatsAppMessage(staff.phone, messageBody).catch((error) => {
                console.error('WhatsApp notification failed:', error);
            })

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

        } catch (error) {
            console.log('socket service (placeOrder) error -->', error);
            socket.emit("order_error", {
                success: false,
                message: "Order failed",
            })
        }
    }
}