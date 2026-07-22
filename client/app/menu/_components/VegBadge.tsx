import React from "react";

export default React.memo(function VegBadge({ isVeg }: { isVeg: boolean }) {
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
});
