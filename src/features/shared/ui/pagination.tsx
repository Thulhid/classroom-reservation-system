import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
};

function PaginationLink({
  className,
  isActive,
  disabled,
  ...props
}: PaginationLinkProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      disabled={disabled}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border border-transparent text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50",
        isActive &&
          "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-50 hover:text-sky-700",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  children = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("size-auto gap-1 px-3", className)}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span className="hidden sm:inline">{children}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  children = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("size-auto gap-1 px-3", className)}
      {...props}
    >
      <span className="hidden sm:inline">{children}</span>
      <ChevronRight className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4 text-slate-400" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
