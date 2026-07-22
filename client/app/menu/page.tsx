"use client";

import { useState, useMemo } from "react";
import {
    Search,
    ShoppingCart,
    Star,
    Clock,
    Flame,
    Leaf,
    X,
    Plus,
    Minus,
    ChevronRight,
} from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
    id: string;
    label: string;
    emoji: string;
    count: number;
};

type FoodItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    rating: number;
    prepTime: string;
    isVeg: boolean;
    isSpicy?: boolean;
    isBestSeller?: boolean;
    image: string;
};

type CartItem = FoodItem & { qty: number };

// ─── Static Data ──────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
    { id: "all", label: "All Items", emoji: "🍽️", count: 20 },
    { id: "starters", label: "Starters", emoji: "🥗", count: 5 },
    { id: "mains", label: "Main Course", emoji: "🍛", count: 6 },
    { id: "burgers", label: "Burgers", emoji: "🍔", count: 4 },
    { id: "pizza", label: "Pizza", emoji: "🍕", count: 3 },
    { id: "drinks", label: "Drinks", emoji: "🥤", count: 4 },
    { id: "desserts", label: "Desserts", emoji: "🍰", count: 3 },
];

const FOOD_ITEMS: FoodItem[] = [
    // Starters
    { id: "s1", name: "Crispy Veg Spring Rolls", description: "Golden fried rolls stuffed with seasoned vegetables and glass noodles.", price: 220, category: "starters", rating: 4.5, prepTime: "10 min", isVeg: true, isBestSeller: true, image: "🥢" },
    { id: "s2", name: "Chicken Tikka", description: "Smoky tandoor-grilled chicken marinated in spiced yogurt.", price: 340, category: "starters", rating: 4.8, prepTime: "15 min", isVeg: false, isSpicy: true, isBestSeller: true, image: "🍗" },
    { id: "s3", name: "Paneer Chilli", description: "Crispy paneer tossed in tangy Indo-Chinese chilli sauce.", price: 280, category: "starters", rating: 4.4, prepTime: "12 min", isVeg: true, isSpicy: true, image: "🧀" },
    { id: "s4", name: "Garlic Bread", description: "Toasted sourdough with herb butter and melted mozzarella.", price: 160, category: "starters", rating: 4.3, prepTime: "8 min", isVeg: true, image: "🥖" },
    { id: "s5", name: "Chicken Wings", description: "Crispy wings tossed in smoky BBQ or buffalo sauce.", price: 380, category: "starters", rating: 4.7, prepTime: "18 min", isVeg: false, isSpicy: true, image: "🍗" },
    // Mains
    { id: "m1", name: "Butter Chicken", description: "Slow-cooked chicken in rich tomato-butter gravy. Best with naan.", price: 420, category: "mains", rating: 4.9, prepTime: "20 min", isVeg: false, isBestSeller: true, image: "🍛" },
    { id: "m2", name: "Paneer Butter Masala", description: "Soft paneer cubes in creamy tomato-cashew sauce.", price: 360, category: "mains", rating: 4.7, prepTime: "18 min", isVeg: true, isBestSeller: true, image: "🍲" },
    { id: "m3", name: "Dal Makhani", description: "Slow-simmered black lentils with cream and spiced butter.", price: 280, category: "mains", rating: 4.6, prepTime: "20 min", isVeg: true, image: "🫘" },
    { id: "m4", name: "Chicken Biryani", description: "Fragrant basmati rice layered with spiced chicken and caramelized onions.", price: 450, category: "mains", rating: 4.8, prepTime: "25 min", isVeg: false, isSpicy: true, isBestSeller: true, image: "🍚" },
    { id: "m5", name: "Veg Biryani", description: "Aromatic basmati with fresh vegetables and whole spices.", price: 320, category: "mains", rating: 4.4, prepTime: "22 min", isVeg: true, image: "🍚" },
    { id: "m6", name: "Mutton Rogan Josh", description: "Slow-cooked tender mutton in Kashmiri spiced gravy.", price: 520, category: "mains", rating: 4.9, prepTime: "30 min", isVeg: false, isSpicy: true, image: "🥩" },
    // Burgers
    { id: "b1", name: "Classic Smash Burger", description: "Double smashed beef patty, cheddar, pickles, and special sauce.", price: 340, category: "burgers", rating: 4.8, prepTime: "12 min", isVeg: false, isBestSeller: true, image: "🍔" },
    { id: "b2", name: "Crispy Chicken Burger", description: "Fried chicken thigh, slaw, jalapeños, and chipotle mayo.", price: 299, category: "burgers", rating: 4.6, prepTime: "14 min", isVeg: false, isSpicy: true, image: "🍔" },
    { id: "b3", name: "Mushroom Swiss Burger", description: "Sautéed portobello mushrooms, Swiss cheese, and truffle aioli.", price: 260, category: "burgers", rating: 4.4, prepTime: "12 min", isVeg: true, image: "🍔" },
    { id: "b4", name: "BBQ Bacon Burger", description: "Beef patty, crispy bacon, onion rings, and smoky BBQ sauce.", price: 390, category: "burgers", rating: 4.7, prepTime: "14 min", isVeg: false, image: "🍔" },
    // Pizza
    { id: "p1", name: "Margherita Pizza", description: "San Marzano tomato, fresh mozzarella, and basil on a thin crust.", price: 350, category: "pizza", rating: 4.6, prepTime: "20 min", isVeg: true, image: "🍕" },
    { id: "p2", name: "Pepperoni Overload", description: "Loaded with premium pepperoni, smoked mozzarella, and oregano.", price: 440, category: "pizza", rating: 4.8, prepTime: "22 min", isVeg: false, isBestSeller: true, image: "🍕" },
    { id: "p3", name: "BBQ Chicken Pizza", description: "Smoky BBQ base, grilled chicken, red onion, and cheddar.", price: 420, category: "pizza", rating: 4.7, prepTime: "22 min", isVeg: false, image: "🍕" },
    // Drinks
    { id: "d1", name: "Mango Lassi", description: "Chilled fresh mango blended with thick yogurt and cardamom.", price: 120, category: "drinks", rating: 4.7, prepTime: "5 min", isVeg: true, isBestSeller: true, image: "🥭" },
    { id: "d2", name: "Classic Lemonade", description: "Freshly squeezed lemon with mint, basil, and soda.", price: 90, category: "drinks", rating: 4.5, prepTime: "3 min", isVeg: true, image: "🍋" },
    { id: "d3", name: "Cold Brew Coffee", description: "12-hour steeped Arabica cold brew with oat milk.", price: 180, category: "drinks", rating: 4.8, prepTime: "2 min", isVeg: true, image: "☕" },
    { id: "d4", name: "Virgin Mojito", description: "Sparkling lime, mint, and brown sugar over crushed ice.", price: 140, category: "drinks", rating: 4.6, prepTime: "4 min", isVeg: true, image: "🍹" },
    // Desserts
    { id: "ds1", name: "Gulab Jamun", description: "Warm milk-solid dumplings soaked in rose cardamom syrup.", price: 130, category: "desserts", rating: 4.8, prepTime: "5 min", isVeg: true, isBestSeller: true, image: "🍮" },
    { id: "ds2", name: "Chocolate Lava Cake", description: "Warm dark chocolate cake with a molten center and vanilla ice cream.", price: 220, category: "desserts", rating: 4.9, prepTime: "10 min", isVeg: true, image: "🍫" },
    { id: "ds3", name: "Kulfi Ice Cream", description: "Traditional Indian pistachio and saffron frozen dessert.", price: 140, category: "desserts", rating: 4.6, prepTime: "3 min", isVeg: true, image: "🍦" },
];

// ─── VegBadge ─────────────────────────────────────────────────────────────────

function VegBadge({ isVeg }: { isVeg: boolean }) {
    return (
        <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isVeg
                    ? "bg-green-50 text-green-700 border-green-300"
                    : "bg-red-50 text-red-700 border-red-300"
                }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${isVeg ? "bg-green-500" : "bg-red-500"}`} />
            {isVeg ? "VEG" : "NON-VEG"}
        </span>
    );
}

// ─── FoodCard ─────────────────────────────────────────────────────────────────

function FoodCard({
    item,
    onAdd,
    cartQty,
    onIncrease,
    onDecrease,
}: {
    item: FoodItem;
    onAdd: (item: FoodItem) => void;
    cartQty: number;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
}) {
    return (
        <article className="bg-white rounded-2xl border border-carbon-black-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
            {/* Emoji image */}
            <div className="relative bg-gradient-to-br from-orange-50 to-cayenne-red-50 h-36 flex items-center justify-center text-6xl flex-shrink-0">
                {item.image}
                {item.isBestSeller && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-cayenne-red-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-white stroke-none" /> Best Seller
                    </span>
                )}
                {item.isSpicy && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        <Flame className="w-2.5 h-2.5" /> Spicy
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-carbon-black-900 text-sm leading-snug line-clamp-1 flex-1">
                        {item.name}
                    </h3>
                    <VegBadge isVeg={item.isVeg} />
                </div>

                <p className="text-carbon-black-500 text-xs leading-relaxed line-clamp-2 flex-1">
                    {item.description}
                </p>

                {/* Rating & prep time */}
                <div className="flex items-center gap-3 text-xs text-carbon-black-400">
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-orange-500 fill-orange-500 stroke-none" />
                        <span className="font-semibold text-carbon-black-700">{item.rating}</span>
                    </span>
                    <span className="w-px h-3 bg-carbon-black-200" />
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.prepTime}
                    </span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-carbon-black-100">
                    <span className="font-heading font-extrabold text-carbon-black-900 text-base">
                        ₹{item.price}
                    </span>

                    {cartQty === 0 ? (
                        <Button
                            id={`add-${item.id}`}
                            size="sm"
                            variant="primary"
                            onClick={() => onAdd(item)}
                            leftIcon={<Plus className="w-3.5 h-3.5" />}
                            className="text-xs"
                        >
                            Add
                        </Button>
                    ) : (
                        <div className="flex items-center gap-1 bg-cayenne-red-50 rounded-lg border border-cayenne-red-200 px-1.5 py-1">
                            <button
                                id={`dec-${item.id}`}
                                onClick={() => onDecrease(item.id)}
                                aria-label="Decrease quantity"
                                className="w-6 h-6 rounded-md flex items-center justify-center text-cayenne-red-600 hover:bg-cayenne-red-100 transition-colors"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-sm text-cayenne-red-700">
                                {cartQty}
                            </span>
                            <button
                                id={`inc-${item.id}`}
                                onClick={() => onIncrease(item.id)}
                                aria-label="Increase quantity"
                                className="w-6 h-6 rounded-md flex items-center justify-center text-cayenne-red-600 hover:bg-cayenne-red-100 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
    cart,
    onClose,
    onIncrease,
    onDecrease,
    onRemove,
}: {
    cart: CartItem[];
    onClose: () => void;
    onIncrease: (id: string) => void;
    onDecrease: (id: string) => void;
    onRemove: (id: string) => void;
}) {
    const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const itemCount = cart.reduce((a, i) => a + i.qty, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />

            {/* Drawer */}
            <aside
                id="cart-drawer"
                role="dialog"
                aria-label="Cart"
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-carbon-black-100">
                    <h2 className="font-heading font-bold text-lg text-carbon-black-900 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-cayenne-red-500" />
                        Your Order
                        {itemCount > 0 && (
                            <span className="text-xs font-bold bg-cayenne-red-100 text-cayenne-red-600 px-2 py-0.5 rounded-full">
                                {itemCount} item{itemCount !== 1 ? "s" : ""}
                            </span>
                        )}
                    </h2>
                    <button
                        id="close-cart"
                        type="button"
                        onClick={onClose}
                        aria-label="Close cart"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-carbon-black-500 hover:bg-orange-400 hover:text-white transition-all duration-150 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-carbon-black-400 gap-3 py-16">
                            <span className="text-6xl">🛒</span>
                            <p className="font-heading font-bold text-lg text-carbon-black-600">Cart is empty</p>
                            <p className="text-sm text-center">Add something delicious from the menu!</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 rounded-xl border border-carbon-black-100 bg-carbon-black-50"
                            >
                                <span className="text-2xl flex-shrink-0">{item.image}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-carbon-black-900 truncate">{item.name}</p>
                                    <p className="text-xs text-carbon-black-500 mt-0.5">
                                        ₹{item.price} × {item.qty} = <span className="font-semibold text-carbon-black-700">₹{item.price * item.qty}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => onDecrease(item.id)} className="w-6 h-6 rounded-md bg-carbon-black-100 hover:bg-carbon-black-200 flex items-center justify-center text-carbon-black-600 transition-colors">
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-5 text-center text-sm font-bold text-carbon-black-800">{item.qty}</span>
                                    <button onClick={() => onIncrease(item.id)} className="w-6 h-6 rounded-md bg-carbon-black-100 hover:bg-carbon-black-200 flex items-center justify-center text-carbon-black-600 transition-colors">
                                        <Plus className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => onRemove(item.id)} aria-label="Remove item" className="ml-1 w-6 h-6 rounded-md hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-carbon-black-100 px-5 py-4 space-y-3 bg-white">
                        <div className="flex justify-between text-sm text-carbon-black-600">
                            <span>Subtotal</span>
                            <span className="font-semibold text-carbon-black-900">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-carbon-black-500">
                            <span>Taxes &amp; Charges (5%)</span>
                            <span>₹{tax}</span>
                        </div>
                        <div className="flex justify-between font-heading font-bold text-base text-carbon-black-900 border-t border-carbon-black-100 pt-3">
                            <span>Total</span>
                            <span className="text-cayenne-red-600">₹{total}</span>
                        </div>
                        <Button
                            id="place-order-btn"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                        >
                            Place Order
                        </Button>
                    </div>
                )}
            </aside>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Menu() {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [dietFilter, setDietFilter] = useState<"all" | "veg" | "non-veg">("all");

    const filteredItems = useMemo(() => {
        const q = search.toLowerCase();
        return FOOD_ITEMS.filter((item) => {
            const matchCat = activeCategory === "all" || item.category === activeCategory;
            const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
            const matchDiet =
                dietFilter === "all" ||
                (dietFilter === "veg" && item.isVeg) ||
                (dietFilter === "non-veg" && !item.isVeg);
            return matchCat && matchSearch && matchDiet;
        });
    }, [activeCategory, search, dietFilter]);

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

    return (
        <>
            {cartOpen && (
                <CartDrawer
                    cart={cart}
                    onClose={() => setCartOpen(false)}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                />
            )}

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
                        <button
                            id="open-cart-btn"
                            onClick={() => setCartOpen(true)}
                            aria-label="Open cart"
                            className="relative self-start sm:self-auto flex items-center gap-2.5 px-5 py-2.5 bg-cayenne-red-500 hover:bg-cayenne-red-600 text-white font-semibold rounded-xl shadow-sm transition-colors duration-200 cursor-pointer"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="font-heading">Cart</span>
                            {totalCartQty > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                                    {totalCartQty}
                                </span>
                            )}
                        </button>
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
                        <div className="flex items-center gap-1 bg-white rounded-xl border border-carbon-black-200 p-1 h-11 flex-shrink-0">
                            {(["all", "veg", "non-veg"] as const).map((f) => (
                                <button
                                    key={f}
                                    id={`diet-filter-${f}`}
                                    onClick={() => setDietFilter(f)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${dietFilter === f
                                            ? f === "veg"
                                                ? "bg-green-500 text-white"
                                                : f === "non-veg"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-carbon-black-800 text-white"
                                            : "text-carbon-black-500 hover:bg-carbon-black-100"
                                        }`}
                                >
                                    {f === "veg" && <Leaf className="w-3 h-3" />}
                                    {f === "non-veg" && <Flame className="w-3 h-3" />}
                                    {f === "all" ? "All" : f === "veg" ? "Veg" : "Non-Veg"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Category Tabs ── */}
                    <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            // count for this category respecting diet filter & search
                            const catCount = isActive
                                ? filteredItems.length
                                : cat.id === "all"
                                    ? FOOD_ITEMS.filter((i) => {
                                        const matchDiet = dietFilter === "all" || (dietFilter === "veg" ? i.isVeg : !i.isVeg);
                                        const q = search.toLowerCase();
                                        const matchSearch = !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
                                        return matchDiet && matchSearch;
                                    }).length
                                    : FOOD_ITEMS.filter((i) => {
                                        const matchDiet = dietFilter === "all" || (dietFilter === "veg" ? i.isVeg : !i.isVeg);
                                        const q = search.toLowerCase();
                                        const matchSearch = !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
                                        return i.category === cat.id && matchDiet && matchSearch;
                                    }).length;

                            return (
                                <button
                                    key={cat.id}
                                    id={`cat-${cat.id}`}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border cursor-pointer ${isActive
                                            ? "bg-cayenne-red-500 text-white border-cayenne-red-500 shadow-sm"
                                            : "bg-white text-carbon-black-600 border-carbon-black-200 hover:border-cayenne-red-300 hover:text-cayenne-red-600"
                                        }`}
                                >
                                    <span>{cat.emoji}</span>
                                    <span>{cat.label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-carbon-black-100 text-carbon-black-500"}`}>
                                        {catCount}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Food Grid ── */}
                    {filteredItems.length === 0 ? (
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
