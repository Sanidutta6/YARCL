import * as React from "react"
import { cn } from "@/lib/utils"

const TooltipContext = React.createContext()

function TooltipProvider({ children, delayDuration = 0 }) {
    const [open, setOpen] = React.useState(false)
    const [timeoutId, setTimeoutId] = React.useState(null)

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

    return (
        <TooltipContext.Provider value={{ open, handleOpen, handleClose }}>
            <div data-slot="tooltip-provider" style={{ position: 'relative', display: 'inline-block' }}>
                {children}
            </div>
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

function TooltipTrigger({ children, ...props }) {
    const { handleOpen, handleClose } = React.useContext(TooltipContext)

    return React.cloneElement(React.Children.only(children), {
        'data-slot': 'tooltip-trigger',
        onMouseEnter: handleOpen,
        onMouseLeave: handleClose,
        onFocus: handleOpen,
        onBlur: handleClose,
        ...props
    })
}

function TooltipContent({ className, sideOffset = 0, children, ...props }) {
    const { open } = React.useContext(TooltipContext)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })
    const contentRef = React.useRef(null)
    const triggerRef = React.useRef(null)

    React.useEffect(() => {
        if (open && triggerRef.current && contentRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect()
            const contentRect = contentRef.current.getBoundingClientRect()

            let top, left

            // Default to bottom position
            top = triggerRect.bottom + window.scrollY + sideOffset
            left = triggerRect.left + window.scrollX + (triggerRect.width / 2) - (contentRect.width / 2)

            // Adjust if going off screen
            if (left + contentRect.width > window.innerWidth) {
                left = window.innerWidth - contentRect.width - 10
            }
            if (left < 0) {
                left = 10
            }
            if (top + contentRect.height > window.innerHeight + window.scrollY) {
                top = triggerRect.top + window.scrollY - contentRect.height - sideOffset
            }

            setPosition({ top, left })
        }
    }, [open, sideOffset])

    if (!open) return null

    return (
        <div
            ref={contentRef}
            data-slot="tooltip-content"
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 50,
            }}
            className={cn(
                "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 rounded-md px-3 py-1.5 text-xs text-balance",
                className
            )}
            {...props}
        >
            {children}
            <div
                className="bg-primary absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px]"
                style={{ transform: 'translateX(-50%) rotate(45deg)' }}
            />
        </div>
    )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }