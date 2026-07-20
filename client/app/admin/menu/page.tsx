"use client";

import React, { useState } from "react";
import CategorySidebar from "./_components/CategorySidebar";
import FoodGrid from "./_components/FoodGrid";
import AddCategoryModal from "./_components/AddCategoryModal";
import AddFoodModal from "./_components/AddFoodModal";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Section from "../../../components/ui/Section";

// Mock Data
const MOCK_CATEGORIES = [
    { id: "1", name: "Popular Dishes", isVisible: true, count: 12 },
    { id: "2", name: "Starters & Appetizers", isVisible: true, count: 8 },
    { id: "3", name: "Main Course", isVisible: true, count: 24 },
    { id: "4", name: "Desserts & Sweets", isVisible: false, count: 5 },
    { id: "5", name: "Beverages", isVisible: true, count: 15 },
];

const MOCK_FOODS = [
    { id: "101", categoryId: "1", name: "Signature Garlic Bread", price: 6.99, isVeg: true, isVisible: true, description: "Freshly baked artisan bread with our secret garlic butter herb blend." },
    { id: "102", categoryId: "1", name: "Spicy Buffalo Wings", price: 12.99, isVeg: false, isVisible: true, description: "Crispy chicken wings tossed in our house-made spicy buffalo sauce." },
    { id: "103", categoryId: "3", name: "Grilled Atlantic Salmon", price: 24.99, isVeg: false, isVisible: true, description: "Pan-seared salmon served with asparagus and lemon butter sauce." },
    { id: "104", categoryId: "3", name: "Truffle Mushroom Risotto", price: 18.99, isVeg: true, isVisible: true, description: "Creamy arborio rice with wild mushrooms and truffle oil." },
    { id: "105", categoryId: "2", name: "Crispy Calamari", price: 14.99, isVeg: false, isVisible: false, description: "Lightly dusted calamari rings served with garlic aioli." },
];

export default function AdminMenuManagementPage() {
    const [categories, setCategories] = useState(MOCK_CATEGORIES);
    const [foods, setFoods] = useState(MOCK_FOODS);
    const [activeCategoryId, setActiveCategoryId] = useState<string>("1");
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // Modals state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryModalData, setCategoryModalData] = useState<any>(null);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    // Derived state
    const activeCategory = categories.find((c) => c.id === activeCategoryId);
    const activeCategoryFoods = foods.filter((f) =>
        f.categoryId === activeCategoryId &&
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAddCategory = () => {
        setCategoryModalData(null);
        setIsCategoryModalOpen(true);
    };

    const handleOpenEditCategory = (cat: any) => {
        setCategoryModalData(cat);
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = (data: any) => {
        if (categoryModalData) {
            setCategories(cats => cats.map(c => c.id === categoryModalData.id ? { ...c, ...data } : c));
        } else {
            setCategories(cats => [...cats, { id: Math.random().toString(), count: 0, ...data }]);
        }
    };

    const handleDeleteCategory = () => {
        if (!categoryToDelete) return;
        setCategories(cats => cats.filter(c => c.id !== categoryToDelete));
        if (activeCategoryId === categoryToDelete) {
            const remaining = categories.filter(c => c.id !== categoryToDelete);
            setActiveCategoryId(remaining.length > 0 ? remaining[0].id : "");
        }
        setCategoryToDelete(null);
    };

    return (
        <Section className="flex h-full min-h-[calc(100vh-64px)] rounded-2xl overflow-hidden my-6 sm:my-0 w-full bg-white border border-gray-200 shadow-sm relative">
            {/* Mobile Backdrop */}
            {isMobileSidebarOpen && (
                <div 
                    className="absolute inset-0 bg-gray-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            <CategorySidebar
                categories={categories}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
                onAddCategory={handleOpenAddCategory}
                onEditCategory={handleOpenEditCategory}
                onDeleteCategory={(id) => setCategoryToDelete(id)}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            <FoodGrid
                activeCategory={activeCategory}
                activeCategoryFoods={activeCategoryFoods}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddFood={() => setIsFoodModalOpen(true)}
                onOpenSidebar={() => setIsMobileSidebarOpen(true)}
            />

            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                initialData={categoryModalData}
                onSave={handleSaveCategory}
            />

            <AddFoodModal
                isOpen={isFoodModalOpen}
                onClose={() => setIsFoodModalOpen(false)}
            />
            
            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                title="Delete Category"
                size="sm"
                footer={
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto border-gray-200" onClick={() => setCategoryToDelete(null)}>Cancel</Button>
                        <Button variant="danger" className="w-full sm:w-auto" onClick={handleDeleteCategory}>Delete</Button>
                    </div>
                }
            >
                <></>
                <p className="text-sm text-gray-600 font-medium">
                    Deleting this category will also remove all items associated with it from the menu.
                </p>
            </Modal>
        </Section>
    );
}
