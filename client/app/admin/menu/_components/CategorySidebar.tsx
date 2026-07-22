"use client";

import React, { useEffect, useRef } from "react";
import { CategoryData } from "../page";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit2, Trash2, EyeOff, Search,
  ChevronRight, UtensilsCrossed, X, Loader2,
} from "lucide-react";
import Button from "../../../../components/ui/Button";
import Image from "next/image";

interface CategorySidebarProps {
  categories: CategoryData[];
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (cat: CategoryData) => void;
  onDeleteCategory: (id: string) => void;
  isToggled?: boolean;
  onClose?: () => void;
  isLoading?: boolean;
  // Infinite scroll
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  // Search
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

/** Skeleton row shown while the first page loads */
function CategorySkeleton() {
  return (
    <div className="space-y-1.5 px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3.5 rounded-xl bg-gray-100/80 animate-pulse"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3.5 w-3/4 bg-gray-200 rounded-md" />
            <div className="h-2.5 w-1/3 bg-gray-200 rounded-md" />
          </div>
          <div className="h-4 w-4 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default React.memo(function CategorySidebar({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isToggled = false,
  onClose = () => { },
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  fetchNextPage,
  searchValue = "",
  onSearchChange,
}: CategorySidebarProps) {
  // ─── Intersection Observer sentinel ─────────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current || !fetchNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      className={`
                absolute xl:relative z-50 xl:z-10 h-full w-[85vw] sm:w-80 flex-shrink-0
                bg-gray-50 rounded-2xl flex flex-col
                transition-all duration-300 ease-in-out left-0 top-0 bottom-0
                ${isToggled 
                    ? "translate-x-0 shadow-2xl xl:-translate-x-full xl:-ml-80 xl:shadow-none" 
                    : "-translate-x-full xl:translate-x-0 xl:ml-0 xl:shadow-none"}
            `}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-cayenne-red-500" />
            Categories
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onAddCategory}
              className="h-8 w-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-cayenne-red-600 hover:border-cayenne-red-200 hover:bg-cayenne-red-50 transition-colors shadow-sm"
              title="Add category"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 rounded-full xl:hidden bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ── Search input ──────────────────────────────────────────── */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
                                   focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500
                                   transition-all text-gray-900 placeholder:text-gray-400 shadow-sm outline-none"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange?.("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 !w-6 !h-6 !p-0 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* ── List ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5 scrollbar-hide">
        {/* Initial loading skeletons */}
        {isLoading && <CategorySkeleton />}

        {/* Category rows */}
        {!isLoading && (
          <AnimatePresence>
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    onClose();
                  }}
                  whileHover={{ scale: 0.99 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left flex items-center justify-between p-3.5 my-1 rounded-xl
                                        transition-all duration-200 border cursor-pointer group
                                        ${isActive
                      ? "bg-white border-cayenne-red-200 shadow-sm ring-1 ring-cayenne-red-500 text-gray-900"
                      : "bg-transparent border-transparent hover:bg-gray-100/80 text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200/50">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UtensilsCrossed className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`font-semibold text-sm truncate ${isActive ? "text-cayenne-red-400" : "text-gray-700 group-hover:text-gray-900"}`}>
                        {cat.name}
                      </span>
                      <span className={`text-xs font-medium mt-0.5 ${isActive ? "text-cayenne-red-500/80" : "text-gray-500 group-hover:text-gray-600"}`}>
                        {cat.count ?? 0} {cat.count === 1 ? 'Item' : 'Items'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!cat.isVisible && (
                      <EyeOff className={`w-4 h-4 ${isActive ? "text-cayenne-red-400" : "text-gray-400"}`} />
                    )}

                    {/* Action buttons (visible on hover / active) */}
                    <div className={`flex items-center gap-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                      <Button
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); onEditCategory(cat); }}
                        className="!w-7 !h-7 !p-0 rounded-md text-gray-400 hover:text-cayenne-red-600 hover:bg-cayenne-red-50 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); onDeleteCategory(cat.id); }}
                        className="!w-7 !h-7 !p-0 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    {isActive && <ChevronRight className="w-5 h-5 text-cayenne-red-500 hidden xl:block" />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* ── Empty state ──────────────────────────────────────────── */}
        {!isLoading && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {searchValue ? "No categories found" : "No categories yet"}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {searchValue
                ? `Nothing matched "${searchValue}". Try a different name.`
                : "Click + above to add your first category."}
            </p>
          </div>
        )}

        {/* ── Intersection observer sentinel ───────────────────────── */}
        <div ref={sentinelRef} className="h-px" />

        {/* ── Fetching-next-page spinner ───────────────────────────── */}
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-3 gap-2 text-xs text-gray-400 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading more…
          </div>
        )}
      </div>
    </div>
  );
})