import type { ComponentProps } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "@/components/icons";
import Button, { type ButtonProps } from "@/components/ui/Button/Button";
import cn from "@/lib/utils";

function Pagination({ className, ...props }: Readonly<ComponentProps<"nav">>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto hidden w-full justify-center md:flex", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: Readonly<ComponentProps<"ul">>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-3", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: Readonly<ComponentProps<"li">>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = ButtonProps;

function PaginationLink({ className, children, ...props }: PaginationLinkProps) {
  return (
    <Button
      color="black"
      variant="ghost"
      type="button"
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-sm md:h-5 md:min-w-5 lg:h-6 lg:min-w-6",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

type PaginationPreviousProps = {
  hasPrevPage?: boolean;
  iconClassName?: string;
} & ComponentProps<typeof PaginationLink>;

function PaginationPrevious({
  className,
  iconClassName,
  hasPrevPage,
  ...props
}: PaginationPreviousProps) {
  return (
    <PaginationLink aria-label="Go to previous page" className={className} {...props}>
      <ChevronLeft
        className={cn(
          hasPrevPage ? "text-gray-100" : "text-gray-400",
          "md:size-5 lg:size-6",
          iconClassName
        )}
      />
    </PaginationLink>
  );
}

type PaginationNextProps = {
  hasNextPage?: boolean;
  iconClassName?: string;
} & ComponentProps<typeof PaginationLink>;

function PaginationNext({ className, iconClassName, hasNextPage, ...props }: PaginationNextProps) {
  return (
    <PaginationLink aria-label="Go to next page" className={className} {...props}>
      <ChevronRight
        className={cn(
          hasNextPage ? "text-gray-100" : "text-gray-400",
          "md:size-5 lg:size-6",
          iconClassName
        )}
      />
    </PaginationLink>
  );
}

type PaginationFastPrevProps = {
  hasPrevPage?: boolean;
  iconClassName?: string;
} & ComponentProps<typeof PaginationLink>;

function PaginationFastPrev({
  className,
  iconClassName,
  hasPrevPage,
  ...props
}: PaginationFastPrevProps) {
  return (
    <PaginationLink aria-label="Go to fast backward page" className={className} {...props}>
      <ChevronDoubleLeft
        className={cn(
          hasPrevPage ? "text-gray-100" : "text-gray-400",
          "md:size-5 lg:size-6",
          iconClassName
        )}
      />
    </PaginationLink>
  );
}

type PaginationFastNextProps = {
  hasNextPage?: boolean;
  iconClassName?: string;
} & ComponentProps<typeof PaginationLink>;

function PaginationFastNext({
  className,
  iconClassName,
  hasNextPage,
  ...props
}: PaginationFastNextProps) {
  return (
    <PaginationLink aria-label="Go to fast forward page" className={className} {...props}>
      <ChevronDoubleRight
        className={cn(
          hasNextPage ? "text-gray-100" : "text-gray-400",
          "md:size-5 lg:size-6",
          iconClassName
        )}
      />
    </PaginationLink>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFastPrev,
  PaginationFastNext,
};
