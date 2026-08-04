"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
    Loader2,
    Printer
} from "lucide-react";
import Button from "@/components/ui/Button";
import DatePicker, { DateRange } from "@/components/ui/DatePicker";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    name: string;
    isVeg: boolean;
}

interface Order {
    id: string;
    orderId: string;
    tableId: string | null;
    tableName: string;
    status: string;
    items: OrderItem[];
    total: number;
    paymentMode: string;
    paymentStatus: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
}

export default function OrderHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterDate, setDate] = useState<DateRange>({ from: null, to: null });
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, totalPages: 0, totalItems: 0 });
    const queryClient = useQueryClient();

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: orders = [], isLoading: loading, error } = useQuery<Order[], Error>({
        queryKey: ['orders', debouncedSearch, filterDate, pagination.page, pagination.limit],
        queryFn: async () => {
            const params = new URLSearchParams({
                search: debouncedSearch ?? "",
                page: pagination?.page?.toString() ?? "1",
                limit: pagination?.limit?.toString() ?? "10",
                startDate: filterDate?.from?.toISOString() ?? "",
                endDate: filterDate?.to?.toISOString() ?? "",
            })

            const res = await Fetch.get(`/api/order/all?${params?.toString() || ''}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setPagination(res.data.pagination);
                return res.data.data;
            }
            throw new Error(res.data.message || 'Failed to fetch orders');
        }
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ready': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'served': return 'bg-green-100 text-green-800 border-green-200';
            case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const updatePaymentStatus = async (id: string, status: string) => {
        try {
            const res = await Fetch.patch(`/api/order/update-payment-status/${id}`, { status }, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                toast.success(res.data.message);
                queryClient.invalidateQueries({ queryKey: ['orders'] });
            } else {
                toast.error(res.data.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update payment status")
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const printReceipt = async (orderId: string) => {
        try {
            toast.loading("Generating invoice for printing...", { id: `print-${orderId}` });
            const res = await Fetch.get(`/api/order/${orderId}/invoice`, {
                withCredentials: true,
                withXSRFToken: true,
                responseType: 'blob'
            });

            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                setTimeout(() => {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                    // Revoke URL after a delay to ensure print dialog has loaded the document
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                    }, 10000);
                }, 200);
            };

            toast.success("Invoice ready for printing", { id: `print-${orderId}` });
        } catch (error: any) {
            console.error("Print error:", error);
            if (error.response?.data instanceof Blob) {
                const text = await error.response.data.text();
                try {
                    const errorData = JSON.parse(text);
                    toast.error(errorData.message || "Failed to print receipt", { id: `print-${orderId}` });
                } catch (e) {
                    toast.error("Failed to print receipt", { id: `print-${orderId}` });
                }
            } else {
                toast.error(error?.response?.data?.message || "Failed to print receipt", { id: `print-${orderId}` });
            }
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">Order History</h1>
                    <p className="text-gray-500 mt-2 text-sm">View and manage all your restaurant orders.</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">

                <div className="flex flex-col md:flex-row items-center gap-4 w-full sm:w-auto">

                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Order ID or Table..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-cayenne-red-500 focus:border-cayenne-red-500 sm:text-sm transition-colors"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="relative w-full sm:w-64">
                        <DatePicker
                            mode="range"
                            value={filterDate}
                            onChange={(range: DateRange) => setDate(range)}
                            placeholder="Filter by date range"
                        />
                    </div>

                </div>

            </div>

            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th> */}
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Table</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center">
                                            <Loader2 className="h-8 w-8 text-cayenne-red-500 animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                                        {error.message}
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                        key={order.id}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-200 text-gray-700 shadow-sm">
                                                    <ShoppingBag size={18} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.tableName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">₹{order.total}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(order.status)} capitalize`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col space-y-2 items-start">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        onClick={() => {
                                                            if (order.status === 'cancelled') return;
                                                            const newStatus = (order.paymentStatus).toLowerCase() === 'paid' ? 'pending' : 'paid';
                                                            updatePaymentStatus(order.id, newStatus);
                                                        }}
                                                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${(order.paymentStatus || 'unpaid').toLowerCase() === 'paid' ? 'bg-green-500' : 'bg-gray-200'} ${order.status === 'cancelled' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                                    >
                                                        <span
                                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(order.paymentStatus).toLowerCase() === 'paid' ? 'translate-x-4' : 'translate-x-0'}`}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-semibold capitalize ${(order.paymentStatus).toLowerCase() === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>
                                                {order.paymentMode && (
                                                    <span className="text-xs text-gray-500 capitalize">{order.paymentMode}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button size="sm" variant="outline" disabled={(order.paymentStatus).toLowerCase() !== 'paid'} onClick={() => printReceipt(order.id)} className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border-gray-200">
                                                <Printer className="w-4 h-4" />
                                                Print
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                                                <Search className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-base font-medium text-gray-900">No orders found</p>
                                            <p className="text-sm mt-1 text-gray-500">Try adjusting your search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium text-gray-900">{orders.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.totalItems)}</span> of <span className="font-medium text-gray-900">{pagination.totalItems}</span> results
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="!h-8 !w-8 rounded-md"
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        >
                            <ChevronLeft size={20} />
                        </Button>

                        {(() => {
                            const totalPages = pagination.totalPages || 1;
                            const pages = [];

                            if (totalPages <= 5) {
                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                            } else {
                                if (pagination.page <= 3) {
                                    pages.push(1, 2, 3, 4, '...', totalPages);
                                } else if (pagination.page >= totalPages - 2) {
                                    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                                } else {
                                    pages.push(1, '...', pagination.page - 1, pagination.page, pagination.page + 1, '...', totalPages);
                                }
                            }

                            return pages.map((page, index) => (
                                typeof page === 'number' ? (
                                    <Button
                                        key={index}
                                        variant={pagination.page === page ? "outline" : "ghost"}
                                        className={`!h-8 !w-8 rounded-md p-0 ${pagination.page === page ? 'bg-gray-50 text-cayenne-red-600 border-cayenne-red-200' : 'text-gray-600'}`}
                                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                                    >
                                        {page}
                                    </Button>
                                ) : (
                                    <span key={index} className="px-1 text-gray-400">...</span>
                                )
                            ));
                        })()}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="!h-8 !w-8 rounded-md"
                            disabled={pagination.page >= pagination.totalPages || pagination.totalItems === 0}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}