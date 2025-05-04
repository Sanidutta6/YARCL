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
    const firstItemRef = React.useRef(null)

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

            // Focus management
            setTimeout(() => {
                firstItemRef.current?.focus()
            }, 100)
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
            firstItemRef,
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

DropdownTrigger.displayName = "DropdownTrigger"

function DropdownPortal({ children }) {
    const [mounted, setMounted] = React.useState(false)
    const portalRef = React.useRef(null)

    React.useEffect(() => {
        setMounted(true)

        // Create a dedicated portal container for proper z-index handling
        if (!portalRef.current) {
            const div = document.createElement('div')
            div.style.position = 'fixed'
            div.style.top = '0'
            div.style.left = '0'
            div.style.width = '100%'
            div.style.height = '100%'
            div.style.pointerEvents = 'none'
            div.style.zIndex = '9999' // Very high z-index to ensure visibility
            document.body.appendChild(div)
            portalRef.current = div
        }

        return () => {
            if (portalRef.current) {
                document.body.removeChild(portalRef.current)
                portalRef.current = null
            }
        }
    }, [])

    if (!mounted || !portalRef.current) return null

    return ReactDOM.createPortal(children, portalRef.current)
}

// Helper function to combine multiple refs
function useCombinedRefs(...refs) {
    const targetRef = React.useRef()

    React.useEffect(() => {
        refs.forEach(ref => {
            if (!ref) return

            if (typeof ref === 'function') {
                ref(targetRef.current)
            } else {
                ref.current = targetRef.current
            }
        })
    }, [refs])

    return targetRef
}

const DropdownContent = React.forwardRef(({ children, className, sideOffset = 4, alignOffset = 0, align = 'start', zIndex = 999, ...props }, ref) => {
    const { open, triggerRef, contentRef, setOpen } = React.useContext(DropdownContext)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const [ready, setReady] = React.useState(false)
    const ownRef = React.useRef(null)
    const combinedRef = useCombinedRefs(ref, contentRef, ownRef)

    const updatePosition = React.useCallback(() => {
        if (!open || !triggerRef.current || !combinedRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const contentRect = combinedRef.current.getBoundingClientRect()

        let top = triggerRect.bottom + window.scrollY + sideOffset
        let left = triggerRect.left + window.scrollX + alignOffset

        if (align === 'center') {
            left = left + (triggerRect.width - contentRect.width) / 2
        } else if (align === 'end') {
            left = left + triggerRect.width - contentRect.width
        }

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        if (left + contentRect.width > viewportWidth - 8) {
            left = Math.max(8, viewportWidth - contentRect.width - 8)
        }
        if (left < 8) left = 8

        if (top + contentRect.height > viewportHeight + window.scrollY - 8) {
            top = triggerRect.top + window.scrollY - contentRect.height - sideOffset
            if (top < window.scrollY + 8) {
                top = window.scrollY + 8
            }
        }

        setPosition({ top, left })
        setReady(true)
    }, [open, sideOffset, alignOffset, align, triggerRef])

    React.useEffect(() => {
        if (open) {
            setTimeout(updatePosition, 0)
            window.addEventListener('resize', updatePosition)
            return () => window.removeEventListener('resize', updatePosition)
        }
    }, [open, updatePosition])

    if (!open) return null

    return (
        <DropdownPortal>
            <div
                ref={combinedRef}
                role="menu"
                aria-orientation="vertical"
                className={cn(
                    "bg-popover text-popover-foreground rounded-md border shadow-lg",
                    "min-w-[8rem] overflow-auto max-h-[300px] p-1", // FIX: constrain height
                    "fixed origin-top-left pointer-events-auto",
                    ready ? "animate-in fade-in-0 zoom-in-95" : "opacity-0",
                    className
                )}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        e.preventDefault()
                        setOpen(false)
                        triggerRef.current?.focus()
                    }
                }}
                tabIndex={-1}
                {...props}
            >
                {children}
            </div>
        </DropdownPortal>
    )
})

DropdownContent.displayName = "DropdownContent"

const DropdownGroup = React.forwardRef(({ children, className, ...props }, ref) => {
    return (
        <div ref={ref} role="group" className={cn("bg-popover text-popover-foreground rounded-md border shadow-lg",
  "min-w-[8rem] max-w-[16rem] max-h-[20rem] overflow-auto",  
  "p-1 fixed origin-top-left pointer-events-auto",
  ready ? "animate-in fade-in-0 zoom-in-95" : "opacity-0", className)} {...props}>
            {children}
        </div>
    )
})

DropdownGroup.displayName = "DropdownGroup"

const DropdownItem = React.forwardRef(({ children, className, onSelect, disabled = false, ...props }, ref) => {
    const { setOpen, firstItemRef } = React.useContext(DropdownContext)
    const innerRef = React.useRef(null)
    const combinedRef = useCombinedRefs(ref, innerRef, firstItemRef)

    const handleClick = (e) => {
        if (disabled) return
        onSelect?.(e)
        setOpen(false)
    }

    return (
        <Button
            ref={combinedRef}
            variant="ghost"
            size="sm"
            role="menuitem"
            tabIndex={disabled ? -1 : 0}
            className={cn(
                "w-full justify-start font-normal",
                disabled && "opacity-50 pointer-events-none",
                className
            )}
            onClick={handleClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </Button>
    )
})

DropdownItem.displayName = "DropdownItem"

const DropdownCheckboxItem = React.forwardRef(({ children, checked, onCheckedChange, className, disabled = false, ...props }, ref) => {
    return (
        <DropdownItem
            ref={ref}
            role="menuitemcheckbox"
            aria-checked={checked}
            className={cn("flex justify-between", className)}
            onClick={() => !disabled && onCheckedChange(!checked)}
            disabled={disabled}
            {...props}
        >
            <span className="flex items-center gap-2">
                {checked && <Check className="size-4" />}
                {children}
            </span>
        </DropdownItem>
    )
})

DropdownCheckboxItem.displayName = "DropdownCheckboxItem"

const DropdownRadioGroup = React.forwardRef(({ children, className, ...props }, ref) => {
    return (
        <div ref={ref} role="group" className={cn("space-y-1 p-1", className)} {...props}>
            {children}
        </div>
    )
})

DropdownRadioGroup.displayName = "DropdownRadioGroup"

const DropdownRadioItem = React.forwardRef(({ children, value, checked, onValueChange, className, disabled = false, ...props }, ref) => {
    return (
        <DropdownItem
            ref={ref}
            role="menuitemradio"
            aria-checked={checked}
            className={cn("flex justify-between", className)}
            onClick={() => !disabled && onValueChange(value)}
            disabled={disabled}
            {...props}
        >
            <span className="flex items-center gap-2">
                {checked && <Circle className="size-4 fill-current" />}
                {children}
            </span>
        </DropdownItem>
    )
})

DropdownRadioItem.displayName = "DropdownRadioItem"

const DropdownLabel = React.forwardRef(({ children, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("px-2 py-1.5 text-sm font-semibold", className)}
            {...props}
        >
            {children}
        </div>
    )
})

DropdownLabel.displayName = "DropdownLabel"

const DropdownSeparator = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            role="separator"
            className={cn("-mx-1 my-1 h-px bg-border", className)}
            {...props}
        />
    )
})

DropdownSeparator.displayName = "DropdownSeparator"

function DropdownSubMenu({ children }) {
    const [subOpen, setSubOpen] = React.useState(false)
    const triggerRef = React.useRef(null)
    const contentRef = React.useRef(null)
    const firstItemRef = React.useRef(null)
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

    React.useEffect(() => {
        if (subOpen) {
            // Focus first item when submenu opens
            setTimeout(() => {
                firstItemRef.current?.focus()
            }, 100)
        }
    }, [subOpen])

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
                        triggerRef,
                        firstItemRef
                    })
                }
                return child
            })}
        </div>
    )
}

const DropdownSubTrigger = React.forwardRef(({ children, isSubOpen, setIsSubOpen, className, ...props }, ref) => {
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault()
            setIsSubOpen(true)
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            setIsSubOpen(false)
        }
    }

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="sm"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={isSubOpen}
            className={cn(
                "w-full justify-between font-normal",
                className
            )}
            onClick={(e) => {
                e.stopPropagation()
                setIsSubOpen(!isSubOpen)
            }}
            onKeyDown={handleKeyDown}
            {...props}
        >
            {children}
            <ChevronRight className="ml-2 size-4" />
        </Button>
    )
})

DropdownSubTrigger.displayName = "DropdownSubTrigger"

const DropdownSubContent = React.forwardRef(({ children, isSubOpen, triggerRef, firstItemRef, className, zIndex = 1000, ...props }, ref) => {
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const [ready, setReady] = React.useState(false)
    const ownRef = React.useRef(null)
    const combinedRef = useCombinedRefs(ref, ownRef)

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault()
            triggerRef.current?.focus()
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()

            const menuItems = Array.from(
                combinedRef.current?.querySelectorAll('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]') || []
            )

            if (!menuItems.length) return

            const currentIndex = menuItems.findIndex(item => item === document.activeElement)

            let nextIndex
            if (e.key === 'ArrowDown') {
                nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0
            } else {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1
            }

            menuItems[nextIndex]?.focus()
        }
    }

    const updatePosition = React.useCallback(() => {
        if (!isSubOpen || !triggerRef.current || !combinedRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const contentRect = combinedRef.current.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Position to the right of the trigger by default
        let left = triggerRect.right + window.scrollX + 4
        let top = triggerRect.top + window.scrollY

        // Ensure submenu stays within viewport
        // If right edge would be outside viewport, position to the left
        if (left + contentRect.width > viewportWidth - 8) {
            left = triggerRect.left + window.scrollX - contentRect.width - 4
        }

        // If left edge would be outside viewport, position it at the left edge with some padding
        if (left < 8) {
            left = 8
        }

        // If bottom edge would be outside viewport, adjust top position
        if (top + contentRect.height > viewportHeight + window.scrollY - 8) {
            // Try to keep it within viewport from the bottom
            top = viewportHeight + window.scrollY - contentRect.height - 8
        }

        // If top would be outside viewport, position at top with padding
        if (top < window.scrollY + 8) {
            top = window.scrollY + 8
        }

        setPosition({ top, left })
        setReady(true)
    }, [isSubOpen, triggerRef])

    React.useEffect(() => {
        if (isSubOpen) {
            // Initial position calculation
            setTimeout(updatePosition, 0)

            // Recalculate on resize
            window.addEventListener('resize', updatePosition)
            return () => window.removeEventListener('resize', updatePosition)
        }
    }, [isSubOpen, updatePosition])

    if (!isSubOpen) return null

    return (
        <DropdownPortal>
            <div
                ref={combinedRef}
                role="menu"
                aria-orientation="vertical"
                className={cn(
                    "bg-popover text-popover-foreground rounded-md border shadow-lg",
                    "min-w-[8rem] overflow-hidden p-1",
                    "fixed origin-top-left pointer-events-auto",
                    ready ? "animate-in fade-in-0 zoom-in-95" : "opacity-0",
                    className
                )}
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex
                }}
                onKeyDown={handleKeyDown}
                tabIndex={-1}
                {...props}
            >
                {React.Children.map(children, (child, index) => {
                    if (index === 0 && React.isValidElement(child) &&
                        (child.type === DropdownItem ||
                            child.type === DropdownCheckboxItem ||
                            child.type === DropdownRadioItem)) {
                        return React.cloneElement(child, { ref: firstItemRef })
                    }
                    return child
                })}
            </div>
        </DropdownPortal>
    )
})

DropdownSubContent.displayName = "DropdownSubContent"

const DropdownArrow = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45",
                "bg-popover shadow-[0_0_0_1px_rgba(0,0,0,0.1)] border-l border-t",
                className
            )}
            {...props}
        />
    )
})

DropdownArrow.displayName = "DropdownArrow"

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