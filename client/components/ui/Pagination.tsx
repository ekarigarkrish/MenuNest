"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export default React.memo(function Pagination({
    currentPage,
    totalPages,
    totalItems,
    limit,
    onPageChange
}: PaginationProps) {
    const maxPages = totalPages || 1;

    return (
        <>
            {
                totalItems > limit && (
                    <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between w-full">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{totalItems > 0 ? (currentPage - 1) * limit + 1 : 0}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * limit, totalItems)}</span> of <span className="font-medium text-gray-900">{totalItems}</span> results
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="!h-8 !w-8 rounded-md"
                                disabled={currentPage === 1}
                                onClick={() => onPageChange(currentPage - 1)}
                            >
                                <ChevronLeft size={20} />
                            </Button>

                            {(() => {
                                const pages = [];

                                if (maxPages <= 5) {
                                    for (let i = 1; i <= maxPages; i++) pages.push(i);
                                } else {
                                    if (currentPage <= 3) {
                                        pages.push(1, 2, 3, 4, '...', maxPages);
                                    } else if (currentPage >= maxPages - 2) {
                                        pages.push(1, '...', maxPages - 3, maxPages - 2, maxPages - 1, maxPages);
                                    } else {
                                        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', maxPages);
                                    }
                                }

                                return pages.map((page, index) => (
                                    typeof page === 'number' ? (
                                        <Button
                                            key={index}
                                            variant={currentPage === page ? "outline" : "ghost"}
                                            className={`!h-8 !w-8 rounded-md p-0 ${currentPage === page ? 'bg-gray-50 text-cayenne-red-600 border-cayenne-red-200' : 'text-gray-600'}`}
                                            onClick={() => onPageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    ) : (
                                        <span key={index} className="px-1 text-gray-400">...</span>
                                    )
                                ));
                            })()}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="!h-8 !w-8 rounded-md"
                                disabled={currentPage >= maxPages || totalItems === 0}
                                onClick={() => onPageChange(currentPage + 1)}
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>
                )
            }
        </>
    );
})