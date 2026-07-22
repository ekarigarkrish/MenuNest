"use client";

import React, { useState, useCallback, useDeferredValue } from "react";
import CategorySidebar from "./_components/CategorySidebar";
import FoodGrid from "./_components/FoodGrid";
import AddCategoryModal from "./_components/AddCategoryModal";
import AddFoodModal from "./_components/AddFoodModal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Section from "@/components/ui/Section";
import { useCategories } from "./_hooks/useCategories";
import { useMenuItems } from "./_hooks/useMenuItems";

export interface CategoryData {
    id: string;
    name: string;
    slug: string;
    desc?: string;
    image?: string | null;
    isVisible: boolean;
    count?: number;
    isAvailable: boolean
}

export default function AdminMenuManagementPage() {
    // ─── Local UI state ─────────────────────────────────────────────────────
    const [activeCategoryId, setActiveCategoryId] = useState<string>("");
    const [categorySearch, setCategorySearch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);

    const deferredCategorySearch = useDeferredValue(categorySearch);
    const deferredFoodSearch = useDeferredValue(searchQuery);

    // Modal state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryModalData, setCategoryModalData] = useState<CategoryData | null>(null);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [foodToEdit, setFoodToEdit] = useState<any | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null);
    const [foodToDelete, setFoodToDelete] = useState<any | null>(null);

    // ─── Custom Hooks for Data Fetching & Mutations ─────────────────────────
    const { categories, isCategoriesLoading, isFetchingNextPage, fetchNextPage, hasNextPage, createCategoryMutation, updateCategoryMutation, deleteCategoryMutation } = useCategories(deferredCategorySearch);

    // Auto-select first category when data loads
    const resolvedActiveCategoryId = activeCategoryId || (categories.length > 0 ? categories[0].id : "");
    const activeCategory = categories.find((c) => c.id === resolvedActiveCategoryId);

    const {
        activeCategoryFoods,
        deleteFoodMutation,
        isFetchingNextPage: isFetchingNextMenuItemPage,
        hasNextPage: hasNextMenuItemPage,
        fetchNextPage: fetchNextMenuItemPage
    } = useMenuItems(resolvedActiveCategoryId, deferredFoodSearch);

    // ─── Handlers ────────────────────────────────────────────────────────────
    const handleCategorySearchChange = useCallback((value: string) => {
        setCategorySearch(value);
    }, []);

    const handleOpenAddCategory = () => {
        setCategoryModalData(null);
        setIsCategoryModalOpen(true);
    };

    const handleOpenEditCategory = (cat: CategoryData) => {
        setCategoryModalData(cat);
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = (data: any) => {
        if (categoryModalData) {
            updateCategoryMutation.mutate(
                { id: categoryModalData.id, ...data },
                { onSuccess: () => setIsCategoryModalOpen(false) }
            );
        } else {
            createCategoryMutation.mutate(
                data,
                { onSuccess: () => setIsCategoryModalOpen(false) }
            );
        }
    };

    const handleDeleteCategory = () => {
        if (!categoryToDelete) return;
        deleteCategoryMutation.mutate(categoryToDelete.id, {
            onSuccess: () => {
                if (resolvedActiveCategoryId === categoryToDelete.id) {
                    const remaining = categories.filter((c) => c.id !== categoryToDelete.id);
                    setActiveCategoryId(remaining.length > 0 ? remaining[0].id : "");
                }
                setCategoryToDelete(null);
            }
        });
    };

    const handleAddFood = () => {
        setFoodToEdit(null);
        setIsFoodModalOpen(true);
    };

    const handleEditFood = (food: any) => {
        setFoodToEdit(food);
        setIsFoodModalOpen(true);
    };

    const handleDeleteFood = () => {
        if (!foodToDelete) return;
        deleteFoodMutation.mutate(foodToDelete.id, {
            onSuccess: () => setFoodToDelete(null)
        });
    };

    const isCategoryMutationPending = createCategoryMutation.isPending || updateCategoryMutation.isPending;

    return (
        <Section className="flex h-full min-h-[calc(100vh-64px)] rounded-2xl overflow-hidden my-6 sm:my-0 w-full bg-white border border-gray-200 shadow-sm relative">
            {/* Mobile Backdrop */}
            {isSidebarToggled && (
                <div
                    className="absolute inset-0 bg-gray-900/50 z-40 xl:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarToggled(false)}
                />
            )}

            <CategorySidebar
                categories={categories}
                activeCategoryId={resolvedActiveCategoryId}
                setActiveCategoryId={setActiveCategoryId}
                onAddCategory={handleOpenAddCategory}
                onEditCategory={handleOpenEditCategory}
                onDeleteCategory={(id) => {
                    const cat = categories.find((c) => c.id === id) ?? null;
                    setCategoryToDelete(cat);
                }}
                isToggled={isSidebarToggled}
                onClose={() => setIsSidebarToggled(false)}
                isLoading={isCategoriesLoading}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={!!hasNextPage}
                fetchNextPage={fetchNextPage}
                searchValue={categorySearch}
                onSearchChange={handleCategorySearchChange}
            />

            <FoodGrid
                activeCategory={activeCategory}
                activeCategoryFoods={activeCategoryFoods}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onAddFood={handleAddFood}
                onEditFood={handleEditFood}
                onDeleteFood={(food) => setFoodToDelete(food)}
                onToggleSidebar={() => setIsSidebarToggled(!isSidebarToggled)}
                isFetchingNextPage={isFetchingNextMenuItemPage}
                hasNextPage={!!hasNextMenuItemPage}
                fetchNextPage={fetchNextMenuItemPage}
            />

            <AddCategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                initialData={categoryModalData}
                onSave={handleSaveCategory}
                isPending={isCategoryMutationPending}
            />

            <AddFoodModal
                activeCategoryId={activeCategoryId}
                isOpen={isFoodModalOpen}
                onClose={() => setIsFoodModalOpen(false)}
                initialData={foodToEdit}
            />

            {/* Delete Food Confirmation Modal */}
            <Modal
                isOpen={!!foodToDelete}
                onClose={() => setFoodToDelete(null)}
                title="Delete Menu Item"
                size="sm"
                footer={
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto border-gray-200"
                            onClick={() => setFoodToDelete(null)}
                            disabled={deleteFoodMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="w-full sm:w-auto"
                            onClick={handleDeleteFood}
                            isLoading={deleteFoodMutation.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-gray-600 font-medium">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-gray-900">
                        {foodToDelete?.name}
                    </span>
                    ? This action cannot be undone.
                </p>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                title="Delete Category"
                size="sm"
                footer={
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto border-gray-200"
                            onClick={() => setCategoryToDelete(null)}
                            disabled={deleteCategoryMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="w-full sm:w-auto"
                            disabled={categoryToDelete?.count ? categoryToDelete.count > 0 : false}
                            onClick={handleDeleteCategory}
                            isLoading={deleteCategoryMutation.isPending}
                        >
                            Delete
                        </Button>
                    </div>
                }
            >
                {
                    categoryToDelete?.count && categoryToDelete?.count > 0 ? (
                        <p>
                            You can't delete this category because it has {categoryToDelete?.count} menu items associated with it. Please move the menu items to another category and try again.
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600 font-medium">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-gray-900">
                                {categoryToDelete?.name}
                            </span>
                            ? This will also remove all menu items associated with it.
                        </p>
                    )
                }
            </Modal>
        </Section>
    );
}

