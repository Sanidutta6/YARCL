import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils"

function Breadcrumb({
    ...props
}) {
    return <nav aria-label="breadcrumb" {...props} />;
}

function BreadcrumbList({
    className,
    ...props
}) {
    return (
        <ol
            className={cn(
                "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
                className
            )}
            {...props}
        />
    );
}

function BreadcrumbItem({
    className,
    ...props
}) {
    return (
        <li
            className={cn("inline-flex items-center gap-1.5", className)}
            {...props}
        />
    );
}

function BreadcrumbLink({
    asChild,
    className,
    children,
    ...props
}) {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: cn("hover:text-foreground transition-colors", className),
            ...props
        });
    }

    return (
        <a
            className={cn("hover:text-foreground transition-colors", className)}
            {...props}
        >
            {children}
        </a>
    );
}

function BreadcrumbPage({
    className,
    ...props
}) {
    return (
        <span
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn("text-foreground font-normal", className)}
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    children,
    className,
    ...props
}) {
    return (
        <li
            role="presentation"
            aria-hidden="true"
            className={cn("[&>svg]:size-3.5", className)}
            {...props}
        >
            {children ?? <ChevronRight className="size-3.5" />}
        </li>
    );
}

function BreadcrumbEllipsis({
    className,
    ...props
}) {
    return (
        <span
            role="presentation"
            aria-hidden="true"
            className={cn("flex size-9 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">More</span>
        </span>
    );
}

export {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
};