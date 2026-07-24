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
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">Customers</h1>
                    <p className="text-gray-500 mt-2 text-sm">Manage your restaurant customers and view their order history.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" leftIcon={<Download size={18} />}>
                        Export
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">

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
                
            </div>

            {/* Customers Table */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
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
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag size={14} className="text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-700">{customer.orders?.length || 0}</span>
                                                </div>
                                                {customer.orders && customer.orders.length > 0 && (
                                                    <div className="text-xs text-gray-500 max-w-[150px] truncate">
                                                        Last: {customer.orders[0]?.id}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(customer.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-1 transition-opacity">
                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 !h-8 !w-8 rounded-md">
                                                    <Trash2 size={16} />
                                                </Button>
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
        </div>
    );
}