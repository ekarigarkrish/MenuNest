"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";

const SETTINGS_LINKS = [
  {
    name: "Profile Settings",
    href: "/admin/settings/profile",
    icon: User,
  },
  {
    name: "General Settings",
    href: "/admin/settings/general",
    icon: Settings,
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Section className="flex h-full min-h-[calc(100vh-64px)] rounded-2xl overflow-hidden my-6 sm:my-0 w-full bg-white border border-gray-200 shadow-sm relative">
      {/* Sidebar Navigation */}
      <aside className="absolute lg:relative z-50 lg:z-10 h-full w-80 flex-shrink-0 bg-gray-50 flex flex-col transition-transform duration-300 ease-in-out left-0 top-0 bottom-0 border-r border-gray-200">
        <div className="p-6 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 mb-6">
            <Settings2 className="w-5 h-5 text-cayenne-red-500" />
            Settings
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5 scrollbar-hide">
          <AnimatePresence>
            {SETTINGS_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full text-left flex items-center justify-between p-3.5 my-1 rounded-xl transition-all duration-200 border group ${
                    isActive
                      ? "bg-white border-cayenne-red-200 shadow-sm ring-1 ring-cayenne-red-400 text-gray-900"
                      : "bg-transparent border-transparent hover:bg-gray-100/80 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${isActive ? "bg-cayenne-red-50 border-cayenne-red-100" : "bg-gray-100 border-gray-200/50"} flex-shrink-0`}>
                       <Icon className={`w-5 h-5 ${isActive ? "text-cayenne-red-400" : "text-gray-400 group-hover:text-gray-600"}`} />
                    </div>
                    <span className={`font-semibold text-sm ${isActive ? "text-cayenne-red-400" : "text-gray-700 group-hover:text-gray-900"}`}>
                      {link.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto scrollbar-hide bg-white p-6 lg:p-10 relative">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </Section>
  );
}