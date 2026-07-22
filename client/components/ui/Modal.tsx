"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  closeOnOverlayClick = false,
  closeOnEsc = false,
  showCloseButton = true,
  footer,
  className = "",
  overlayClassName = "",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Set mounted state once client-side to prevent SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modalElement = modalRef.current;
    
    // Find all tabbable/focusable elements
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    const focusableElements = modalElement.querySelectorAll(focusableSelectors);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    // Save element that was active before modal opened to restore focus later
    const previousActiveElement = document.activeElement as HTMLElement;

    // Focus the first element on modal mount
    // Delay slightly to wait for entry animations
    const focusTimeout = setTimeout(() => {
      firstElement.focus();
    }, 50);

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab: if on first element, cycle to last
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab: if on last element, cycle to first
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    
    return () => {
      clearTimeout(focusTimeout);
      window.removeEventListener("keydown", handleTabKey);
      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  if (!mounted) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md w-full",
    md: "max-w-lg w-full",
    lg: "max-w-2xl w-full",
    xl: "max-w-4xl w-full",
    full: "max-w-full h-full sm:h-[90vh] sm:max-w-[90vw] sm:rounded-2xl",
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring" as const, damping: 25, stiffness: 350 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 12,
      transition: { duration: 0.15, ease: "easeOut" as const } 
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 bg-carbon-black-950/60 backdrop-blur-md ${overlayClassName}`}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Modal Dialog */}
          <motion.div
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
            className={`relative z-10 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${sizeClasses[size]} ${className}`}
          >
            {/* Header */}
            {(title || description || showCloseButton) && (
              <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="flex-1">
                  {title && (
                    <h3
                      id="modal-title"
                      className="text-xl font-heading font-semibold text-carbon-black-900"
                    >
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p
                      id="modal-description"
                      className="mt-1 text-sm text-gray-500"
                    >
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cayenne-red-500"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-gray-600">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}