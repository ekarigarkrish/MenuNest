import { ApiError, asyncHandler, signToken } from "../utils/helper.utils.js";
import { customerModel, orderModel } from "../model/assoication.js";
import { Op } from "sequelize";
import crypto from 'crypto'
import config from "../config/config.js";
import { exportExcel } from "../utils/export.utils.js";
import bcrypt from "bcryptjs";
import { sendWhatsAppMessage } from "../services/sendMessage.service.js";

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

    sendOnboardingOtp: asyncHandler(async (req, res) => {
        const { phone, firstName, lastName } = req.body;
        if (!phone) throw ApiError('Phone number is required', 400);

        const isExistingUser = await customerModel.findOne({ where: { phone } });
        if (isExistingUser) throw ApiError('User Already Exists! Please Verify', 400);

        const otp = crypto.randomInt(1000, 10000).toString();
        const hashedOtp = await bcrypt.hash(otp.toString(), 10);

        const response = await customerModel.create(
            {
                name: `${firstName} ${lastName}`,
                phone,
                hashOtp: hashedOtp,
                isVerified: false,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            },
            { raw: true })
        if (!response) throw ApiError('Failed to create customer', 400);

        sendWhatsAppMessage(phone, `Hello, Your OTP is ${otp}\nThis code is valid for 5 minutes`)

        return res.status(200).json({
            success: true,
            message: 'Customer created successfully',
        });

    }, 'sendOnboardingOtp'),

    verifyOnboardingOtp: asyncHandler(async (req, res) => {
        const { phone, otp } = req.body;
        if (!phone || !otp) throw ApiError('Phone number and OTP are required', 400);

        const customer = await customerModel.findOne({ where: { phone } });
        if (!customer) throw ApiError('Something went wrong!', 404);

        const isMatch = await bcrypt.compare(otp.toString(), customer.hashOtp);
        if (!isMatch) throw ApiError('Invalid OTP', 400);

        customer.isVerified = true;
        customer.hashOtp = null;
        customer.expiresAt = null;
        await customer.save();

        const token = signToken({ customerId: customer.id, role: 'customer' })
        res.cookie('customer-token', token, {
            httpOnly: false,
            secure: !config.isDEV,
            sameSite: config.isDEV ? 'lax' : 'none',
        })

        return res.status(200).json({
            success: true,
            message: 'Customer verified successfully',
        });
    }, 'verifyOnboardingOtp'),

    getCustomers: asyncHandler(async (req, res) => {
        let { search, startDate, endDate, page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;
        let where = {};

        where.isVerified = true;

        if (search) {
            where = {
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } },
                    { '$orders.id$': { [Op.like]: `%${search}%` } }
                ],
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
    }, 'updateCustomerInfo'),

    exportCustomersInfo: asyncHandler(async (req, res) => {
        const { format, startDate, endDate } = req.query;

        const where = {};

        if (startDate || endDate) {
            where.createdAt = {};

            if (startDate) {
                where.createdAt[Op.gte] = new Date(startDate);
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);

                where.createdAt[Op.lte] = end;
            }
        }

        const customers = await customerModel.findAll({
            where,
            attributes: ["id", "name", "phone", "createdAt"],
            order: [["createdAt", "DESC"]],
            raw: true,
        });
        if (customers.length === 0) throw ApiError("No customers found", 404)

        const rows = customers.map(customer => ({
            ...customer,
            createdAt: new Date(customer.createdAt).toLocaleString(),
        }));

        const columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "Created At", key: "createdAt", width: 25 },
        ];

        const { workbook } = await exportExcel(columns, rows, "Customers");

        res.setHeader(
            "Content-Type",
            format === 'xlsx' ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
                format === 'csv' ? 'text/csv' : 'application/json'
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="customers.${format}"`
        );

        await workbook.xlsx.write(res);
        return res.end();
    }, 'exportCustomersInfo'),


    sendOtp: asyncHandler(async (req, res) => {
        const { phone } = req.body;
        const { customer: { customerId } } = req;

        if (!phone) throw ApiError('Phone number is required', 400)

        const otp = crypto.randomInt(1000, 10000).toString();
        const hashedOtp = await bcrypt.hash(otp.toString(), 10);

        const customer = await customerModel.update(
            {
                hashOtp: hashedOtp,
                isVerified: false,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            },
            {
                where: { id: customerId },
                raw: true
            }
        )
        if (!customer) throw ApiError('Try to resend OTP!', 400)

        sendWhatsAppMessage(phone, `Hello, Your OTP is ${otp}\nThis code is valid for 5 minutes`)
        return res.status(200).json({ success: true, message: "OTP sent successfully", otp, hashedOtp, phone })
    }, 'sendOtp'),

    verifyOtp: asyncHandler(async (req, res) => {
        const { customer: { customerId } } = req;
        const { otp } = req.body;

        const customer = await customerModel.findByPk(customerId, { raw: true });

        if (!customer) throw ApiError("Something went wrong!", 404)
        if (customer.isVerified) throw ApiError("You are already verified!", 400)
        if (new Date(customer.expiresAt) < new Date()) throw ApiError("OTP is expired!", 400)

        const isVerified = await bcrypt.compare(otp, customer.hashOtp);
        if (!isVerified) throw ApiError("Invalid OTP!", 400);

        await customerModel.update({ isVerified: true, hashOtp: "", expiresAt: null }, { where: { id: customerId } });

        return res.status(200).json({ success: true, message: "OTP verified successfully" });
    }, 'verifyOtp')
}