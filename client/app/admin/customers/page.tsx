"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Download,
    Trash2,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    ShoppingBag,
    Loader2,
    FileSpreadsheet,
    FileText,
    FileJson,
    ChevronDown
} from "lucide-react";
import Button from "@/components/ui/Button";
import DatePicker, { DateRange } from "@/components/ui/DatePicker";
import { Fetch } from "@/config/axios.config";
import { toast } from "sonner";

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
interface Pagination {
    page: number;
    limit: number;
    total: number;
}

export default function CustomerManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterDate, setDate] = useState<DateRange>({ from: null, to: null });
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 })

    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const exportMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
                setIsExportMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: customers = [], isLoading: loading, error } = useQuery<Customer[], Error>({
        queryKey: ['customers', debouncedSearch, filterDate, pagination.page, pagination.limit],
        queryFn: async () => {
            const params = new URLSearchParams({
                search: debouncedSearch ?? "",
                page: pagination?.page?.toString() ?? "1",
                limit: pagination?.limit?.toString() ?? "10",
                startDate: filterDate?.from?.toISOString() ?? "",
                endDate: filterDate?.to?.toISOString() ?? "",
            })

            const res = await Fetch.get(`/api/customer?${params?.toString() || ''}`, { withCredentials: true, withXSRFToken: true });
            if (res.data.success) {
                setPagination(res.data.pagination);
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

    const exportData = async (format: string = 'csv') => {
        setIsExportMenuOpen(false);
        try {
            const params = new URLSearchParams({
                format: format,
                startDate: filterDate?.from?.toISOString() ?? "",
                endDate: filterDate?.to?.toISOString() ?? "",
            })

            const res = await Fetch.get(`/api/customer/export?${params?.toString() || ''}`, { responseType: 'blob', withCredentials: true, withXSRFToken: true });

            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `customers.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to export Data.')
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">Customers</h1>
                    <p className="text-gray-500 mt-2 text-sm">Manage your restaurant customers and view their order history.</p>
                </div>

                <div className="flex items-center gap-3 relative" ref={exportMenuRef}>
                    <Button
                        variant="outline"
                        leftIcon={<Download size={18} />}
                        rightIcon={<ChevronDown size={16} className={`transition-transform duration-200 ${isExportMenuOpen ? "rotate-180" : ""}`} />}
                        onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    >
                        Export
                    </Button>

                    <AnimatePresence>
                        {isExportMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 py-2 z-50 overflow-hidden"
                            >
                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Export Options
                                </div>
                                <button
                                    onClick={() => exportData('xlsx')}
                                    className="group w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center gap-3 text-gray-700 hover:bg-cayenne-red-50 hover:text-cayenne-red-600"
                                >
                                    <FileSpreadsheet size={16} className="text-gray-400 group-hover:text-cayenne-red-500 transition-colors" />
                                    <span className="font-medium">Export as Excel</span>
                                </button>
                                {/* <button
                                    onClick={() => exportData('pdf')}
                                    className="group w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center gap-3 text-gray-700 hover:bg-cayenne-red-50 hover:text-cayenne-red-600"
                                >
                                    <FileText size={16} className="text-gray-400 group-hover:text-cayenne-red-500 transition-colors" />
                                    <span className="font-medium">Export as PDF</span>
                                </button>
                                <button
                                    onClick={() => exportData('json')}
                                    className="group w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center gap-3 text-gray-700 hover:bg-cayenne-red-50 hover:text-cayenne-red-600"
                                >
                                    <FileJson size={16} className="text-gray-400 group-hover:text-cayenne-red-500 transition-colors" />
                                    <span className="font-medium">Export as JSON</span>
                                </button> */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-end items-center gap-4">

                <div className="flex flex-col lg:flex-row items-center gap-4 w-full sm:w-auto">

                    <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or phone number..."
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
                                                <div className="shrink-0 h-10 w-10 rounded-full bg-linear-to-br from-cayenne-red-100 to-cayenne-red-50 flex items-center justify-center border border-cayenne-red-100 text-cayenne-red-700 font-bold text-sm shadow-sm">
                                                    {getInitials(customer.name)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
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
                        Showing <span className="font-medium text-gray-900">{filteredCustomers.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-gray-900">{pagination.total}</span> results
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
                            const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
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
                            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || pagination.total === 0}
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