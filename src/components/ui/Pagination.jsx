import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({
    className = '',
    children
}) => {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={`mx-auto flex w-full justify-center ${className}`}
        >
            {children}
        </nav>
    );
};

export const PaginationContent = ({
    className = '',
    children
}) => {
    return (
        <ul className={`flex flex-row items-center gap-1 ${className}`}>
            {children}
        </ul>
    );
};

export const PaginationItem = ({
    className = '',
    children
}) => {
    return <li className={className}>{children}</li>;
};

export const PaginationLink = ({
    className = '',
    isActive = false,
    children,
    href = "#",
    onClick
}) => {
    return (
        <a
            aria-current={isActive ? "page" : undefined}
            href={href}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm ${isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                } ${className}`}
        >
            {children}
        </a>
    );
};

export const PaginationPrevious = ({
    className = '',
    href,
    onClick
}) => {
    return (
        <PaginationLink
            href={href}
            onClick={onClick}
            className={`gap-1 pl-2.5 ${className}`}
        >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
        </PaginationLink>
    );
};

export const PaginationNext = ({
    className = '',
    href,
    onClick
}) => {
    return (
        <PaginationLink
            href={href}
            onClick={onClick}
            className={`gap-1 pr-2.5 ${className}`}
        >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
        </PaginationLink>
    );
};

export const PaginationEllipsis = ({
    className = ''
}) => {
    return (
        <span
            className={`flex h-9 w-9 items-center justify-center ${className}`}
            aria-hidden="true"
        >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More pages</span>
        </span>
    );
};

// Export the main Pagination component as default
export default Pagination;