"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    Search, 
    Download, 
    MoreVertical, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight,
    UserPlus
} from "lucide-react";
import Button from "@/components/ui/Button";

// Dummy Data matching server/model/customer.model.js
const DUMMY_CUSTOMERS = [
    {
        id: "cus_1",
        name: "Alice Wonderland",
        phone: "+1 (555) 123-4567",
        orderId: "ORD-9281",
        createdAt: "2023-10-24T10:00:00Z",
    },
    {
        id: "cus_2",
        name: "Bob Builder",
        phone: "+1 (555) 987-6543",
        orderId: "ORD-8742",
        createdAt: "2023-10-25T14:30:00Z",
    },
    {
        id: "cus_3",
        name: "Charlie Chaplin",
        phone: "+1 (555) 555-5555",
        orderId: "ORD-3291",
        createdAt: "2023-10-26T09:15:00Z",
    },
    {
        id: "cus_4",
        name: "Diana Prince",
        phone: "+1 (555) 111-2222",
        orderId: "ORD-5512",
        createdAt: "2023-10-27T16:45:00Z",
    },
    {
        id: "cus_5",
        name: "Ethan Hunt",
        phone: "+1 (555) 333-4444",
        orderId: "ORD-9910",
        createdAt: "2023-10-28T11:20:00Z",
    },
    {
        id: "cus_6",
        name: "Fiona Gallagher",
        phone: "+1 (555) 777-8888",
        orderId: "ORD-1029",
        createdAt: "2023-10-29T18:05:00Z",
    }
];

export default function CustomerManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const filteredCustomers = DUMMY_CUSTOMERS.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customer.phone.includes(searchQuery) ||
        customer.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <Button variant="primary" leftIcon={<UserPlus size={18} />}>
                        Add Customer
                    </Button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex space-x-1 bg-gray-50/80 p-1 rounded-lg border border-gray-100 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                    {["All", "Active", "New", "VIP"].map((tab) => (
                        <Button
                        variant="ghost"
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                                activeTab === tab 
                                    ? "bg-white text-gray-900 shadow-sm border border-gray-200" 
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>

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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Latest Order</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.length > 0 ? (
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
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 shadow-sm">
                                                {customer.orderId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(customer.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-1 transition-opacity">
                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cayenne-red-600 hover:bg-cayenne-red-50 !h-8 !w-8 rounded-md">
                                                    <Edit size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50 !h-8 !w-8 rounded-md">
                                                    <Trash2 size={16} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 !h-8 !w-8 rounded-md">
                                                    <MoreVertical size={16} />
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
                        Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{filteredCustomers.length}</span> of <span className="font-medium text-gray-900">24</span> results
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