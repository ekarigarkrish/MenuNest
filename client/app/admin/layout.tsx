import React from "react";
import AdminSidebar from "@/app/admin/_components/AdminSidebar";
import { useSocket } from "@/hooks/useSocket";
import OrderMessage from "@/components/ui/OrderMessage";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
      
    return (
        <>
            <OrderMessage />
            <div className="flex h-screen overflow-hidden bg-carbon-black-50">
                <AdminSidebar />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto bg-carbon-black-50 p-4 md:p-6 lg:p-8 pt-20 md:pt-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}