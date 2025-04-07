import * as React from "react"
import { cn } from "@/lib/utils"
import ReactDOM from "react-dom"
import { Button } from "@/components/ui/Button"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

const DropdownContext = React.createContext()

function DropdownMenu({ children, value, onValueChange, ...props }) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedValue, setSelectedValue] = React.useState(value)
    const triggerRef = React.useRef(null)
    const contentRef = React.useRef(null)

    const handleValueChange = (newValue) => {
        setSelectedValue(newValue)
        onValueChange?.(newValue)
        setIsOpen(false)
    }

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        const handleScroll = () => {
            if (isOpen) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            window.addEventListener('scroll', handleScroll, true)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll, true)
            document.body.style.overflow = ''
        }
    }, [isOpen])

    return (
        <DropdownContext.Provider value={{
            isOpen,
            setIsOpen,
            triggerRef,
            contentRef,
            selectedValue,
            handleValueChange
        }}>
            <div data-slot="dropdown-menu" className="relative" {...props}>
                {React.Children.map(children, child => {
                    if (child && child.type === DropdownMenuTrigger) {
                        return React.cloneElement(child, { ref: triggerRef })
                    }
                    return child
                })}
            </div>
        </DropdownContext.Provider>
    )
}

const DropdownMenuTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
    const { setIsOpen } = React.useContext(DropdownContext)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ref: ref,
            onClick: (e) => {
                children.props.onClick?.(e)
                setIsOpen(prev => !prev)
            },
            "data-slot": "dropdown-menu-trigger",
            ...props
        })
    }

    return (
        <Button
            ref={ref}
            data-slot="dropdown-menu-trigger"
            onClick={() => setIsOpen(prev => !prev)}
            {...props}
        >
            {children}
        </Button>
    )
})

function DropdownMenuPortal({ children }) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return ReactDOM.createPortal(children, document.body)
}

function DropdownMenuContent({ className, sideOffset = 4, children, ...props }) {
    const { isOpen, triggerRef, contentRef } = React.useContext(DropdownContext)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    React.useEffect(() => {
        if (isOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const contentHeight = contentRef.current?.getBoundingClientRect()?.height || 0

            let top = triggerRect.bottom + window.scrollY + sideOffset
            let left = triggerRect.left + window.scrollX

            // Adjust position if it would go off screen
            if (top + contentHeight > window.innerHeight + window.scrollY) {
                top = triggerRect.top + window.scrollY - contentHeight - sideOffset
            }
            if (left < 0) left = 0

            setPosition({ top, left })
        }
    }, [isOpen, sideOffset])

    if (!isOpen) return null

    return (
        <DropdownMenuPortal>
            <div
                ref={contentRef}
                data-slot="dropdown-menu-content"
                className={cn(
                    "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95",
                    "z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md",
                    "fixed max-h-[var(--radix-dropdown-menu-content-available-height)]",
                    className
                )}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
                {...props}
            >
                {children}
            </div>
        </DropdownMenuPortal>
    )
}

function DropdownMenuGroup({ children, ...props }) {
    return (
        <div data-slot="dropdown-menu-group" {...props}>
            {children}
        </div>
    )
}

function DropdownMenuItem({ className, inset, variant = "default", value, children, ...props }) {
    const { handleValueChange, setIsOpen } = React.useContext(DropdownContext)

    const handleClick = () => {
        if (value) {
            handleValueChange(value)
        } else {
            // Close the dropdown even if no value is provided
            setIsOpen(false)
        }
    }

    return (
        <Button
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            variant="ghost"
            className={`w-full ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    )
}

function DropdownMenuCheckboxItem({ className, children, checked, value, ...props }) {
    const { handleValueChange } = React.useContext(DropdownContext)

    return (
        <Button
            data-slot="dropdown-menu-checkbox-item"
            variant="ghost"
            className={className}
            onClick={() => value && handleValueChange(value)}
            {...props}
        >
            {checked && (
                <span className="absolute left-2 flex size-3.5 items-center justify-center">
                    <CheckIcon className="size-4" />
                </span>
            )}
            {children}
        </Button>
    )
}

function DropdownMenuRadioGroup({ children, ...props }) {
    return (
        <div data-slot="dropdown-menu-radio-group" {...props}>
            {children}
        </div>
    )
}

function DropdownMenuRadioItem({ className, children, checked, value, ...props }) {
    const { handleValueChange } = React.useContext(DropdownContext)

    return (
        <Button
            data-slot="dropdown-menu-radio-item"
            variant="ghost"
            className={className}
            onClick={() => value && handleValueChange(value)}
            {...props}
        >
            {checked && (
                <span className="absolute left-2 flex size-3.5 items-center justify-center">
                    <CircleIcon className="size-2 fill-current" />
                </span>
            )}
            {children}
        </Button>
    )
}

function DropdownMenuLabel({ className, inset, ...props }) {
    return (
        <div
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
            {...props}
        />
    )
}

function DropdownMenuSeparator({ className, ...props }) {
    return (
        <div
            data-slot="dropdown-menu-separator"
            className={cn("bg-border -mx-1 my-1 h-px", className)}
            {...props}
        />
    )
}

function DropdownMenuShortcut({ className, ...props }) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
            {...props}
        />
    )
}

const DropdownMenuSub = ({ children }) => {
    const [isSubOpen, setIsSubOpen] = React.useState(false)
    const subTriggerRef = React.useRef(null)
    const subContentRef = React.useRef(null)

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (subContentRef.current && !subContentRef.current.contains(event.target) &&
                subTriggerRef.current && !subTriggerRef.current.contains(event.target)) {
                setIsSubOpen(false)
            }
        }

        if (isSubOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isSubOpen])

    return (
        <div className="relative">
            {React.Children.map(children, child => {
                if (child && child.type === DropdownMenuSubTrigger) {
                    return React.cloneElement(child, {
                        isSubOpen,
                        setIsSubOpen,
                        ref: subTriggerRef
                    })
                }
                if (child && child.type === DropdownMenuSubContent) {
                    return React.cloneElement(child, {
                        isSubOpen,
                        subTriggerRef,
                        ref: subContentRef
                    })
                }
                return child
            })}
        </div>
    )
}

const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, isSubOpen, setIsSubOpen, ...props }, ref) => {
    return (
        <Button
            ref={ref}
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            variant="ghost"
            className={className}
            onClick={(e) => {
                e.stopPropagation();
                setIsSubOpen(!isSubOpen);
            }}
            onMouseEnter={() => setIsSubOpen(true)}
            {...props}
        >
            {children}
            <ChevronRightIcon className="ml-auto size-4" />
        </Button>
    )
})

const DropdownMenuSubContent = React.forwardRef(({ className, isSubOpen, subTriggerRef, ...props }, ref) => {
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    React.useEffect(() => {
        if (isSubOpen && subTriggerRef.current) {
            const triggerRect = subTriggerRef.current.getBoundingClientRect()

            // Calculate position
            let top = triggerRect.top + window.scrollY
            let left = triggerRect.right + window.scrollX + 4

            // Check if submenu would go off-screen to the right
            if (left + 200 > window.innerWidth) { // Assuming menu width is around 200px
                left = triggerRect.left + window.scrollX - 200 - 4
            }

            setPosition({
                top: top,
                left: left
            })
        }
    }, [isSubOpen, subTriggerRef])

    if (!isSubOpen) return null

    return (
        <DropdownMenuPortal>
            <div
                ref={ref}
                data-slot="dropdown-menu-sub-content"
                className={cn(
                    "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95",
                    "z-50 min-w-[8rem] origin-top-left overflow-hidden rounded-md border p-1 shadow-lg",
                    "fixed",
                    className
                )}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
                {...props}
            />
        </DropdownMenuPortal>
    )
})

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
}