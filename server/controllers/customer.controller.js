import { ApiError, asyncHandler } from "../utils/helper.utils.js";
import { customerModel, orderModel } from "../model/assoication.js";
import { Op } from "sequelize";

export default {
    checkCustomerByPhone: asyncHandler(async (req, res) => {
        const { phone } = req.body;
        if (!phone) throw ApiError('Phone number is required', 400);

        const customer = await customerModel.findOne({ where: { phone } });
        if (customer) {
            const names = customer.name.split(' ');
            const firstName = names[0];
            const lastName = names.slice(1).join(' ');

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
    }, 'getCustomers')
}