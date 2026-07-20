import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, EyeOff, Search, ChevronRight, UtensilsCrossed, X } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface Category {
  id: string;
  name: string;
  isVisible: boolean;
  count: number;
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  onAddCategory: () => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CategorySidebar({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isOpen = false,
  onClose = () => {},
}: CategorySidebarProps) {
  return (
    <div className={`
      absolute lg:relative z-50 lg:z-10 h-full w-80 flex-shrink-0 bg-gray-50 rounded-2xl flex flex-col
      transition-transform duration-300 ease-in-out left-0 top-0 bottom-0
      ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"}
    `}>
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
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 rounded-full lg:hidden bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 transition-all text-gray-900 placeholder:text-gray-400 shadow-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5 custom-scrollbar">
        <AnimatePresence>
          {categories.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <motion.div
                key={cat.id}
                onClick={() => { setActiveCategoryId(cat.id); onClose(); }}
                whileHover={{ scale: 0.99 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 border cursor-pointer group ${
                  isActive
                    ? "bg-white border-cayenne-red-200 shadow-sm ring-1 ring-cayenne-red-500 text-gray-900"
                    : "bg-transparent border-transparent hover:bg-gray-100/80 text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className={`font-semibold text-sm ${isActive ? "text-cayenne-red-500" : "text-gray-700"}`}>
                    {cat.name}
                  </span>
                  <span className={`text-xs font-medium ${isActive ? "text-cayenne-red-500/70" : "text-gray-400"}`}>
                    {cat.count} Items
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {!cat.isVisible && (
                    <EyeOff className={`w-4 h-4 ${isActive ? "text-cayenne-red-400" : "text-gray-400"}`} />
                  )}
                  
                  {/* Action Buttons (visible on hover) */}
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
      </div>
    </div>
  );
}
