"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Fetch } from "@/config/axios.config";
import Button from "@/components/ui/Button";
import { toast } from 'sonner';
import { useRestaurantBranding } from "@/hooks/useRestaurantBranding";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Grid3x3,
  ChevronDown
} from "lucide-react";

type SubItem = {
  name: string;
  href: string;
};

type NavItemType = {
  name: string;
  href?: string;
  icon: any;
  subItems?: SubItem[];
};

const navItems: NavItemType[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Menu", href: "/admin/menu", icon: UtensilsCrossed },
  {
    name: "Orders Management", icon: ClipboardList,
    subItems: [
      { name: "Live Orders", href: "/admin/order-management" },
      { name: "Order History", href: "/admin/order-history" }
    ]
  },
  { name: "Table Management", href: "/admin/table-management", icon: Grid3x3 },
  { name: "Customers", href: "/admin/customers", icon: Users },
  {
    name: "Settings",
    icon: Settings,
    href: '/admin/settings/general'
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const { branding } = useRestaurantBranding();
  const displayName = branding?.name || "";

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // const updateQuery = (key: string, value: string) => {
  //   const params = new URLSearchParams(searchParams.toString());

  //   params.set(key, value);

  //   router.replace(`${pathname}?${params.toString()}`);
  // }

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await Fetch.post('/api/auth/logout', {}, { withCredentials: true, withXSRFToken: true });
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message)
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isLinkActive = (href?: string) => {
    if (!href) return false;
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isDropdownActive = (subItems?: SubItem[]) => {
    if (!subItems) return false;
    return subItems.some(item => pathname.startsWith(item.href));
  };

  const handleDropdownClick = (name: string, e: React.MouseEvent, isDesktop: boolean = false) => {
    e.preventDefault();
    if (isDesktop && isCollapsed) setIsCollapsed(false);
    setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-carbon-black-100 flex items-center justify-between px-4 z-40">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
            {branding?.logo ? (
              <Image src={branding.logo} alt={`${displayName} logo`} fill sizes="32px" className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-cayenne-red-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none font-heading select-none">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-carbon-black-900">
            {displayName}
          </span>
          <span className="text-[10px] font-semibold bg-cayenne-red-50 text-cayenne-red-600 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-carbon-black-600 hover:bg-carbon-black-50 hover:text-carbon-black-950"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </Button>
      </header>

      {/* Mobile Sidebar Slide-out Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-carbon-black-100 flex flex-col z-50 md:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-carbon-black-100 flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2.5 group" onClick={() => setIsMobileOpen(false)}>
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    {branding?.logo ? (
                      <Image src={branding.logo} alt={`${displayName} logo`} fill sizes="32px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-cayenne-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-white font-bold text-lg leading-none font-heading select-none">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-heading font-bold text-lg tracking-tight text-carbon-black-900">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-semibold bg-cayenne-red-50 text-cayenne-red-600 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-carbon-black-500 hover:bg-carbon-black-50 hover:text-carbon-black-950"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const hasSubItems = !!item.subItems && item.subItems.length > 0;
                  const active = isLinkActive(item.href) || isDropdownActive(item.subItems);
                  const isOpen = openDropdowns[item.name] ?? isDropdownActive(item.subItems);

                  const itemContent = (
                    <div
                      className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group w-full ${active
                        ? "text-cayenne-red-600 font-semibold"
                        : "text-carbon-black-600 hover:bg-carbon-black-50 hover:text-carbon-black-900"
                        }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeNavMobile"
                          className="absolute inset-0 bg-cayenne-red-50/70 border border-cayenne-red-100 rounded-xl -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}

                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${active ? "text-cayenne-red-500" : "text-carbon-black-500 group-hover:text-carbon-black-800"}`} />
                        <span>{item.name}</span>
                      </div>

                      {hasSubItems && (
                        <ChevronDown size={16} className={`transition-transform duration-200 text-carbon-black-400 ${isOpen ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  );

                  return (
                    <div key={item.name} className="flex flex-col gap-1">
                      {hasSubItems ? (
                        <button type="button" className="w-full text-left" onClick={(e) => handleDropdownClick(item.name, e)}>
                          {itemContent}
                        </button>
                      ) : (
                        <Link href={item.href!} onClick={() => setIsMobileOpen(false)}>
                          {itemContent}
                        </Link>
                      )}

                      <AnimatePresence>
                        {hasSubItems && isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-9 pl-3 border-l-2 border-carbon-black-100 space-y-1 mt-1 mb-2">
                              {item.subItems!.map(subItem => {
                                const isSubActive = isLinkActive(subItem.href);
                                return (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${isSubActive ? "text-cayenne-red-600 bg-cayenne-red-50 font-medium" : "text-carbon-black-600 hover:text-carbon-black-900 hover:bg-carbon-black-50"}`}
                                  >
                                    {subItem.name}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </nav>

              {/* Profile / Logout Footer */}
              <div className="p-4 border-t border-carbon-black-100 bg-carbon-black-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cayenne-red-500/10 to-orange-500/10 text-cayenne-red-600 border border-cayenne-red-100 flex items-center justify-center font-bold font-heading">
                    AD
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-carbon-black-850 leading-tight">Admin User</h4>
                    <p className="text-xs text-carbon-black-500">Restaurant Manager</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-carbon-black-100 hover:border-red-200 text-carbon-black-600 hover:text-red-600 text-xs font-semibold rounded-xl transition-colors hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {isLoggingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col h-screen bg-white border-r border-carbon-black-100 sticky top-0 left-0 z-30 select-none relative"
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-white border border-carbon-black-100 hover:border-cayenne-red-200 text-carbon-black-500 hover:text-cayenne-red-600 flex items-center justify-center hover:shadow-sm transition-all focus:outline-none cursor-pointer"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Logo and Branding Header */}
        <div className="h-20 px-6 border-b border-carbon-black-100 flex items-center">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden group">
            {/* Logo mark */}
            <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:ring-cayenne-red-200 transition-all duration-200">
              {branding?.logo ? (
                <Image src={branding.logo} alt={`${displayName} logo`} fill sizes="32px" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-cayenne-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none font-heading select-none">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 min-w-0"
              >
                <span className="font-heading font-bold text-lg tracking-tight text-carbon-black-900 whitespace-nowrap truncate">
                  {displayName}
                </span>
                <span className="text-[10px] font-semibold bg-cayenne-red-50 text-cayenne-red-600 px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                  Admin
                </span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 py-6 px-4 space-y-1.5 scrollbar-hide ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = !!item.subItems && item.subItems.length > 0;
            const active = isLinkActive(item.href) || isDropdownActive(item.subItems);
            const isOpen = openDropdowns[item.name] ?? isDropdownActive(item.subItems);

            const itemContent = (
              <div
                className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group w-full cursor-pointer ${active
                  ? "text-cayenne-red-400 font-semibold"
                  : "text-carbon-black-600 hover:bg-carbon-black-50 hover:text-carbon-black-900"
                  }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeNavDesktop"
                    className="absolute inset-0 bg-cayenne-red-50/70 border border-cayenne-red-100 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? "text-cayenne-red-500" : "text-carbon-black-500 group-hover:text-carbon-black-800"}`} />

                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </div>

                {!isCollapsed && hasSubItems && (
                  <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 text-carbon-black-400 ${isOpen ? 'rotate-180' : ''}`} />
                )}

                {isCollapsed && (
                  // Custom Hover Tooltip in collapsed mode
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-carbon-black-900 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-1 group-hover:translate-x-0 z-50">
                    {item.name}
                  </div>
                )}
              </div>
            );

            return (
              <div key={item.name} className="flex flex-col gap-1">
                {hasSubItems ? (
                  <button type="button" className="w-full text-left outline-none" onClick={(e) => handleDropdownClick(item.name, e, true)}>
                    {itemContent}
                  </button>
                ) : (
                  <Link href={item.href!} onClick={() => { setIsMobileOpen(false) }}>
                    {itemContent}
                  </Link>
                )}

                <AnimatePresence>
                  {!isCollapsed && hasSubItems && isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-9 pl-3 border-l-2 border-carbon-black-100 space-y-1 mt-1 mb-2">
                        {item.subItems!.map(subItem => {
                          const isSubActive = isLinkActive(subItem.href);
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => { setIsMobileOpen(false) }}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${isSubActive ? "text-cayenne-red-600 bg-cayenne-red-50 font-medium" : "text-carbon-black-600 hover:text-carbon-black-900 hover:bg-carbon-black-50"}`}
                            >
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-carbon-black-100 bg-carbon-black-50/30">
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'}`}>
            <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'w-full justify-center' : ''}`}>
              {/* <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-cayenne-red-500/10 to-orange-500/10 text-cayenne-red-600 border border-cayenne-red-100 flex items-center justify-center font-bold font-heading">
                AD
              </div> */}
              {/* {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col min-w-0"
                >
                  <h4 className="text-sm font-semibold text-carbon-black-850 leading-tight truncate">
                    Admin
                  </h4>
                  <p className="text-xs text-carbon-black-500 truncate">Restaurant Manager</p>
                </motion.div>
              )} */}
            </div>

            <div className="group relative flex items-center justify-center w-full">
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 text-carbon-black-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-xl disabled:opacity-50 disabled:cursor-not-allowed py-2"
                aria-label="Sign out"
              >
                {!isCollapsed && <span className="font-semibold text-sm">{isLoggingOut ? 'Signing out…' : 'Sign Out'}</span>}
                <LogOut className="w-5 h-5" />
              </Button>

              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-carbon-black-900 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-1 group-hover:translate-x-0 z-[60]">
                  {isLoggingOut ? 'Signing out…' : 'Sign Out'}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
