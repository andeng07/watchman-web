import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import * as React from "react";

export function PaginationComponent({ totalPages, currentPage, setCurrentPage } : { totalPages: number, currentPage: number, setCurrentPage: (page: number) => void } ) {
    const handlePageChange = (event: React.MouseEvent | React.KeyboardEvent, page: number) => {
        event.preventDefault();
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const generatePageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        if (currentPage <= 3) {
            return [1, 2, 3, "...", totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, "...", currentPage, "...", totalPages];
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Always show Previous button but disable it on the first page */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => handlePageChange(e, currentPage - 1)}
                        className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                    />
                </PaginationItem>

                {generatePageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                        {page === "..." ? (
                            <input
                                className="w-12 text-center border rounded-md px-1"
                                min={1}
                                max={totalPages}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const target = e.target as HTMLInputElement;
                                        handlePageChange(e, Number(target.value));
                                        target.value = ""
                                    }
                                }}
                                placeholder="..."
                            />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={currentPage === page}
                                onClick={(e) => handlePageChange(e, Number(page))}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Always show Next button but disable it on the last page */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => handlePageChange(e, currentPage + 1)}
                        className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
