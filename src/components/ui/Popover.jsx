import React, { useState, useRef, useEffect } from "react";

const Popover = ({ children, open, onOpenChange, ...props }) => {
    const [isOpen, setIsOpen] = useState(open || false);
    const popoverRef = useRef(null);

    useEffect(() => {
        if (open !== undefined) {
            setIsOpen(open);
        }
    }, [open]);

    const handleOpenChange = (newState) => {
        if (onOpenChange) {
            onOpenChange(newState);
        }
        if (open === undefined) {
            setIsOpen(newState);
        }
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                handleOpenChange(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={popoverRef} data-slot="popover" {...props}>
            {React.Children.map(children, (child) => {
                if (child.type === PopoverTrigger) {
                    return React.cloneElement(child, {
                        isOpen,
                        onOpenChange: handleOpenChange,
                    });
                }
                if (child.type === PopoverContent) {
                    return React.cloneElement(child, { isOpen });
                }
                return child;
            })}
        </div>
    );
};

const PopoverTrigger = ({ children, isOpen, onOpenChange, asChild, ...props }) => {
    const triggerRef = useRef(null);

    const handleClick = (e) => {
        if (props.onClick) {
            props.onClick(e);
        }
        onOpenChange(!isOpen);
    };

    if (asChild) {
        return React.cloneElement(React.Children.only(children), {
            ref: triggerRef,
            onClick: handleClick,
            "aria-expanded": isOpen,
            "data-state": isOpen ? "open" : "closed",
            ...props,
        });
    }

    return (
        <button
            ref={triggerRef}
            onClick={handleClick}
            aria-expanded={isOpen}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            {children}
        </button>
    );
};

const PopoverContent = ({
    children,
    isOpen,
    align = "center",
    sideOffset = 4,
    className = "",
    ...props
}) => {
    const contentRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = React.useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const updatePosition = () => {
            if (triggerRef.current && contentRef.current) {
                const triggerRect = triggerRef.current.getBoundingClientRect();
                const contentRect = contentRef.current.getBoundingClientRect();

                let top = triggerRect.bottom + sideOffset;
                let left = triggerRect.left;

                if (align === "center") {
                    left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
                } else if (align === "end") {
                    left = triggerRect.right - contentRect.width;
                }

                if (left + contentRect.width > window.innerWidth) {
                    left = window.innerWidth - contentRect.width - 8;
                }
                if (left < 0) left = 8;

                if (top + contentRect.height > window.innerHeight) {
                    top = triggerRect.top - contentRect.height - sideOffset;
                }

                setPosition({ top, left });
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, [isOpen, align, sideOffset]);

    if (!isOpen) return null;

    return (
        <div
            ref={contentRef}
            data-slot="popover-content"
            data-state={isOpen ? "open" : "closed"}
            className={`
        bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100
        ${isOpen ? "animate-in fade-in-0" : "animate-out fade-out-0"}
        ${isOpen ? "zoom-in-95" : "zoom-out-95"}
        z-50 rounded-md border border-gray-200 dark:border-gray-700 p-4 shadow-md outline-none
        ${className}
      `}
            style={{
                position: "fixed",
                top: `${position.top}px`,
                left: `${position.left}px`,
                transformOrigin: "var(--radix-popover-content-transform-origin)",
            }}
            {...props}
        >
            {children}
        </div>
    );
};

const PopoverAnchor = ({ children, ...props }) => {
    return React.cloneElement(children, {
        "data-slot": "popover-anchor",
        ...props,
    });
};

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };