"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useRestaurantBranding } from "@/hooks/useRestaurantBranding";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { branding, isLoading } = useRestaurantBranding();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: { name: string; href: string }[] = [];

  const displayName = branding?.name || "MenuNest";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo + Name */}
          <Link href="#" className="flex items-center gap-2.5 group">
            {/* Logo mark */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-lg ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300">
              {branding?.logo && !isLoading ? (
                <Image
                  src={branding.logo}
                  alt={`${displayName} logo`}
                  fill
                  sizes="36px"
                  className="object-cover transition-opacity duration-500 opacity-100"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-cayenne-red-500 to-orange-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none font-heading select-none">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Restaurant name */}
            <span
              className={`font-heading font-bold text-xl tracking-tight text-white transition-all duration-300 ${
                isLoading ? "opacity-0 translate-x-1" : "opacity-100 translate-x-0"
              }`}
            >
              {displayName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks?.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white hover:text-orange-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-gray-200 hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-xl transition-all duration-500 delay-75 transform ${
              isMobileMenuOpen
                ? "translate-y-0 opacity-100"
                : "-translate-y-8 opacity-0"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-base font-medium text-carbon-black-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}