import React, { useEffect, useState } from "react";
import { X, Clock, CheckCircle2, ShoppingBag, Loader2, ChefHat, Bell, XCircle, Timer, Download } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { toast } from "sonner";

const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Timer className="w-3 h-3 animate-pulse" /> };
        case 'accepted':
            return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <CheckCircle2 className="w-3 h-3" /> };
        case 'preparing':
            return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <ChefHat className="w-3 h-3" /> };
        case 'ready':
            return { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Bell className="w-3 h-3" /> };
        case 'served':
        case 'completed':
            return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> };
        case 'cancelled':
            return { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: <XCircle className="w-3 h-3" /> };
        default:
            return { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: <Clock className="w-3 h-3" /> };
    }
};

export default React.memo(function OrdersDrawer({ onClose, phone }: { onClose: () => void; phone?: string; }) {
    const { targetRef, isIntersecting } = useIntersectionObserver();
    const [isAuthIssue, setIsAuthIssue] = useState<boolean>(false);
    const [isOrderFetchLoading, setIsOrderFetchLoading] = useState<boolean>(false);

    const { data: response, refetch, error, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['orders', phone],
        queryFn: async ({ pageParam = 1 }) => {
            if (!phone) return null;
            const res = await Fetch.post(`/api/order/customer/orders?page=${pageParam}&limit=10`, { phone }, { withCredentials: true, withXSRFToken: true });
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            if (!lastPage || !lastPage.success) return undefined;
            if (lastPage.page < lastPage.totalPages) return lastPage.page + 1;
            return undefined;
        },
        enabled: !!phone
    });

    const handleRetry = async () => {
        setIsOrderFetchLoading(true);
        if (isAuthIssue) {
            await Fetch.post('/api/customer/check', { phone }, { withCredentials: true, withXSRFToken: true });
            setIsAuthIssue(false);
        }
        refetch();
        setIsOrderFetchLoading(false);
    }

    useEffect(() => {
        if ((error as any)?.request?.status === 401 || (error as any)?.response?.status === 401) {
            setIsAuthIssue(true);
        }
    }, [error]);

    useEffect(() => { refetch(); }, [])

    useEffect(() => {
        if (isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const orders = response?.pages?.flatMap((page: any) => page?.data || []) || [];

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(dateStr));
    };

    const downloadReceipt = async (orderId: string) => {
        try {
            toast.loading("Generating invoice...", { id: `download-${orderId}` });
            const res = await Fetch.get(`/api/order/${orderId}/receipt`, {
                withCredentials: true,
                withXSRFToken: true,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = res.headers['content-disposition'];
            let fileName = `receipt-${orderId}.pdf`;
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = fileNameMatch[1];
                }
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Invoice downloaded successfully", { id: `download-${orderId}` });
        } catch (error: any) {
            console.error("Download error:", error);
            if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                try {
                    const errorData = JSON.parse(text);
                    toast.error(errorData.message || "Failed to download receipt", { id: `download-${orderId}` });
                } catch (e) {
                    toast.error("Failed to download receipt", { id: `download-${orderId}` });
                }
            } else {
                toast.error(error?.response?.data?.message || "Failed to download receipt", { id: `download-${orderId}` });
            }
        }
    }

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
                id="orders-drawer"
                role="dialog"
                aria-label="Previous Orders"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-gray-50 z-50 shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white shadow-sm z-10">
                    <h2 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-cayenne-red-500" />
                        Previous Orders
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close orders"
                        className="w-8 h-8 p-0 rounded-full text-gray-500 hover:bg-cayenne-red-100 hover:text-cayenne-red-500 transition-all duration-150"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-cayenne-red-500" />
                            <p className="font-heading font-bold text-sm text-gray-600">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 py-16">
                            <ShoppingBag className="w-12 h-12 text-gray-300" />
                            <p className="font-heading font-bold text-lg text-gray-600">No orders found</p>
                            <p className="text-sm text-center">You haven't placed any orders yet!</p>
                            <Button onClick={handleRetry} disabled={isOrderFetchLoading} variant="secondary">
                                {isOrderFetchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Try Again"}
                            </Button>
                        </div>
                    ) : (
                        orders.map((order: any, index: number) => {
                            const taxAmount = parseFloat(order.tax || 0);
                            const itemsTotal = order?.order?.reduce((acc: number, item: any) => acc + (item.discountPrice * item.qty), 0) || 0;
                            const finalTotal = order.paymentMode === 'online' ? parseFloat(order.total || 0) : (itemsTotal + taxAmount);

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={order.id}
                                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900">{order.id.split('-')[0].toUpperCase()}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                                                <Clock className="w-3 h-3" /> {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border ${getStatusConfig(order.status).color}`}>
                                                {getStatusConfig(order.status).icon}
                                                <span>{order.status}</span>
                                            </div>
                                            {
                                                order.status !== 'cancelled' && (
                                                    <div className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded border border-gray-200 shadow-sm">
                                                        {order.paymentMode === 'online' ? 'Paid Online' : 'Pay at counter'}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                                        {order.order.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    <span className="font-semibold text-gray-900 mr-2">{item.qty}x</span>
                                                    {item.name}
                                                </span>
                                                <span className="text-gray-500 font-medium">₹{item.discountPrice * item.qty}</span>
                                            </div>
                                        ))}

                                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-dashed border-gray-200">
                                            <span className="text-sm text-gray-500">
                                                Taxes &amp; Charges {order.gst_type === "percentage" ? `(${order.gst_rate || 0}%)` : (order.gst_rate ? `(₹${order.gst_rate})` : '')}
                                            </span>
                                            <span className="text-sm font-medium text-gray-500">₹{taxAmount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-500">Total Amount</span>
                                        <span className="font-extrabold text-lg text-gray-900">
                                            ₹{finalTotal.toFixed(2)}
                                        </span>
                                    </div>

                                    {
                                        order.status === 'completed' && (
                                            <Button
                                                variant="outline"
                                                className="w-full mt-4 rounded-xl border-gray-200 text-gray-700 bg-gray-50 hover:bg-cayenne-red-50 hover:text-cayenne-red-600 hover:border-cayenne-red-200 transition-all font-semibold flex items-center justify-center gap-2 py-2"
                                                onClick={() => downloadReceipt(order.id)}
                                            >
                                                <Download className="w-4 h-4" />
                                                Download Invoice
                                            </Button>
                                        )
                                    }
                                </motion.div>
                            );
                        })
                    )}

                    {orders.length > 0 && hasNextPage && (
                        <div ref={targetRef} className="py-4 flex justify-center w-full">
                            {isFetchingNextPage ? (
                                <Loader2 className="w-5 h-5 animate-spin text-cayenne-red-500" />
                            ) : (
                                <div className="h-5" />
                            )}
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
});