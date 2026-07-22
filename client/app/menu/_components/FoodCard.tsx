import React from "react";
import Image from "next/image";
import { Star, Clock, Plus, Minus } from "lucide-react";
import Button from "@/components/ui/Button";
import VegBadge from "./VegBadge";

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


export default React.memo(function FoodCard({
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
        <article className="bg-white rounded-2xl border border-carbon-black-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
            {/* Image or Emoji */}
            <div className="relative bg-gradient-to-br from-orange-50 to-cayenne-red-50 h-32 sm:h-36 md:h-40 flex items-center justify-center text-5xl sm:text-6xl flex-shrink-0">
                {item.image && (item.image.startsWith('http') || item.image.startsWith('/')) ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" loading="eager" />
                ) : (
                    item.image || "🍽️"
                )}
                {item.isBestSeller && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-cayenne-red-500 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                        <Star className="w-2.5 h-2.5 fill-white stroke-none" /> Best Seller
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-bold text-carbon-black-900 text-sm sm:text-base leading-snug line-clamp-1 flex-1">
                        {item.name}
                    </h3>
                    <VegBadge isVeg={item.isVeg} />
                </div>

                <p className="text-carbon-black-500 text-[11px] sm:text-xs leading-relaxed line-clamp-2 flex-1">
                    {item.description}
                </p>

                {/* Rating & prep time */}
                <div className="flex items-center gap-3 text-xs text-carbon-black-400 mt-1 sm:mt-0">
                    {/* <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-orange-500 fill-orange-500 stroke-none" />
                        <span className="font-semibold text-carbon-black-700">{item.rating}</span>
                    </span>
                    <span className="w-px h-3 bg-carbon-black-200" /> */}
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.prepTime}
                    </span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-carbon-black-100">
                    <div className="flex flex-col">
                        <span className="font-heading font-extrabold text-carbon-black-900 text-sm sm:text-base">
                            ₹{item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price}
                        </span>
                        {item.discountPrice && item.discountPrice < item.price && (
                            <span className="text-[9px] sm:text-[10px] text-carbon-black-400 line-through">
                                ₹{item.price}
                            </span>
                        )}
                    </div>

                    {cartQty === 0 ? (
                        <Button
                            id={`add-${item.id}`}
                            size="sm"
                            variant="primary"
                            onClick={() => onAdd(item)}
                            leftIcon={<Plus className="w-3.5 h-3.5" />}
                            className="text-xs w-20 sm:w-24 shadow-sm"
                        >
                            Add
                        </Button>
                    ) : (
                        <div className="flex items-center bg-white rounded-lg border border-carbon-black-200 h-8 w-20 sm:w-24 p-0.5 shadow-sm">
                            <Button
                                id={`dec-${item.id}`}
                                variant="ghost"
                                size="icon"
                                onClick={() => onDecrease(item.id)}
                                aria-label="Decrease quantity"
                                className="w-7 h-full rounded-md flex items-center justify-center text-carbon-black-500 hover:text-cayenne-red-600 hover:bg-cayenne-red-50 transition-all active:scale-95"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="flex-1 text-center font-bold text-sm text-carbon-black-800 select-none">
                                {cartQty}
                            </span>
                            <Button
                                id={`inc-${item.id}`}
                                variant="ghost"
                                size="icon"
                                onClick={() => onIncrease(item.id)}
                                aria-label="Increase quantity"
                                className="w-7 h-full rounded-md flex items-center justify-center text-carbon-black-500 hover:text-cayenne-red-600 hover:bg-cayenne-red-50 transition-all active:scale-95"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
})