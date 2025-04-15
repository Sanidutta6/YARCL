import * as React from "react"
import { cn } from "@/lib/utils"
import { usePopoverPosition } from "@/hooks/usePopoverPosition"

const TooltipContext = React.createContext({
    open: false,
    handleOpen: () => { },
    handleClose: () => { },
    triggerRef: null
})

function TooltipProvider({ children, delayDuration = 0 }) {
    const [open, setOpen] = React.useState(false)
    const [timeoutId, setTimeoutId] = React.useState(null)
    const triggerRef = React.useRef(null)

    const handleOpen = () => {
        if (delayDuration > 0) {
            const id = setTimeout(() => setOpen(true), delayDuration)
            setTimeoutId(id)
        } else {
            setOpen(true)
        }
    }

    const handleClose = () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
            setTimeoutId(null)
        }
        setOpen(false)
    }

    const value = React.useMemo(() => ({
        open,
        handleOpen,
        handleClose,
        triggerRef
    }), [open, timeoutId])

    return (
        <TooltipContext.Provider value={value}>
            {children}
        </TooltipContext.Provider>
    )
}

function Tooltip({ children }) {
    return (
        <TooltipProvider>
            {children}
        </TooltipProvider>
    )
}

function TooltipTrigger({ children, asChild = false, ...props }) {
    const { handleOpen, handleClose, triggerRef } = React.useContext(TooltipContext)

    if (asChild) {
        return React.cloneElement(React.Children.only(children), {
            ref: triggerRef,
            onMouseEnter: handleOpen,
            onMouseLeave: handleClose,
            onFocus: handleOpen,
            onBlur: handleClose,
            ...props
        })
    }

    return (
        <span
            ref={triggerRef}
            className="inline-block"
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
            onFocus={handleOpen}
            onBlur={handleClose}
            {...props}
        >
            {children}
        </span>
    )
}

function TooltipContent({
    className,
    placement = "bottom",
    align = "center",
    offset = 4,
    children,
    ...props
}) {
    const { open, triggerRef } = React.useContext(TooltipContext)
    const contentRef = React.useRef(null)

    // Initialize position state to avoid initial render flicker
    const [hasPosition, setHasPosition] = React.useState(false)

    // Use the position data from the hook
    const position = usePopoverPosition({
        triggerRef,
        contentRef,
        open,
        placement,
        align,
        offset,
        flip: true,
        avoid: true,
        onPositionChange: () => !hasPosition && setHasPosition(true)
    })

    if (!open) return null

    // Arrow positioning based on actual placement
    const getArrowClass = () => {
        switch (position.placement) {
            case 'top':
                return 'bottom-[-3px] left-1/2 -translate-x-1/2 rotate-45'
            case 'bottom':
                return 'top-[-3px] left-1/2 -translate-x-1/2 rotate-45'
            case 'left':
                return 'right-[-3px] top-1/2 -translate-y-1/2 rotate-45'
            case 'right':
                return 'left-[-3px] top-1/2 -translate-y-1/2 rotate-45'
            default:
                return 'top-[-3px] left-1/2 -translate-x-1/2 rotate-45'
        }
    }

    return (
        <div
            ref={contentRef}
            role="tooltip"
            className={cn(
                "fixed z-50",
                hasPosition ? "opacity-100" : "opacity-0",
                "bg-gray-900 text-gray-50",
                "animate-in fade-in-0 zoom-in-95",
                "rounded-md px-3 py-1.5 text-xs",
                "shadow-md",
                className
            )}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: position.width ? `${position.width}px` : undefined,
                maxHeight: position.maxHeight ? `${position.maxHeight}px` : undefined,
            }}
            {...props}
        >
            {children}
            <div className={cn(
                "absolute h-2 w-2 bg-gray-900",
                getArrowClass()
            )} />
        </div>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }