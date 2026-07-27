import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, X, Plus, Minus, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useSocket } from "@/hooks/useSocket";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Checkout from "@/components/ui/Checkout";
import { useRestaurantBranding } from "@/hooks/useRestaurantBranding";

function taxCulculation(subtotal: number) {
    const { branding } = useRestaurantBranding();
    if (!branding?.gst_enabled) return { total: subtotal, tax: 0 };

    const { gst_rate, gst_type } = branding;
    if (gst_type === "percentage") {
        return {
            total: parseFloat((subtotal + subtotal * (gst_rate / 100)).toFixed(2)),
            tax: parseFloat((subtotal * (gst_rate / 100)).toFixed(2)),
            gst_rate, gst_type
        }
    }

    return {
        total: parseFloat((subtotal + gst_rate).toFixed(2)),
        tax: parseFloat((gst_rate).toFixed(2)),
        gst_rate, gst_type
    }
}

export default React.memo(function CartDrawer({
    storage,
    cart,
    onClose,
    onIncrease,
    onDecrease,
    onRemove,
    onClearCart,
}: {
    storage: any,
    cart: any[];
    onClose: () => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
    onClearCart?: () => void;
}) {
    const searchParams = useSearchParams();
    const router = useRouter()
    const tableToken = searchParams.get("tableToken");
    const isOnlinePaymentSuccess = searchParams.get("success")
    const { socket } = useSocket()
    const subtotal = cart.reduce((acc, i) => acc + i.discountPrice * i.qty, 0);
    // console.log(taxCulculation(subtotal));

    // const tax = Math.round(subtotal * 0.05);
    // const total = subtotal + tax;
    const { total, tax, gst_rate, gst_type } = taxCulculation(subtotal)
    const itemCount = cart.reduce((a, i) => a + i.qty, 0);

    const [isPlacing, setIsPlacing] = useState(false);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const handleClose = () => {
        setIsOrderPlaced(false);
        if (isOnlinePaymentSuccess && isOnlinePaymentSuccess == "true") {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("success");
            params.delete('order_id')
            router.replace(`?${params.toString()}`);
        }
        onClose();
    };

    // For Online Payment Mode Error
    const handleError = (data: any) => {
        setIsPlacing(false);
        toast.error(data.message || "Something went wrong.");
    };

    useEffect(() => {
        if (!socket) return;

        // For Normal/Pay Later Order Success
        const handleSuccess = (data: any) => {
            setIsPlacing(false);
            setIsOrderPlaced(true);
            if (onClearCart) onClearCart();
        };

        socket.on("order_error", handleError);
        socket.on("order_success", handleSuccess);

        return () => {
            socket.off("order_error", handleError);
            socket.off("order_success", handleSuccess);
        };
    }, [socket, onClearCart]);

    useEffect(() => {
        if (!socket) return;

        if (isOnlinePaymentSuccess == "true" && cart.length > 0) {
            const urlOrderId = searchParams.get('order_id');
            socket.emit('place_order', { cart, total, tableToken, ...storage.getDetails(), orderId: urlOrderId, paymentMode: 'online' })
            setIsOrderPlaced(true);
            onClearCart?.();
        }
    }, [isOnlinePaymentSuccess, cart, socket, searchParams])

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={handleClose}
                aria-hidden
            />

            {/* Drawer */}
            <motion.aside
                id="cart-drawer"
                role="dialog"
                aria-label="Cart"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-carbon-black-100">
                    <h2 className="font-heading font-bold text-lg text-carbon-black-900 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-cayenne-red-500" />
                        Your Order
                        {itemCount > 0 && (
                            <span className="text-xs font-bold bg-cayenne-red-100 text-cayenne-red-600 px-2 py-0.5 rounded-full">
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </h2>
                    <Button
                        id="close-cart"
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        aria-label="Close cart"
                        className="w-8 h-8 p-0 rounded-full text-carbon-black-500 hover:bg-cayenne-red-100 hover:text-cayenne-red-500 transition-all duration-150"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Items list / Success State */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {isOrderPlaced ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center gap-4 py-10"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-2"
                            >
                                <CheckCircle className="w-12 h-12" />
                            </motion.div>
                            <h3 className="font-heading font-bold text-2xl text-carbon-black-900">Order Placed!</h3>
                            <p className="text-sm text-carbon-black-500 max-w-[250px]">
                                Your delicious meal is being prepared. It will be served to you shortly!
                            </p>
                        </motion.div>
                    ) : cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-carbon-black-400 gap-3 py-16">
                            <span className="text-6xl">🛒</span>
                            <p className="font-heading font-bold text-lg text-carbon-black-600">Cart is empty</p>
                            <p className="text-sm text-center">Add something delicious from the menu!</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-xl border border-carbon-black-100 bg-carbon-black-50"
                            >
                                <div className="w-10 h-10 relative flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-carbon-black-100/50">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-carbon-black-900 truncate">{item.name}</p>
                                    <p className="text-xs text-carbon-black-500 mt-0.5">
                                        ₹{item.discountPrice} × {item.qty} = <span className="font-semibold text-carbon-black-700">₹{item.discountPrice * item.qty}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Button variant="ghost" size="icon" onClick={() => onDecrease(item.id)} className="w-6 h-6 p-0 rounded-md bg-carbon-black-100 hover:bg-carbon-black-200 text-carbon-black-600 transition-colors">
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-5 text-center text-sm font-bold text-carbon-black-800">{item.qty}</span>
                                    <Button variant="ghost" size="icon" onClick={() => onIncrease(item.id)} className="w-6 h-6 p-0 rounded-md bg-carbon-black-100 hover:bg-carbon-black-200 text-carbon-black-600 transition-colors">
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onRemove(item.id)} aria-label="Remove item" className="ml-1 w-6 h-6 p-0 rounded-md hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors">
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {isOrderPlaced ? (
                    <div className="border-t border-carbon-black-100 px-5 py-4 bg-white">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={handleClose}
                        >
                            Continue Ordering
                        </Button>
                    </div>
                ) : cart.length > 0 && (
                    <div className="border-t border-carbon-black-100 px-5 py-4 space-y-3 bg-white">
                        <div className="flex justify-between text-sm text-carbon-black-600">
                            <span>Subtotal</span>
                            <span className="font-semibold text-carbon-black-900">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-carbon-black-500">
                            <span>Taxes &amp; Charges {gst_type === "percentage" ? `(${gst_rate}%)` : `(₹${gst_rate})`}</span>
                            <span>₹{tax}</span>
                        </div>
                        <div className="flex justify-between font-heading font-bold text-base text-carbon-black-900 border-t border-carbon-black-100 pt-3">
                            <span>Total</span>
                            <span className="text-cayenne-red-600">₹{total}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Checkout
                                amount={total}
                                customer={storage.getDetails()}
                                className="w-full"
                            />
                            <div className="relative flex items-center justify-center my-1">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-carbon-black-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                                    <span className="bg-white px-2 text-carbon-black-400 font-medium">Or</span>
                                </div>
                            </div>
                            <Button
                                id="place-order-btn"
                                variant="outline"
                                size="lg"
                                className="w-full border-carbon-black-200 text-carbon-black-700 hover:bg-carbon-black-50 hover:text-carbon-black-900 focus-visible:ring-carbon-black-500"
                                disabled={isPlacing}
                                onClick={() => {
                                    if (!tableToken) return
                                    setIsPlacing(true);
                                    socket?.emit('place_order', { cart, total, tableToken, ...storage.getDetails() })
                                }}
                                rightIcon={isPlacing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                            >
                                {isPlacing ? "Placing Order..." : "Place Order & Pay Later"}
                            </Button>
                        </div>
                    </div>
                )}
            </motion.aside>
        </>
    );
})
