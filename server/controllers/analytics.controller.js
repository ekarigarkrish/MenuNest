import { asyncHandler } from "../utils/helper.utils.js";
import { orderModel, customerModel, tableModel } from "../model/assoication.js";
import { Op, fn, col } from "sequelize";

export default {
    /**
     * GET /api/analytics/summary
     * Returns all data needed to populate the admin dashboard in a single request.
     */
    getSummary: asyncHandler(async (req, res) => {
        const now = new Date();

        // ── Today window ──────────────────────────────────────────────────────
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);

        // ── 7-day window (start of 6 days ago → now) ──────────────────────────
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // ── 1. Total orders & revenue (all-time) ──────────────────────────────
        const [allTimeStats] = await orderModel.findAll({
            attributes: [
                [fn("COUNT", col("id")), "totalOrders"],
                [fn("SUM", col("total")), "totalRevenue"],
                [fn("AVG", col("total")), "avgOrderValue"],
            ],
            where: { status: { [Op.ne]: "cancelled" } },
            raw: true,
        });

        // ── 2. Today's orders & revenue ───────────────────────────────────────
        const [todayStats] = await orderModel.findAll({
            attributes: [
                [fn("COUNT", col("id")), "todayOrders"],
                [fn("SUM", col("total")), "todayRevenue"],
            ],
            where: {
                status: { [Op.ne]: "cancelled" },
                createdAt: { [Op.between]: [todayStart, todayEnd] },
            },
            raw: true,
        });

        // ── 5. Total unique customers ─────────────────────────────────────────
        const totalCustomers = await customerModel.count();

        // New customers today
        const newCustomersToday = await customerModel.count({
            where: { createdAt: { [Op.between]: [todayStart, todayEnd] } },
        });

        return res.status(200).json({
            success: true,
            data: {
                allTime: {
                    totalOrders: parseInt(allTimeStats?.totalOrders, 10) || 0,
                    totalRevenue: parseFloat(allTimeStats?.totalRevenue) || 0,
                    avgOrderValue: parseFloat(allTimeStats?.avgOrderValue) || 0,
                },
                today: {
                    totalOrders: parseInt(todayStats?.todayOrders, 10) || 0,
                    totalRevenue: parseFloat(todayStats?.todayRevenue) || 0,
                },
                customers: {
                    total: totalCustomers,
                    newToday: newCustomersToday,
                },
            },
        });
    }, "getSummary"),
};
