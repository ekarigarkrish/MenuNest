import { ApiError, asyncHandler } from "../utils/helper.utils.js";
import { orderModel, tableModel } from "../model/assoication.js";

export default {
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
                totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
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