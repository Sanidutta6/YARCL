import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { Button } from "./Button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DrawerContext = createContext({
    isOpen: false,
    onClose: () => { },
    direction: "right"
});

const Drawer = ({ open = false, onOpenChange, children, direction = "right" }) => {
    const [isOpen, setIsOpen] = useState(open);

    // Use effect to sync with parent's open state
    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    const handleOpenChange = (newOpen) => {
        setIsOpen(newOpen);
        if (onOpenChange) onOpenChange(newOpen);
    };

    const closeDrawer = () => handleOpenChange(false);

    return (
        <DrawerContext.Provider value={{ isOpen, onClose: closeDrawer, direction }}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    if (child.type === DrawerTrigger) {
                        return React.cloneElement(child, {
                            onClick: (e) => {
                                // Prevent event bubbling issues
                                e.preventDefault();
                                // Open the drawer
                                handleOpenChange(true);
                                // Call original onClick if provided
                                if (child.props.onClick) child.props.onClick(e);
                            },
                        });
                    }
                    return child;
                }
                return child;
            })}
        </DrawerContext.Provider>
    );
};

const DrawerTrigger = ({ asChild, onClick, children }) => {
    if (asChild) {
        return React.cloneElement(React.Children.only(children), {
            onClick: (e) => {
                if (onClick) onClick(e);
            },
        });
    }
    return (
        <Button onClick={onClick} data-slot="drawer-trigger">
            {children}
        </Button>
    );
};

const DrawerContent = ({ children, className }) => {
    const { isOpen, onClose, direction } = useContext(DrawerContext);
    const [isClosing, setIsClosing] = useState(false);
    const timeoutRef = useRef(null);
    const contentRef = useRef(null);

    // Handle escape key for accessibility
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape" && isOpen) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
            // Lock scroll when drawer is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscKey);
            document.body.style.overflow = "";

            // Clear any lingering timeouts on unmount
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isOpen]);

    // Focus trap inside drawer
    useEffect(() => {
        if (isOpen && contentRef.current) {
            const focusableElements = contentRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);

        // Clear any existing timeout first
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout for closing animation
        timeoutRef.current = setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300); // Match this timing with your CSS transitions
    };

    // Position classes based on direction
    const positionClasses = {
        right: "right-0 top-0 h-full w-full sm:w-3/4 sm:max-w-sm border-l",
        left: "left-0 top-0 h-full w-full sm:w-3/4 sm:max-w-sm border-r",
        top: "top-0 left-0 right-0 w-full max-h-[80vh] rounded-b-lg border-b",
        bottom: "bottom-0 left-0 right-0 w-full max-h-[80vh] rounded-t-lg border-t"
    };

    // Animation classes using the predefined animations
    const animationClasses = {
        right: isClosing ? "animate-slide-out-right" : "animate-slide-in-right",
        left: isClosing ? "animate-slide-out-left" : "animate-slide-in-left",
        top: isClosing ? "animate-slide-out-top" : "animate-slide-in-top",
        bottom: isClosing ? "animate-slide-out-bottom" : "animate-slide-in-bottom"
    };

    // Don't render anything if closed and not in closing state
    if (!isOpen && !isClosing) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop with fade animation */}
            <div
                className={`fixed inset-0 bg-black/80 ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Drawer content with proper animation */}
            <div
                ref={contentRef}
                className={cn(
                    "fixed bg-white flex flex-col",
                    positionClasses[direction],
                    animationClasses[direction],
                    className
                )}
                role="dialog"
                aria-modal="true"
            >
                {direction === "bottom" && (
                    <div className="bg-gray-200 mx-auto mt-4 h-2 w-[100px] rounded-full" />
                )}
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child) && child.type === DrawerClose) {
                        return React.cloneElement(child, { onClick: handleClose });
                    }
                    return child;
                })}
            </div>
        </div>
    );
};

const DrawerClose = ({ asChild, onClick, children }) => {
    if (asChild) {
        return React.cloneElement(React.Children.only(children), {
            onClick: (e) => {
                if (onClick) onClick(e);
            },
        });
    }
    return (
        <Button onClick={onClick} data-slot="drawer-close">
            {children}
        </Button>
    );
};

const DrawerHeader = ({ className, children }) => {
    const { onClose } = useContext(DrawerContext);

    return (
        <div
            data-slot="drawer-header"
            className={cn("flex items-start justify-between gap-4 p-4", className)}
        >
            <div className="flex-1 space-y-1.5">{children}</div>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
                aria-label="Close drawer"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
        </div>
    );
};

const DrawerFooter = ({ className, children }) => {
    return (
        <div
            data-slot="drawer-footer"
            className={cn("mt-auto flex flex-col gap-2 p-4", className)}
        >
            {children}
        </div>
    );
};

const DrawerTitle = ({ className, children }) => {
    return (
        <h2 data-slot="drawer-title" className={cn("font-semibold", className)}>
            {children}
        </h2>
    );
};

const DrawerDescription = ({ className, children }) => {
    return (
        <p data-slot="drawer-description" className={cn("text-sm text-gray-500", className)}>
            {children}
        </p>
    );
};

export {
    Drawer,
    DrawerTrigger,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
};