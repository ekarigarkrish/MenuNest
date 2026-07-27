"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Search,
    Download,
    Trash2,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    ShoppingBag,
    Loader2
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Fetch } from "@/config/axios.config";

interface Order {
    id: string;
    status: string;
    order: any;
    createdAt: string;
}

interface Customer {
    id: string;
    name: string;
    phone: string;
    createdAt: string;
    orders: Order[];
}

export default function CustomerManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeTab, setActiveTab] = useState<'customers' | 'orders'>('customers');
    const [orderDate, setOrderDate] = useState("");
    const [orderPage, setOrderPage] = useState(1);
    const orderLimit = 10;

    const { data: ordersData, isLoading: loadingOrders, error: ordersError } = useQuery({
        queryKey: ['all-orders', orderDate, orderPage],
        queryFn: async () => {
            let url = `/api/order/all?page=${orderPage}&limit=${orderLimit}`;
            if (orderDate) url += `&date=${orderDate}`;
            const res = await Fetch.get(url, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) return res.data;
            throw new Error(res.data.message || 'Failed to fetch orders');
        },
        enabled: activeTab === 'orders'
    });

    const paginatedOrders = ordersData?.data || [];
    const orderPagination = ordersData?.pagination || { page: 1, totalPages: 1, totalItems: 0 };
    
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: customers = [], isLoading: loading, error } = useQuery<Customer[], Error>({
        queryKey: ['customers', debouncedSearch],
        queryFn: async () => {
            const res = await Fetch.get(`/api/customer?search=${encodeURIComponent(debouncedSearch)}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                return res.data.customers;
            }
            throw new Error(res.data.message || 'Failed to fetch customers');
        }
    });

    const filteredCustomers = customers;

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">Customers</h1>
                    <p className="text-gray-500 mt-2 text-sm">Manage your restaurant customers and view their order history.</p>
                </div>
                {/*                 
                <div className="flex items-center gap-3">
                    <Button variant="outline" leftIcon={<Download size={18} />}>
                        Export
                    </Button>
                </div> */}
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={activeTab === 'customers' ? undefined : 'outline'}
                        onClick={() => setActiveTab('customers')}
                    >
                        Customers Table
                    </Button>
                    <Button
                        variant={activeTab === 'orders' ? undefined : 'outline'}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders Table
                    </Button>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    {activeTab === 'orders' && (
                        <div className="relative w-full sm:w-48">
                            <input
                                type="date"
                                className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-cayenne-red-500 focus:border-cayenne-red-500 sm:text-sm transition-colors"
                                value={orderDate}
                                onChange={(e) => {
                                    setOrderDate(e.target.value);
                                    setOrderPage(1);
                                }}
                            />
                        </div>
                    )}

                    {
                        activeTab === 'customers' && (
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-cayenne-red-500 focus:border-cayenne-red-500 sm:text-sm transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )
                    }
                </div>

            </div>

            {/* Table Area */}
            {activeTab === 'customers' ? (
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-8 w-8 text-cayenne-red-500 animate-spin" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                                            {error.message}
                                        </td>
                                    </tr>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            key={customer.id}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-cayenne-red-100 to-cayenne-red-50 flex items-center justify-center border border-cayenne-red-100 text-cayenne-red-700 font-bold text-sm shadow-sm">
                                                        {getInitials(customer.name)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                        <div className="text-xs text-gray-500">ID: {customer.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700">{customer.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(customer.createdAt)}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-base font-medium text-gray-900">No customers found</p>
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
                            Showing <span className="font-medium text-gray-900">{filteredCustomers.length > 0 ? 1 : 0}</span> to <span className="font-medium text-gray-900">{filteredCustomers.length}</span> of <span className="font-medium text-gray-900">{customers.length}</span> results
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="!h-8 !w-8 rounded-md" disabled>
                                <ChevronLeft size={20} />
                            </Button>
                            <Button variant="ghost" size="icon" className="!h-8 !w-8 rounded-md">
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 scrollbar-hide">
                                {loadingOrders ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex justify-center items-center">
                                                <Loader2 className="h-8 w-8 text-cayenne-red-500 animate-spin" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : ordersError ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                                            {(ordersError as Error).message}
                                        </td>
                                    </tr>
                                ) : paginatedOrders.length > 0 ? (
                                    paginatedOrders.map((order: any, index: number) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                            key={order.id} 
                                            className="hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`#${order.id.slice(0, 8)}`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹ {order.total}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                                    {order.items?.map((item: any, i: number) => (
                                                        <div key={i} className="flex items-start gap-2 text-xs">
                                                            <div className={`w-2 h-2 mt-1 rounded-full flex-shrink-0 ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                                            <span className="font-medium text-gray-700">{item.quantity}x</span>
                                                            <span className="text-gray-600 break-words whitespace-normal max-w-[150px]">{item.name}</span>
                                                        </div>
                                                    ))}
                                                    {(!order.items || order.items.length === 0) && (
                                                        <span className="text-gray-400 text-xs italic">No items</span>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 border border-gray-100">
                                                    <Search className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <p className="text-base font-medium text-gray-900">No orders found</p>
                                                <p className="text-sm mt-1 text-gray-500">Try adjusting your date filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{paginatedOrders.length > 0 ? (orderPagination.page - 1) * orderLimit + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(orderPagination.page * orderLimit, orderPagination.totalItems)}</span> of <span className="font-medium text-gray-900">{orderPagination.totalItems}</span> results
                        </div>
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="!h-8 !w-8 rounded-md" 
                                disabled={orderPagination.page <= 1}
                                onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="!h-8 !w-8 rounded-md" 
                                disabled={orderPagination.page >= orderPagination.totalPages || orderPagination.totalPages === 0}
                                onClick={() => setOrderPage(p => Math.min(orderPagination.totalPages, p + 1))}
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}