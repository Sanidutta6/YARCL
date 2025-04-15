import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const CollapsibleContext = React.createContext({
    isOpen: false,
    toggle: () => { },
});

function Collapsible({ children, defaultOpen = false, className, ...props }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggle = () => setIsOpen(prev => !prev);

    return (
        <CollapsibleContext.Provider value={{ isOpen, toggle }}>
            <div
                data-slot="collapsible"
                className={cn("w-full", className)}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
            </div>
        </CollapsibleContext.Provider>
    );
}

function CollapsibleTrigger({
    children,
    className,
    asChild = false,
    ...props
}) {
    const { isOpen, toggle } = React.useContext(CollapsibleContext);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: (e) => {
                toggle();
                children.props.onClick?.(e);
            },
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
            onClick={toggle}
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

function CollapsibleContent({ children, className, ...props }) {
    const { isOpen } = React.useContext(CollapsibleContext);
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            const resizeObserver = new ResizeObserver((entries) => {
                setHeight(entries[0].contentRect.height);
            });

            resizeObserver.observe(contentRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    return (
        <div
            data-slot="collapsible-content"
            className={cn(
                "overflow-hidden transition-all duration-200",
                className
            )}
            style={{
                height: isOpen ? `${height}px` : "0px",
                opacity: isOpen ? 1 : 0,
            }}
            aria-hidden={!isOpen}
            {...props}
        >
            <div ref={contentRef}>
                {children}
            </div>
        </div>
    );
}

// Add display names to help with debugging
Collapsible.displayName = "Collapsible";
CollapsibleTrigger.displayName = "CollapsibleTrigger";
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };