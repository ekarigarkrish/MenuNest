"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, ShoppingCart, Flame, Leaf } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import CartDrawer from "./_components/CartDrawer";
import FoodCard from "./_components/FoodCard";
import CustomerDetailsForm, { CustomerDetails } from "./_components/CustomerDetailsForm";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Fetch } from "@/config/axios.config";
import Image from "next/image";

type FoodItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    category: string;
    prepTime: string;
    isVeg: boolean;
    isBestSeller?: boolean;
    image: string;
};

const storage = {
    setDetails: (details: any) => {
        sessionStorage.setItem('details', JSON.stringify(details));
    },
    getDetails: () => {
        const details = sessionStorage.getItem('details');
        return details ? JSON.parse(details) : null;
    },
    removeDetails: () => {
        sessionStorage.removeItem('details');
    }
}

export default function Menu() {

    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<any[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [customerFormOpen, setCustomerFormOpen] = useState(false);
    const [customer, setCustomer] = useState<CustomerDetails | null>(null);
    const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non-veg">("all");

    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["public-categories"],
        queryFn: async () => {
            const res = await Fetch.get("/api/category/public/all");
            return res.data;
        }
    });

    const observerTarget = useRef<HTMLDivElement>(null);

    const { data: menuItemsResponse, isLoading: isMenuItemsLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["public-menu-items", activeCategory, search, dietFilter],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams();
            params.append("page", pageParam.toString());
            params.append("limit", "12");
            if (activeCategory !== "all") params.append("categoryId", activeCategory);
            if (search) params.append("search", search);
            if (dietFilter !== "all") params.append("isVeg", dietFilter === "veg" ? "true" : "false");

            const res = await Fetch.get(`/api/menu/public/all?${params.toString()}`);
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    });

    const filteredItems: FoodItem[] = useMemo(() => {
        if (!menuItemsResponse?.pages) return [];
        const allItems = menuItemsResponse.pages.flatMap(page => page.menuItems || []);

        return allItems.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            discountPrice: item.discountPrice,
            category: item.categoryId,
            prepTime: item.preparationTime ? `${item.preparationTime} mins` : "15 mins",
            isVeg: item.isVeg,
            isBestSeller: item.isFeatured,
            image: item.image || "🍽️",
        }));
    }, [menuItemsResponse]);

    const categories = useMemo(() => {
        const defaultAll = { id: "all", name: "All Items", image: null, count: categoriesResponse?.itemTotal || 0 };
        if (!categoriesResponse?.categories) return [defaultAll];
        return [defaultAll, ...categoriesResponse.categories];
    }, [categoriesResponse]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    const totalCartQty = cart.reduce((acc, i) => acc + i.qty, 0);

    const cartQtyMap = useMemo(() => {
        const map: Record<string, number> = {};
        cart.forEach((i) => (map[i.id] = i.qty));
        return map;
    }, [cart]);

    const handleAdd = (item: FoodItem) =>
        setCart((prev) => {
            const found = prev.find((c) => c.id === item.id);
            if (found) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
            return [...prev, { ...item, qty: 1 }];
        });

    const handleIncrease = (id: string) =>
        setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: c.qty + 1 } : c));

    const handleDecrease = (id: string) =>
        setCart((prev) =>
            prev.map((c) => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter((c) => c.qty > 0)
        );

    const handleRemove = (id: string) =>
        setCart((prev) => prev.filter((c) => c.id !== id));

    useEffect(() => {
        if (storage.getDetails()) {
            setCustomer(storage.getDetails());
        }
    }, []);

    return (
        <>
            <AnimatePresence>
                {cartOpen && (
                    <CartDrawer
                        storage={storage}
                        cart={cart}
                        onClose={() => setCartOpen(false)}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        onRemove={handleRemove}
                    />
                )}
            </AnimatePresence>

            <CustomerDetailsForm
                isOpen={customerFormOpen}
                onClose={() => setCustomerFormOpen(false)}
                onSubmit={(details) => {
                    setCustomer(details);
                    storage.setDetails(details)
                    setCartOpen(true);
                }}
            />

            <Section className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white">
                <Container className="py-8 md:py-12">

                    {/* ── Page Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-cayenne-red-500 font-semibold text-sm uppercase tracking-widest mb-1">
                                Our Menu
                            </p>
                            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-carbon-black-900 leading-tight">
                                What would you like
                                <br className="hidden sm:block" />
                                to eat today?
                            </h1>
                        </div>

                        {/* Cart Button */}
                        <Button
                            id="open-cart-btn"
                            variant="primary"
                            onClick={() => {
                                if (!customer) {
                                    setCustomerFormOpen(true);
                                } else {
                                    setCartOpen(true);
                                }
                            }}
                            aria-label="Open cart"
                            className="fixed bottom-10 right-5 z-20 self-start sm:self-auto sm:relative !rounded-xl"
                        >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            <span className="font-heading">Cart</span>
                            {totalCartQty > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                                    {totalCartQty}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* ── Search + Diet Filter ── */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-7">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-carbon-black-400 pointer-events-none" />
                            <input
                                id="menu-search"
                                type="search"
                                placeholder="Search dishes, ingredients…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 h-11 rounded-xl border border-carbon-black-200 bg-white text-sm text-carbon-black-800 placeholder:text-carbon-black-400 focus:outline-none focus:ring-2 focus:ring-cayenne-red-400 focus:border-transparent transition"
                            />
                        </div>

                        {/* Diet Filter */}
                        <div className="flex items-center p-1 bg-carbon-black-50 rounded-xl border border-carbon-black-100 flex-shrink-0 h-11">
                            {(["all", "veg", "non-veg"] as const).map((f) => {
                                const isActive = dietFilter === f;
                                return (
                                    <Button
                                        key={f}
                                        id={`diet-filter-${f}`}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDietFilter(f)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cayenne-red-500 ${isActive
                                            ? "bg-white text-carbon-black-900 shadow-sm ring-1 ring-black/5"
                                            : "text-carbon-black-500 hover:text-carbon-black-900 hover:bg-carbon-black-100/50"
                                            }`}
                                    >
                                        {f === "veg" && <Leaf className={`w-3.5 h-3.5 ${isActive ? "text-green-600" : ""}`} />}
                                        {f === "non-veg" && <Flame className={`w-3.5 h-3.5 ${isActive ? "text-red-500" : ""}`} />}
                                        {f === "all" ? "All" : f === "veg" ? "Veg" : "Non-Veg"}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Category Tabs ── */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                        {isCategoriesLoading ? (
                            <div className="flex gap-2 animate-pulse">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="h-10 w-24 bg-carbon-black-100 rounded-xl shrink-0"></div>
                                ))}
                            </div>
                        ) : categories.map((cat) => {
                            const isActive = activeCategory === cat.id;

                            return (
                                <Button
                                    key={cat.id}
                                    id={`cat-${cat.id}`}
                                    variant={isActive ? "primary" : "ghost"}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 !px-4 !py-2.5 !rounded-xl text-sm font-semibold transition-all duration-150 ${isActive
                                        ? "shadow-sm"
                                        : "bg-white text-carbon-black-600 border border-carbon-black-200 hover:border-cayenne-red-300 hover:text-cayenne-red-600 hover:bg-transparent"
                                        }`}
                                >
                                    {cat.image ? (
                                        <div className="w-5 h-5 relative rounded-full">
                                            <Image src={cat.image} fill alt={cat.name} className="rounded-full object-cover" />
                                        </div>
                                    ) : (
                                        <span>🍽️</span>
                                    )}
                                    <span>{cat.name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-carbon-black-100 text-carbon-black-500"}`}>
                                        {cat.count}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>

                    {/* ── Food Grid ── */}
                    {isMenuItemsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-72 bg-carbon-black-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-carbon-black-400 gap-4">
                            <span className="text-7xl">🍽️</span>
                            <p className="font-heading font-bold text-xl text-carbon-black-700">No dishes found</p>
                            <p className="text-sm text-center max-w-xs">
                                Try a different category, search term, or diet filter.
                            </p>
                            <Button
                                id="clear-filters-btn"
                                variant="outline"
                                size="sm"
                                onClick={() => { setSearch(""); setActiveCategory("all"); setDietFilter("all"); }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredItems.map((item) => (
                                    <FoodCard
                                        key={item.id}
                                        item={item}
                                        onAdd={handleAdd}
                                        cartQty={cartQtyMap[item.id] ?? 0}
                                        onIncrease={handleIncrease}
                                        onDecrease={handleDecrease}
                                    />
                                ))}
                            </div>

                            {/* Infinite scroll observer target */}
                            <div ref={observerTarget} className="w-full h-8 mt-8 flex justify-center items-center">
                                {isFetchingNextPage && (
                                    <div className="animate-pulse flex gap-2 items-center">
                                        <div className="w-2 h-2 bg-cayenne-red-400 rounded-full"></div>
                                        <div className="w-2 h-2 bg-cayenne-red-400 rounded-full animation-delay-200"></div>
                                        <div className="w-2 h-2 bg-cayenne-red-400 rounded-full animation-delay-400"></div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Results count */}
                    {filteredItems.length > 0 && (
                        <p className="text-center text-xs text-carbon-black-400 mt-10">
                            Showing <span className="font-semibold text-carbon-black-600">{filteredItems.length}</span> dish{filteredItems.length !== 1 ? "es" : ""}
                        </p>
                    )}

                </Container>
            </Section>
        </>
    );
}