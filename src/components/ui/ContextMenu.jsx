import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Root component
const ContextMenu = ({ children, onOpenChange, modal = true }) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleOpenChange = (isOpen, event) => {
        setOpen(isOpen);
        if (event) setPosition({ x: event.clientX, y: event.clientY });
        if (onOpenChange) onOpenChange(isOpen);
    };

    return (
        <>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        open,
                        position,
                        onOpenChange: handleOpenChange,
                        modal
                    });
                }
                return child;
            })}
        </>
    );
};

// Trigger component
const ContextMenuTrigger = React.forwardRef(({
    children,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    const handleContextMenu = (e) => {
        if (disabled) return;
        e.preventDefault();
        props.onOpenChange(true, e);
    };

    return (
        <div
            ref={ref}
            className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-context-menu'}`}
            onContextMenu={handleContextMenu}
            style={{ WebkitTouchCallout: 'none' }}
            {...props}
        >
            {children}
        </div>
    );
});

// Portal component (optional)
const ContextMenuPortal = ({ children, container }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;
    return ReactDOM.createPortal(children, container || document.body);
};

// Content component
const ContextMenuContent = React.forwardRef(({
    children,
    className = '',
    align = 'start',
    sideOffset = 5,
    ...props
}, ref) => {
    const contentRef = useRef(null);
    const composedRefs = (node) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contentRef.current && !contentRef.current.contains(e.target)) {
                props.onOpenChange(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!props.open) return null;

    // Calculate position
    const style = {
        position: 'fixed',
        left: props.position.x,
        top: props.position.y + sideOffset,
        zIndex: 9999
    };

    return (
        <div
            ref={composedRefs}
            className={`min-w-[220px] bg-white rounded-md shadow-lg p-1 border border-gray-200 ${className}`}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
});

// Group component
const ContextMenuGroup = React.forwardRef(({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`flex flex-col ${className}`} {...props}>
        {children}
    </div>
));

// Label component
const ContextMenuLabel = React.forwardRef(({ children, className = '', ...props }, ref) => (
    <div
        ref={ref}
        className={`px-2 py-1.5 text-xs font-semibold text-gray-500 ${className}`}
        {...props}
    >
        {children}
    </div>
));

// Item component
const ContextMenuItem = React.forwardRef(({
    children,
    className = '',
    disabled = false,
    ...props
}, ref) => (
    <button
        ref={ref}
        disabled={disabled}
        className={`relative flex items-center px-2 py-1.5 text-sm rounded outline-none w-full text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
            } ${className}`}
        {...props}
    >
        {children}
    </button>
));

// Checkbox Item component
const ContextMenuCheckboxItem = React.forwardRef(({
    children,
    checked = false,
    className = '',
    ...props
}, ref) => (
    <ContextMenuItem
        ref={ref}
        className={`${className} justify-between`}
        {...props}
    >
        <span>{children}</span>
        <span>{checked ? '✓' : ''}</span>
    </ContextMenuItem>
));

// Radio components
const ContextMenuRadioGroup = React.forwardRef(({
    children,
    value,
    onValueChange,
    className = '',
    ...props
}, ref) => {
    return (
        <div ref={ref} className={className} {...props}>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        checked: child.props.value === value,
                        onSelect: () => onValueChange(child.props.value)
                    });
                }
                return child;
            })}
        </div>
    );
});

const ContextMenuRadioItem = React.forwardRef(({
    children,
    value,
    checked = false,
    onSelect,
    className = '',
    ...props
}, ref) => (
    <ContextMenuItem
        ref={ref}
        onClick={onSelect}
        className={`${className} justify-between`}
        {...props}
    >
        <span>{children}</span>
        <span>{checked ? '●' : '○'}</span>
    </ContextMenuItem>
));

// Item Indicator (for check/radio states)
const ContextMenuItemIndicator = React.forwardRef(({
    children,
    className = '',
    ...props
}, ref) => (
    <span ref={ref} className={`inline-flex items-center ${className}`} {...props}>
        {children}
    </span>
));

// Separator component
const ContextMenuSeparator = React.forwardRef(({ className = '', ...props }, ref) => (
    <div
        ref={ref}
        className={`h-px my-1 bg-gray-200 ${className}`}
        {...props}
    />
));

// Arrow component
const ContextMenuArrow = React.forwardRef(({ className = '', ...props }, ref) => (
    <div
        ref={ref}
        className={`w-2 h-2 bg-white border-t border-l border-gray-200 rotate-45 absolute ${className}`}
        {...props}
    />
));

// Submenu components
const ContextMenuSub = ({ children, open: openProp, defaultOpen = false, onOpenChange }) => {
    const [open, setOpen] = useState(defaultOpen);

    useEffect(() => {
        if (openProp !== undefined) {
            setOpen(openProp);
        }
    }, [openProp]);

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (onOpenChange) onOpenChange(isOpen);
    };

    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                open,
                onOpenChange: handleOpenChange
            });
        }
        return child;
    });
};

const ContextMenuSubTrigger = React.forwardRef(({
    children,
    className = '',
    ...props
}, ref) => (
    <ContextMenuItem
        ref={ref}
        className={`${className} justify-between`}
        onMouseEnter={() => props.onOpenChange(true)}
        {...props}
    >
        {children}
        <span>→</span>
    </ContextMenuItem>
));

const ContextMenuSubContent = React.forwardRef(({
    children,
    className = '',
    ...props
}, ref) => {
    if (!props.open) return null;

    return (
        <div
            ref={ref}
            className={`absolute left-full top-0 ml-1 min-w-[220px] bg-white rounded-md shadow-lg p-1 border border-gray-200 z-50 ${className}`}
            onMouseLeave={() => props.onOpenChange(false)}
            {...props}
        >
            {children}
        </div>
    );
});

export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuPortal,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuLabel,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuItemIndicator,
    ContextMenuSeparator,
    ContextMenuArrow,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent
};