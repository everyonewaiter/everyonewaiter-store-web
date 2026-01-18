import type { MouseEventHandler } from "react";
import * as PaginationComponents from "@/components/ui/Pagination/Pagination.components";
import cn from "@/lib/utils";

export interface PaginationResponse {
  page: number;
  size: number;
  pageSkipSize: number;
  count: number;
  fastForwardPage: number;
  fastBackwardPage: number;
  isFirst: boolean;
  isLast: boolean;
}

interface IProps {
  currentPage: number;
  className?: string;
  pagination: PaginationResponse;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  className,
  pagination,
  onPageChange,
}: Readonly<IProps>) {
  const { fastForwardPage, fastBackwardPage, isFirst, isLast } = pagination;

  const hasPrevious = !isFirst;
  const hasNext = !isLast;

  const handlePrevious: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (hasPrevious && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (hasNext && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFastBackward: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (hasPrevious && onPageChange) {
      onPageChange(currentPage - fastBackwardPage);
    }
  };

  const handleFastForward: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (hasNext && onPageChange) {
      onPageChange(currentPage + fastForwardPage);
    }
  };

  return (
    <PaginationComponents.Pagination className={cn("w-full", className)}>
      <PaginationComponents.PaginationContent>
        <div className="flex items-center gap-1">
          <PaginationComponents.PaginationItem>
            <PaginationComponents.PaginationFastPrev
              hasPrevPage={hasPrevious}
              onClick={handleFastBackward}
              className={cn(!hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer")}
              iconClassName={cn(hasPrevious && "text-gray-100!")}
            />
          </PaginationComponents.PaginationItem>

          <PaginationComponents.PaginationItem>
            <PaginationComponents.PaginationPrevious
              hasPrevPage={hasPrevious}
              onClick={handlePrevious}
              className={cn(!hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer")}
              iconClassName={cn(hasPrevious && "text-gray-100!")}
            />
          </PaginationComponents.PaginationItem>
        </div>

        <PaginationComponents.PaginationItem>
          <PaginationComponents.PaginationLink className="bg-gray-100 text-white md:px-1 md:text-xs md:font-semibold lg:px-2 lg:text-sm lg:font-bold">
            {currentPage}
          </PaginationComponents.PaginationLink>
        </PaginationComponents.PaginationItem>

        <div className="flex items-center gap-1">
          <PaginationComponents.PaginationItem>
            <PaginationComponents.PaginationNext
              hasNextPage={hasNext}
              onClick={handleNext}
              className={cn(!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer")}
              iconClassName={cn(hasNext && "text-gray-100!")}
            />
          </PaginationComponents.PaginationItem>

          <PaginationComponents.PaginationItem>
            <PaginationComponents.PaginationFastNext
              hasNextPage={hasNext}
              onClick={handleFastForward}
              className={cn(!hasNext ? "pointer-events-none opacity-50" : "cursor-pointer")}
              iconClassName={cn(hasNext && "text-gray-100!")}
            />
          </PaginationComponents.PaginationItem>
        </div>
      </PaginationComponents.PaginationContent>
    </PaginationComponents.Pagination>
  );
}
