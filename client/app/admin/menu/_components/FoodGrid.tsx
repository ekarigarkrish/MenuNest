import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, EyeOff, Search, UtensilsCrossed, Image as ImageIcon, Menu as MenuIcon } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface Food {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  isVeg: boolean;
  isVisible: boolean;
  description: string;
}

interface Category {
  id: string;
  name: string;
  isVisible: boolean;
  count: number;
}

interface FoodGridProps {
  activeCategory: Category | undefined;
  activeCategoryFoods: Food[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddFood: () => void;
  onOpenSidebar: () => void;
}

export default function FoodGrid({
  activeCategory,
  activeCategoryFoods,
  searchQuery,
  setSearchQuery,
  onAddFood,
  onOpenSidebar,
}: FoodGridProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
      {/* Header */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 relative z-10 border-b border-gray-100">
        <div className="flex items-start sm:items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mt-1 sm:mt-0 -ml-2 text-gray-700 hover:bg-gray-100 rounded-md" 
            onClick={onOpenSidebar}
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeCategory?.id}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              {activeCategory?.name}
              {!activeCategory?.isVisible && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1.5 align-middle shadow-sm">
                  <EyeOff className="w-3 h-3" /> Hidden
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Manage your menu items, pricing, and visibility in this category.
            </p>
          </motion.div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative group w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-cayenne-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-cayenne-red-500/10 focus:border-cayenne-red-500 transition-all text-gray-900 placeholder:text-gray-400 shadow-sm outline-none"
            />
          </div>
          <Button 
            className="w-full sm:w-auto rounded-xl shadow-md shadow-cayenne-red-500/20 hover:shadow-lg hover:shadow-cayenne-red-500/30 transition-all" 
            leftIcon={<Plus className="w-4 h-4" />} 
            onClick={onAddFood}
          >
            Add Item
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 z-10 custom-scrollbar bg-gray-50/30">
        {activeCategoryFoods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
          >
            <div className="w-24 h-24 mb-6 rounded-full bg-cayenne-red-50 flex items-center justify-center border-4 border-white shadow-sm">
              <UtensilsCrossed className="w-10 h-10 text-cayenne-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              This category is currently empty or no items match your search. Start by adding some delicious items to your menu.
            </p>
            <Button className="rounded-xl shadow-md shadow-cayenne-red-500/20" onClick={onAddFood}>
              <Plus className="w-4 h-4 mr-2" /> Add First Item
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {activeCategoryFoods.map((food) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={food.id} 
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 bg-gray-100 relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg shadow-sm border ${
                        food.isVeg 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {food.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {!food.isVisible && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg bg-gray-900 text-white shadow-sm flex items-center gap-1.5">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <Button variant="ghost" size="icon" className="rounded-full bg-white text-gray-700 hover:text-cayenne-red-600 hover:bg-gray-50 shadow-lg">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full bg-white text-gray-700 hover:text-red-600 hover:bg-gray-50 shadow-lg">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-cayenne-red-600 transition-colors line-clamp-1">
                        {food.name}
                      </h3>
                      <span className="font-extrabold text-lg text-gray-900">${food.price.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-1">
                      {food.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
