import config from "@/config/config";
import React from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { Api } from "@/config/axios.config";
import Button from "./Button";
import { useSearchParams } from "next/navigation";

export default React.memo(function Checkout({ amount, customer, className, variant = "primary" }: { amount: number, customer: { id: string, name: string, phone: string }, className?: string, variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" }) {
    const searchParams = useSearchParams();
    const tableToken = searchParams.get("tableToken");

    const pay = async () => {
        try {
            const cashfree = await load({ mode: config.cfEnv as "sandbox" | "production" | undefined });
            const res = await Api.post("/api/payment/order", { amount, customer, tableToken });
            const data = res.data;

            await cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                redirectTarget: "_self",
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Button id="pay-btn" onClick={pay} variant={variant} size="lg" className={className} >
                Pay Online
            </Button>
        </>
    )
})