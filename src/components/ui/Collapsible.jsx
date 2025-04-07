import React, { useState } from "react";
import { cn } from "@/lib/utils"

function Collapsible({ children, defaultOpen = false, className, ...props }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            data-slot="collapsible"
            className={cn("w-full", className)}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (child.type === CollapsibleTrigger) {
                    return React.cloneElement(child, {
                        isOpen,
                        onClick: () => setIsOpen(!isOpen)
                    });
                }
                if (child.type === CollapsibleContent) {
                    return React.cloneElement(child, { isOpen });
                }
                return child;
            })}
        </div>
    );
}

function CollapsibleTrigger({
    children,
    isOpen,
    onClick,
    className,
    asChild = false,
    ...props
}) {
    if (asChild) {
        return React.cloneElement(React.Children.only(children), {
            onClick,
            'aria-expanded': isOpen,
            'data-state': isOpen ? 'open' : 'closed',
            className: cn(
                children.props.className,
                'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
                className
            ),
            ...props
        });
    }

    return (
        <button
            data-slot="collapsible-trigger"
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
                className
            )}
            aria-expanded={isOpen}
            data-state={isOpen ? 'open' : 'closed'}
            {...props}
        >
            {children}
        </button>
    );
}

function CollapsibleContent({ children, isOpen, className, ...props }) {
    return (
        <div
            data-slot="collapsible-content"
            className={cn(
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0",
                className
            )}
            aria-hidden={!isOpen}
            {...props}
        >
            {children}
        </div>
    );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };