import * as React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePopoverPosition } from '@/hooks/usePopoverPosition';

const SelectContext = React.createContext();

function Select({ children, value, onValueChange, defaultValue, open: controlledOpen, onOpenChange, defaultOpen = false, disabled }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
    const triggerRef = React.useRef(null);
    const contentRef = React.useRef(null);
    const [displayValue, setDisplayValue] = React.useState('');

    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const setOpen = onOpenChange || setUncontrolledOpen;
    const selectedValue = value !== undefined ? value : uncontrolledValue;
    const setValue = onValueChange || setUncontrolledValue;

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, setOpen]);

    return (
        <SelectContext.Provider value={{
            open,
            setOpen,
            value: selectedValue,
            setValue,
            displayValue,
            setDisplayValue,
            triggerRef,
            contentRef,
            disabled
        }}>
            <div className="relative inline-block w-full">
                {React.Children.map(children, child => {
                    if (child && child.type === SelectTrigger) {
                        return React.cloneElement(child, { ref: triggerRef });
                    }
                    return child;
                })}
            </div>
        </SelectContext.Provider>
    );
}

const SelectTrigger = React.forwardRef(({ children, className, asChild, ...props }, ref) => {
    const { open, setOpen, displayValue, disabled } = React.useContext(SelectContext);

    const handleKeyDown = (e) => {
        if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
            e.preventDefault();
            setOpen(!open);
        }
    };

    const handleClick = (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!disabled) {
            setOpen(!open);
        }
        // Call the original onClick if provided
        props.onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ref,
            'aria-expanded': open,
            type: "button", // Ensure it's a button type
            onClick: (e) => {
                e.preventDefault();
                children.props.onClick?.(e);
                setOpen(!open);
            },
            onKeyDown: (e) => {
                children.props.onKeyDown?.(e);
                handleKeyDown(e);
            },
            ...props
        });
    }

    return (
        <Button
            ref={ref}
            variant="outline"
            role="combobox"
            type="button" // Always set button type to prevent form submission
            aria-expanded={open}
            disabled={disabled}
            className={cn("w-full justify-between", className)}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            {...props}
        >
            <span className="truncate">{displayValue || children}</span>
            <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50", open && "rotate-180")} />
        </Button>
    );
});

function SelectValue({ placeholder, className, ...props }) {
    const { displayValue } = React.useContext(SelectContext);
    const selectedValue = displayValue || placeholder;

    return (
        <span className={cn("text-sm text-muted-foreground", className)} {...props}>
            {selectedValue}
        </span>
    );
}

function SelectPortal({ children }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return ReactDOM.createPortal(children, document.body);
}

function SelectContent({
    children,
    className,
    position = 'popper',
    align = 'start',
    sideOffset = 4,
    ...props
}) {
    const { open, triggerRef, contentRef, setOpen } = React.useContext(SelectContext);

    // Use our custom hook for positioning
    const popoverPosition = usePopoverPosition({
        triggerRef,
        contentRef,
        open,
        placement: 'bottom',
        align,
        offset: sideOffset,
        matchWidth: true,
        flip: true,
        avoid: true
    });

    if (!open) return null;

    return (
        <SelectPortal>
            <div
                ref={contentRef}
                className={cn(
                    "bg-popover text-popover-foreground z-50 min-w-[8rem] overflow-hidden rounded-md border shadow-md",
                    "animate-in fade-in-80",
                    position === 'popper' && "translate-y-1",
                    className
                )}
                style={{
                    position: 'fixed',
                    top: `${popoverPosition.top}px`,
                    left: `${popoverPosition.left}px`,
                    width: popoverPosition.width ? `${popoverPosition.width}px` : undefined,
                    maxHeight: popoverPosition.maxHeight ? `${popoverPosition.maxHeight}px` : undefined
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault();
                        setOpen(false);
                        triggerRef.current?.focus();
                    }
                }}
                {...props}
            >
                <div className={cn("max-h-[var(--radix-select-content-available-height)]")}>
                    {children}
                </div>
            </div>
        </SelectPortal>
    );
}

function SelectViewport({ children, className, ...props }) {
    return (
        <div
            className={cn("max-h-[300px] overflow-y-auto p-1", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function SelectGroup({ children, className, ...props }) {
    return (
        <div className={cn("p-1", className)} {...props}>
            {children}
        </div>
    );
}

function SelectLabel({ children, className, ...props }) {
    return (
        <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props}>
            {children}
        </div>
    );
}

function SelectItem({ children, className, value, disabled = false, ...props }) {
    const { value: selectedValue, setValue, setOpen, setDisplayValue } = React.useContext(SelectContext);
    const isSelected = selectedValue === value;

    return (
        <Button
            variant="ghost"
            role="option"
            type="button" // Prevent form submission
            aria-selected={isSelected}
            disabled={disabled}
            className={cn(
                "relative w-full justify-start pl-8 pr-2 text-sm font-normal",
                isSelected && "bg-accent text-accent-foreground",
                className
            )}
            onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                setValue(value);
                setDisplayValue(children); // Store the display text when item is selected
                setOpen(false);
            }}
            {...props}
        >
            {isSelected && (
                <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                    <Check className="h-4 w-4" />
                </span>
            )}
            {children}
        </Button>
    );
}

function SelectSeparator({ className, ...props }) {
    return (
        <div className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
    );
}

export {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectViewport,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectSeparator,
};