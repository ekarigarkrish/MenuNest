import { ApiError, asyncHandler } from "../utils/helper.utils.js";
import { orderModel, tableModel, customerModel } from "../model/assoication.js";
import { Op } from "sequelize";

export default {
    getAllOrders: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const date = req.query.date;
        const offset = (page - 1) * limit;

        const where = {};
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            where.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        }

        const { count, rows } = await orderModel.findAndCountAll({
            include: [
                {
                    model: tableModel,
                    as: 'table',
                    attributes: ['id', 'name']
                }
            ],
            where,
            order: [['createdAt', 'DESC']],
            limit, offset, raw: true, nest: true
        });

        const formattedOrders = rows.map(order => {
            const items = Array.isArray(order.order) ? order.order.map(item => ({
                id: item.id,
                quantity: item.qty,
                price: item.discountPrice,
                name: item.name,
                isVeg: item.isVeg === 1
            })) : [];

            return {
                id: order.id,
                orderId: order.orderId,
                tableId: order.table ? order.table.id : null,
                tableName: order.table ? order.table.name : 'Unknown Table',
                status: order.status, items,
                total: order.total,
                paymentMode: order.paymentMode,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
            };
        });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            success: true,
            data: formattedOrders,
            pagination: {
                page,
                limit,
                totalPages,
                totalItems: count
            }
        });
    }, 'getAllOrders'),

    getliveReceivingData: asyncHandler(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await orderModel.findAndCountAll({
            include: [{
                model: tableModel,
                as: 'table',
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            raw: true, nest: true
        });

        // Format orders to match the client's expected structure
        const formattedOrders = rows.map(order => {

            // Map the `order` JSON array to the items format expected by the frontend
            const items = Array.isArray(order.order) ? order.order.map(item => ({
                id: item.id,
                quantity: item.qty,
                price: item.discountPrice,
                name: item.name,
                isVeg: item.isVeg === 1
            })) : [];

            return {
                id: order.id,
                tableId: order.table ? order.table.id : null,
                tableName: order.table ? order.table.name : 'Unknown Table',
                status: order.status,
                items: items,
                total: order.total,
                paymentMode: order.paymentMode,
                paymentStatus: order.paymentStatus,
                totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                createdAt: order.createdAt
            };
        });
        console.log(formattedOrders);

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            success: true,
            data: formattedOrders,
            pagination: {
                page,
                limit,
                totalPages,
                totalItems: count
            }
        });
    }, 'getliveReceivingData'),

    updateOrderStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) throw ApiError('Status is required', 400)


        const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'served', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) throw ApiError('Invalid status', 400);

        const order = await orderModel.findByPk(id);
        if (!order) throw ApiError("Order not found", 404);

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    }, 'updateOrderStatus')
}