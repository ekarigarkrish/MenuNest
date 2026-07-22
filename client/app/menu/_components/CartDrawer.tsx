import React from "react";
import Image from "next/image";
import { ShoppingCart, X, Plus, Minus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
// import { CartItem } from "../types";


export default function CartDrawer({
    cart,
    onClose,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    cart: any[];
    onClose: () => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}) {
    const subtotal = cart.reduce((acc, i) => acc + i.discountPrice * i.qty, 0);
    const tax = Math.round(subtotal * 0.10);
    const total = subtotal + tax;
    const itemCount = cart.reduce((a, i) => a + i.qty, 0);

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={onClose}
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
                        onClick={onClose}
                        aria-label="Close cart"
                        className="w-8 h-8 p-0 rounded-full text-carbon-black-500 hover:bg-orange-400 hover:text-white transition-all duration-150"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {cart.length === 0 ? (
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
                {cart.length > 0 && (
                    <div className="border-t border-carbon-black-100 px-5 py-4 space-y-3 bg-white">
                        <div className="flex justify-between text-sm text-carbon-black-600">
                            <span>Subtotal</span>
                            <span className="font-semibold text-carbon-black-900">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-carbon-black-500">
                            <span>Taxes &amp; Charges (5%)</span>
                            <span>₹{tax}</span>
                        </div>
                        <div className="flex justify-between font-heading font-bold text-base text-carbon-black-900 border-t border-carbon-black-100 pt-3">
                            <span>Total</span>
                            <span className="text-cayenne-red-600">₹{total}</span>
                        </div>
                        <Button
                            id="place-order-btn"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                            Place Order
                        </Button>
                    </div>
                )}
            </motion.aside>
        </>
    );
}
