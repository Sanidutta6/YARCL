import React, { useState, useEffect, createContext, useContext } from "react";
import { Button } from "./Button";
import { X } from "lucide-react";

const DrawerContext = createContext();

const Drawer = ({ open, onOpenChange, children, direction = "right" }) => {
    const [isOpen, setIsOpen] = useState(open);

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
                            onClick: () => handleOpenChange(true),
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
            onClick,
        });
    }
    return (
        <Button onClick={onClick} data-slot="drawer-trigger">
            {children}
        </Button>
    );
};

const DrawerContent = ({ children }) => {
    const { isOpen, onClose, direction } = useContext(DrawerContext);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
            setIsClosing(false);
        }, 300);
    };

    const directionClasses = {
        right: "right-0 top-0 h-full w-full sm:w-3/4 sm:max-w-sm border-l",
        left: "left-0 top-0 h-full w-full sm:w-3/4 sm:max-w-sm border-r",
        top: "top-0 left-0 right-0 w-full max-h-[80vh] rounded-b-lg border-b",
        bottom: "bottom-0 left-0 right-0 w-full max-h-[80vh] rounded-t-lg border-t",
    };

    const animationClasses = {
        right: isClosing ? "animate-slide-out-right" : "animate-slide-in-right",
        left: isClosing ? "animate-slide-out-left" : "animate-slide-in-left",
        top: isClosing ? "animate-slide-out-top" : "animate-slide-in-top",
        bottom: isClosing ? "animate-slide-out-bottom" : "animate-slide-in-bottom",
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className={`fixed inset-0 bg-black/50 ${isClosing ? "animate-fade-out" : "animate-fade-in"
                    }`}
                onClick={handleClose}
            />
            <div
                className={`fixed bg-white flex flex-col ${directionClasses[direction]} ${animationClasses[direction]}`}
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
            onClick,
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
            className={`flex items-start justify-between gap-4 p-4 ${className}`}
        >
            <div className="flex-1 space-y-1.5">
                {children}
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
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
            className={`mt-auto flex flex-col gap-2 p-4 ${className}`}
        >
            {children}
        </div>
    );
};

const DrawerTitle = ({ className, children }) => {
    return (
        <h2 data-slot="drawer-title" className={`font-semibold ${className}`}>
            {children}
        </h2>
    );
};

const DrawerDescription = ({ className, children }) => {
    return (
        <p data-slot="drawer-description" className={`text-sm text-gray-500 ${className}`}>
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