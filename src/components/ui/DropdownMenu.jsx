import * as React from "react"
import ReactDOM from "react-dom"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ChevronRight, Check, Circle } from "lucide-react"

const DropdownContext = React.createContext()

export function DropdownMenu({ children, open: controlledOpen, onOpenChange, defaultOpen = false, modal = true }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
    const triggerRef = React.useRef(null)
    const contentRef = React.useRef(null)

    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const setOpen = onOpenChange || setUncontrolledOpen

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (contentRef.current && !contentRef.current.contains(event.target) &&
                triggerRef.current && !triggerRef.current.contains(event.target)) {
                setOpen(false)
            }
        }

        const handleScroll = () => {
            if (open) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
            window.addEventListener('scroll', handleScroll, true)
            if (modal) document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll, true)
            if (modal) document.body.style.overflow = ''
        }
    }, [open, modal, setOpen])

    return (
        <DropdownContext.Provider value={{
            open,
            setOpen,
            triggerRef,
            contentRef,
            modal
        }}>
            <div className="relative inline-block text-left">
                {React.Children.map(children, child => {
                    if (child && child.type === DropdownTrigger) {
                        return React.cloneElement(child, { ref: triggerRef })
                    }
                    return child
                })}
            </div>
        </DropdownContext.Provider>
    )
}

const DropdownTrigger = React.forwardRef(({ children, asChild, variant = "outline", size = "default", ...props }, ref) => {
    const { setOpen, open } = React.useContext(DropdownContext)

    const handleKeyDown = (e) => {
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault()
            setOpen(!open)
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
        }
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ref,
            'aria-haspopup': 'menu',
            'aria-expanded': open,
            onClick: (e) => {
                children.props.onClick?.(e)
                setOpen(!open)
            },
            onKeyDown: (e) => {
                children.props.onKeyDown?.(e)
                handleKeyDown(e)
            },
            ...props
        })
    }

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {children}
        </Button>
    )
})

function DropdownPortal({ children }) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return ReactDOM.createPortal(children, document.body)
}

function DropdownContent({ children, className, sideOffset = 4, alignOffset = 0, align = 'start', ...props }) {
    const { open, triggerRef, contentRef, setOpen } = React.useContext(DropdownContext)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    React.useEffect(() => {
        if (open && triggerRef.current && contentRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const contentRect = contentRef.current.getBoundingClientRect()

            // Calculate initial position
            let top = triggerRect.bottom + window.scrollY + sideOffset
            let left = triggerRect.left + window.scrollX + alignOffset

            // Adjust for alignment
            if (align === 'center') {
                left = left + (triggerRect.width - contentRect.width) / 2
            } else if (align === 'end') {
                left = left + triggerRect.width - contentRect.width
            }

            // Check boundaries
            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            // Adjust for right overflow
            if (left + contentRect.width > viewportWidth) {
                left = viewportWidth - contentRect.width - 8
            }

            // Adjust for left overflow
            if (left < 0) left = 8

            // Adjust for bottom overflow
            if (top + contentRect.height > viewportHeight + window.scrollY) {
                top = triggerRect.top + window.scrollY - contentRect.height - sideOffset
            }

            setPosition({ top, left })
        }
    }, [open, sideOffset, alignOffset, align])

    if (!open) return null

    return (
        <DropdownPortal>
            <div
                ref={contentRef}
                className={cn(
                    "bg-popover text-popover-foreground rounded-md border shadow-lg",
                    "z-50 min-w-[8rem] overflow-hidden p-1",
                    "fixed origin-top-left animate-in fade-in-0 zoom-in-95",
                    className
                )}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault()
                        setOpen(false)
                        triggerRef.current?.focus()
                    }
                }}
                {...props}
            >
                {children}
            </div>
        </DropdownPortal>
    )
}

function DropdownGroup({ children, className, ...props }) {
    return (
        <div className={cn("space-y-1 p-1", className)} {...props}>
            {children}
        </div>
    )
}

function DropdownItem({ children, className, onSelect, ...props }) {
    const { setOpen } = React.useContext(DropdownContext)

    const handleClick = (e) => {
        onSelect?.(e)
        setOpen(false)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "w-full justify-start font-normal",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    )
}

function DropdownCheckboxItem({ children, checked, onCheckedChange, className, ...props }) {
    return (
        <DropdownItem
            className={cn("flex justify-between", className)}
            onClick={() => onCheckedChange(!checked)}
            {...props}
        >
            <span className="flex items-center gap-2">
                {checked && <Check className="size-4" />}
                {children}
            </span>
        </DropdownItem>
    )
}

function DropdownRadioGroup({ children, className, ...props }) {
    return (
        <div className={cn("space-y-1 p-1", className)} {...props}>
            {children}
        </div>
    )
}

function DropdownRadioItem({ children, value, checked, onValueChange, className, ...props }) {
    return (
        <DropdownItem
            className={cn("flex justify-between", className)}
            onClick={() => onValueChange(value)}
            {...props}
        >
            <span className="flex items-center gap-2">
                {checked && <Circle className="size-4 fill-current" />}
                {children}
            </span>
        </DropdownItem>
    )
}

function DropdownLabel({ children, className, ...props }) {
    return (
        <div
            className={cn("px-2 py-1.5 text-sm font-semibold", className)}
            {...props}
        >
            {children}
        </div>
    )
}

function DropdownSeparator({ className, ...props }) {
    return (
        <div
            className={cn("-mx-1 my-1 h-px bg-border", className)}
            {...props}
        />
    )
}

function DropdownSubMenu({ children }) {
    const [subOpen, setSubOpen] = React.useState(false)
    const triggerRef = React.useRef(null)
    const contentRef = React.useRef(null)
    const hoverTimeoutRef = React.useRef(null)

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = setTimeout(() => setSubOpen(true), 200)
    }

    const handleMouseLeave = () => {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = setTimeout(() => setSubOpen(false), 200)
    }

    React.useEffect(() => {
        return () => clearTimeout(hoverTimeoutRef.current)
    }, [])

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {React.Children.map(children, child => {
                if (child && child.type === DropdownSubTrigger) {
                    return React.cloneElement(child, {
                        ref: triggerRef,
                        isSubOpen: subOpen,
                        setIsSubOpen: setSubOpen
                    })
                }
                if (child && child.type === DropdownSubContent) {
                    return React.cloneElement(child, {
                        ref: contentRef,
                        isSubOpen: subOpen,
                        triggerRef
                    })
                }
                return child
            })}
        </div>
    )
}

const DropdownSubTrigger = React.forwardRef(({ children, isSubOpen, setIsSubOpen, className, ...props }, ref) => {
    return (
        <Button
            ref={ref}
            variant="ghost"
            size="sm"
            className={cn(
                "w-full justify-between font-normal",
                className
            )}
            onClick={(e) => {
                e.stopPropagation()
                setIsSubOpen(!isSubOpen)
            }}
            {...props}
        >
            {children}
            <ChevronRight className="ml-2 size-4" />
        </Button>
    )
})

const DropdownSubContent = React.forwardRef(({ children, isSubOpen, triggerRef, className, ...props }, ref) => {
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    React.useEffect(() => {
        if (isSubOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()

            // Position to the right of the trigger
            let left = triggerRect.right + window.scrollX + 4
            let top = triggerRect.top + window.scrollY

            // Check if it would overflow to the right
            if (left + 200 > window.innerWidth) {
                left = triggerRect.left + window.scrollX - 200 - 4
            }

            // Check if it would overflow to the bottom
            if (top + 300 > window.innerHeight + window.scrollY) {
                top = window.innerHeight + window.scrollY - 300 - 8
            }

            setPosition({ top, left })
        }
    }, [isSubOpen, triggerRef])

    if (!isSubOpen) return null

    return (
        <DropdownPortal>
            <div
                ref={ref}
                className={cn(
                    "bg-popover text-popover-foreground rounded-md border shadow-lg",
                    "z-50 min-w-[8rem] overflow-hidden p-1",
                    "fixed origin-top-left animate-in fade-in-0 zoom-in-95",
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
        </DropdownPortal>
    )
})

function DropdownArrow({ className, ...props }) {
    return (
        <div
            className={cn(
                "absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45",
                "bg-popover shadow-[0_0_0_1px_rgba(0,0,0,0.1)] border-l border-t",
                className
            )}
            {...props}
        />
    )
}

export const Dropdown = {
    Menu: DropdownMenu,
    Trigger: DropdownTrigger,
    Portal: DropdownPortal,
    Content: DropdownContent,
    Group: DropdownGroup,
    Item: DropdownItem,
    CheckboxItem: DropdownCheckboxItem,
    RadioGroup: DropdownRadioGroup,
    RadioItem: DropdownRadioItem,
    Label: DropdownLabel,
    Separator: DropdownSeparator,
    SubMenu: DropdownSubMenu,
    SubTrigger: DropdownSubTrigger,
    SubContent: DropdownSubContent,
    Arrow: DropdownArrow
}