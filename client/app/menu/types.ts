

export type FoodItem = {
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

export type CartItem = FoodItem & { qty: number };
