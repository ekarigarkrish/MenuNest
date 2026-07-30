import { ApiError, asyncHandler, signToken } from "../utils/helper.utils.js";
import { customerModel, orderModel } from "../model/assoication.js";
import { Op } from "sequelize";
import config from "../config/config.js";

export default {
    checkCustomerByPhone: asyncHandler(async (req, res) => {
        const { phone } = req.body;
        if (!phone) throw ApiError('Phone number is required', 400);

        const customer = await customerModel.findOne({ where: { phone } });
        if (customer) {
            const names = customer.name.split(' ');
            const firstName = names[0];
            const lastName = names.slice(1).join(' ');

            const token = signToken({ customerId: customer.id, role: 'customer' })
            res.cookie('customer-token', token, {
                httpOnly: false,
                secure: !config.isDEV,
                sameSite: config.isDEV ? 'lax' : 'none',
            })

            return res.status(200).json({
                success: true,
                exists: true,
                customer: { firstName, lastName, phone: customer.phone }
            });
        }
        return res.status(200).json({ success: true, exists: false });
    }, 'checkCustomerByPhone'),

    getCustomers: asyncHandler(async (req, res) => {
        let { search, startDate, endDate, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;
        let where = {};

        if (search) {
            where = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { '$orders.id$': { [Op.like]: `%${search}%` } }
                ]
            };
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
        }

        const { rows, count } = await customerModel.findAndCountAll({
            where, limit, offset,
            include: [{
                model: orderModel,
                as: 'orders',
                required: false
            }],
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'name', 'phone', 'createdAt'],
            subQuery: false, // required when referencing included models in top-level where clause
            distinct: true,
        });
        // console.log(rows);

        return res.status(200).json({
            success: true,
            customers: rows,
            pagination: {
                page,
                limit,
                total: count
            }
        });
    }, 'getCustomers'),

    getCustomerInfo: asyncHandler(async (req, res) => {
        const { customer: { customerId } } = req;
        if (!customerId) throw ApiError('Something went wrong!', 404);

        const cus = await customerModel.findByPk(customerId);
        if (!cus) throw ApiError('Something went wrong!', 404)

        return res.status(200).json({
            success: true,
            message: 'Data Fetch Successfully!',
            cus
        });
    }, 'getCustomerInfo'),

    updateCustomerInfo: asyncHandler(async (req, res) => {
        const { customer: { customerId } } = req;
        const { firstName, lastName, phone } = req.body;
        if (!firstName || !lastName || !phone) throw ApiError('All fields are required', 400);

        const customer = await customerModel.findOne({ where: { id: customerId } });
        if (!customer) throw ApiError('Something went wrong!', 404);

        customer.name = `${firstName} ${lastName}`
        customer.phone = phone;

        await customer.save();
        return res.status(200).json({
            success: true,
            message: 'Customer updated successfully',
            customer
        });
    }, 'updateCustomerInfo')
}