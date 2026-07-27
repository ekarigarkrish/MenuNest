import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import config from "../../../../config/config";

export async function POST(req) {
    try {
        const { amount, customer, tableToken } = await req.json();

        const response = await axios.post(
            "https://sandbox.cashfree.com/pg/orders",
            {
                order_amount: amount,
                order_currency: "INR",
                customer_details: {
                    customer_id: `${Date.now()}`,
                    customer_name: customer.name,
                    customer_phone: customer.phone,
                },
                order_meta: {
                    return_url:
                        `${config.clientOrigin}/menu?tableToken=${tableToken}&success=true&order_id={order_id}`
                }
            },
            {
                headers: {
                    "x-client-id": config.cfAppId,
                    "x-client-secret": config.cfSecretKey,
                    "x-api-version": "2025-01-01",
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error.response?.data || error);

        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}