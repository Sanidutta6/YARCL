import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext()

function Select({ children, value, onValueChange, placeholder, ...props }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value)
    const triggerRef = React.useRef(null)
    const contentRef = React.useRef(null)

    const handleValueChange = (value) => {
        setSelectedValue(value)
        onValueChange?.(value)
        setIsOpen(false)
    }

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <SelectContext.Provider value={{
            isOpen,
            setIsOpen,
            selectedValue,
            handleValueChange,
            triggerRef,
            contentRef,
            placeholder
        }}>
            <div data-slot="select" className="relative w-full" {...props}>
                {React.Children.map(children, child => {
                    if (child.type === SelectTrigger) {
                        return React.cloneElement(child, { ref: triggerRef })
                    }
                    return child
                })}
            </div>
        </SelectContext.Provider>
    )
}

function SelectGroup({ children, ...props }) {
    return (
        <div data-slot="select-group" {...props}>
            {children}
        </div>
    )
}

function SelectValue({ children, ...props }) {
    const { selectedValue, placeholder } = React.useContext(SelectContext)
    return (
        <span data-slot="select-value" className="line-clamp-1 flex items-center gap-2" {...props}>
            {children || selectedValue || placeholder}
        </span>
    )
}

const SelectTrigger = React.forwardRef(({ className, size = "default", children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext)

    return (
        <button
            ref={ref}
            type="button"
            data-slot="select-trigger"
            data-size={size}
            className={cn(
                "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20",
                "dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30",
                "dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border",
                "bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow]",
                "outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
                "data-[size=default]:h-9 data-[size=sm]:h-8",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            onClick={(e) => {
                e.preventDefault()
                setIsOpen(!isOpen)
            }}
            {...props}
        >
            {children}
            <ChevronDownIcon className={`size-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
    )
})

function SelectContent({ className, children, position = "popper", ...props }) {
    const { isOpen, setIsOpen, triggerRef, contentRef } = React.useContext(SelectContext)
    const [contentStyle, setContentStyle] = React.useState({})

    React.useEffect(() => {
        if (isOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            setContentStyle({
                minWidth: `${triggerRect.width}px`,
                position: 'absolute',
                top: `${triggerRect.bottom + window.scrollY + 4}px`,
                left: `${triggerRect.left + window.scrollX}px`,
                zIndex: 50
            })
        }
    }, [isOpen, triggerRef])

    if (!isOpen) return null

    return (
        <div
            ref={contentRef}
            data-slot="select-content"
            className={cn(
                "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95",
                "overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
                className
            )}
            style={contentStyle}
            {...props}
        >
            <SelectScrollUpButton />
            <div className="p-1 max-h-64 overflow-y-auto">
                {children}
            </div>
            <SelectScrollDownButton />
        </div>
    )
}

function SelectLabel({ className, ...props }) {
    return (
        <div data-slot="select-label" className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)} {...props} />
    )
}

function SelectItem({ className, children, value, ...props }) {
    const { selectedValue, handleValueChange } = React.useContext(SelectContext)

    return (
        <div
            data-slot="select-item"
            className={cn(
                "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground",
                "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm",
                "outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            onClick={(e) => {
                e.preventDefault()
                handleValueChange(value)
            }}
            {...props}
        >
            {selectedValue === value && (
                <span className="absolute right-2 flex size-3.5 items-center justify-center">
                    <CheckIcon className="size-4" />
                </span>
            )}
            {children}
        </div>
    )
}

function SelectSeparator({ className, ...props }) {
    return (
        <div data-slot="select-separator" className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)} {...props} />
    )
}

function SelectScrollUpButton({ className, ...props }) {
    return (
        <div data-slot="select-scroll-up-button" className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
            <ChevronUpIcon className="size-4" />
        </div>
    )
}

function SelectScrollDownButton({ className, ...props }) {
    return (
        <div data-slot="select-scroll-down-button" className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
            <ChevronDownIcon className="size-4" />
        </div>
    )
}

export {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectScrollDownButton,
    SelectScrollUpButton,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
}