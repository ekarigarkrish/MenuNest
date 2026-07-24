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
        const { search } = req.query;
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

        const customers = await customerModel.findAll({
            where,
            include: [{
                model: orderModel,
                as: 'orders',
                required: false // LEFT JOIN so we don't drop customers without orders
            }],
            order: [['createdAt', 'DESC']],
            subQuery: false // required when referencing included models in top-level where clause
        });
        return res.status(200).json({ success: true, customers });
    }, 'getCustomers')
}