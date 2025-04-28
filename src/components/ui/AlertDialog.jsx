import * as React from "react"
import { Button } from "./Button"
import { X, AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { createPortal } from "react-dom"

// Context
const AlertDialogContext = React.createContext(null)

// Main Component
const AlertDialog = ({
    open: controlledOpen,
    onOpenChange,
    children,
    defaultOpen = false,
}) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = (value) => {
        if (!isControlled) setInternalOpen(value)
        onOpenChange?.(value)
    }

    const variant = React.useMemo(() => {
        const contentChild = React.Children.toArray(children).find(
            (child) => React.isValidElement(child) && child.type === AlertDialogContent
        )

        return contentChild?.props.variant || "default"
    }, [children])

    return (
        <AlertDialogContext.Provider value={{ open, setOpen, variant }}>
            {children}
        </AlertDialogContext.Provider>
    )
}

// Trigger Component
const AlertDialogTrigger = React.forwardRef(
    ({ children, asChild, ...props }, ref) => {
        const context = React.useContext(AlertDialogContext)
        if (!context) throw new Error("AlertDialogTrigger must be used within AlertDialog")

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children, {
                onClick: () => context.setOpen(true),
                ...props,
                ref,
            })
        }

        return (
            <Button
                ref={ref}
                onClick={() => context.setOpen(true)}
                {...props}
            >
                {children}
            </Button>
        )
    }
)

// Content Component
const AlertDialogContent = React.forwardRef(
    ({ children, className = "", variant = "default", ...props }, ref) => {
        const context = React.useContext(AlertDialogContext)
        if (!context) throw new Error("AlertDialogContent must be used within AlertDialog")

        if (!context.open) return null

        const variantStyles = {
            default: {
                border: "border-border",
                icon: <Info className="h-5 w-5 text-foreground" />,
            },
            success: {
                border: "border-success/30",
                icon: <CheckCircle className="h-5 w-5 text-success" />,
            },
            warning: {
                border: "border-warning/30",
                icon: <AlertTriangle className="h-5 w-5 text-warning" />,
            },
            error: {
                border: "border-destructive/30",
                icon: <AlertCircle className="h-5 w-5 text-destructive" />,
            },
            info: {
                border: "border-info/30",
                icon: <Info className="h-5 w-5 text-info" />,
            },
        }

        const content = (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <div
                    ref={ref}
                    className={`relative max-w-lg rounded-lg bg-background p-6 shadow-lg ${variantStyles[variant].border} ${className}`}
                    {...props}
                >
                    <button
                        className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                        onClick={() => context.setOpen(false)}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                            {variantStyles[variant].icon}
                        </div>
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        )

        return createPortal(content, document.body)
    }
)

// Header Component
const AlertDialogHeader = ({ children, className = "" }) => (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
        {children}
    </div>
)

// Title Component
const AlertDialogTitle = ({ children, className = "" }) => (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
)

// Description Component
const AlertDialogDescription = ({ children, className = "" }) => (
    <p className={`text-sm text-muted-foreground ${className}`}>
        {children}
    </p>
)

// Footer Component
const AlertDialogFooter = ({ children, className = "" }) => (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4 ${className}`}>
        {children}
    </div>
)

// Action Component
const AlertDialogAction = React.forwardRef(
    ({ className = "", ...props }, ref) => {
        const context = React.useContext(AlertDialogContext)
        if (!context) throw new Error("AlertDialogAction must be used within AlertDialog")

        return (
            <Button
                ref={ref}
                className={className}
                onClick={() => {
                    props.onClick?.()
                    context.setOpen(false)
                }}
                {...props}
            />
        )
    }
)

const AlertDialogCancel = React.forwardRef(
    ({ className = "", ...props }, ref) => {
        const context = React.useContext(AlertDialogContext)
        if (!context) throw new Error("AlertDialogAction must be used within AlertDialog")

        return (
            <Button
                ref={ref}
                className={className}
                onClick={() => {
                    props.onClick?.()
                    context.setOpen(false)
                }}
                {...props}
            />
        )
    }
)

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
}