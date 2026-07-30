import { ApiError, asyncHandler } from "../utils/helper.utils.js";
import { orderModel, tableModel, customerModel } from "../model/assoication.js";
import restaurantModel from "../model/restaurant.model.js";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    getAllOrders: asyncHandler(async (req, res) => {
        let { search, startDate, endDate, date, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        const where = { };

        if (search) {
            where[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { orderId: { [Op.like]: `%${search}%` } },
                { '$table.name$': { [Op.like]: `%${search}%` } }
            ];
        }

        if (startDate || endDate) {
            where.createdAt = {};

            if (startDate && endDate) {
                where.createdAt[Op.gte] = new Date(startDate);

                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                where.createdAt[Op.lte] = end;
            }

            if (startDate && !endDate) {
                where.createdAt[Op.eq] = new Date(startDate);
            }
        } else if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);

            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            where.createdAt = {
                [Op.between]: [start, end]
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
            limit, offset, raw: true, nest: true,
            subQuery: false
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
        if (!order) throw ApiError("Order not found", 404)

        if (status === 'cancelled') order.total = order.order.reduce((acc, item) => (acc + (item.discountPrice * item.qty)), 0)
        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    }, 'updateOrderStatus'),

    updatePaymentStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) throw ApiError('Status is required', 400);

        const validStatuses = ['paid', 'pending'];
        if (!validStatuses.includes(status.toLowerCase())) throw ApiError('Invalid payment status', 400);

        const order = await orderModel.findByPk(id);
        if (!order) throw ApiError("Order not found", 404);

        order.total = order.order.reduce((acc, item) => (acc + (item.discountPrice * item.qty)), 0)
        order.paymentStatus = status.toLowerCase();
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            data: order
        });
    }, 'updatePaymentStatus'),

    getCustomerOrderHistory: asyncHandler(async (req, res) => {
        const { phone } = req.body;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        if (!phone) throw ApiError('Phone number is required', 400);

        const customer = await customerModel.findOne({ where: { phone: phone.trim() } });
        if (!customer) {
            return res.status(200).json({ success: true, data: [] });
        }

        const { count, rows: orders } = await orderModel.findAndCountAll({
            where: { customerId: customer.id,},
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            raw: true, nest: true
        });

        const totalPages = Math.ceil(count / limit);

        return res.status(200).json({
            success: true,
            data: orders,
            page,
            limit,
            totalPages,
            totalItems: count
        });

    }, 'getCustomerOrderHistory'),

    getReceipt: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const order = await orderModel.findByPk(id, {
            include: [
                { model: tableModel, as: 'table', attributes: ['name'] },
                { model: customerModel, as: 'customer', attributes: ['name', 'phone'] }
            ]
        });

        if (!order) throw ApiError("Order not found", 404);
        const restaurant = await restaurantModel.findOne({});

        const itemsHtml = (order.order || []).map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.discountPrice}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.qty * item.discountPrice}</td>
            </tr>
        `).join('');

        const itemsTotal = (order.order || []).reduce((sum, item) => sum + (item.qty * item.discountPrice), 0);
        const taxTotal = parseFloat(order.tax) || 0;
        const grandTotal = order.paymentMode === 'online' ? order.total : (itemsTotal + taxTotal);
        const orderIdDisplay = order.id.split('-')[0].toUpperCase();

        const templatePath = path.join(__dirname, '../template/invoice.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        html = html.replace('{{RESTAURANT_NAME}}', restaurant.name || '')
            .replace('{{RESTAURANT_PHONE_HTML}}', restaurant.phone ? `<p>Phone: ${restaurant.phone}</p>` : '')
            .replace('{{RESTAURANT_EMAIL_HTML}}', restaurant.email ? `<p>Email: ${restaurant.email}</p>` : '')
            .replace('{{CUSTOMER_NAME}}', order.customer?.name || '')
            .replace('{{CUSTOMER_PHONE}}', order.customer?.phone || '')
            .replace('{{ORDER_ID}}', orderIdDisplay)
            .replace('{{ORDER_DATE}}', new Date(order.createdAt).toLocaleString())
            .replace('{{ORDER_STATUS}}', order.status.toUpperCase())
            .replace('{{TABLE_NAME}}', order.table?.name || 'N/A')
            .replace('{{ITEMS_HTML}}', itemsHtml)
            .replace('{{SUBTOTAL}}', itemsTotal.toFixed(2))
            .replace('{{TAX_LABEL}}', `Taxes & Charges ${order.gst_type === 'percentage' ? `(${order.gst_rate}%)` : ''}:`)
            .replace('{{TAX_TOTAL}}', taxTotal.toFixed(2))
            .replace('{{GRAND_TOTAL}}', parseFloat(grandTotal).toFixed(2))
            .replace('{{PAYMENT_MODE}}', order.paymentMode);

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="receipt-${orderIdDisplay}.pdf"`
        });

        return res.status(200).send(Buffer.from(pdfBuffer));
    }, 'getReceipt')
}