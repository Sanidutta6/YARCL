import * as React from "react"
import { XIcon } from "lucide-react"
import ReactDOM from "react-dom"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

const SheetContext = React.createContext()

function Sheet({ children, ...props }) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <SheetContext.Provider value={{ isOpen, setIsOpen }}>
            <div data-slot="sheet" {...props}>
                {children}
            </div>
        </SheetContext.Provider>
    )
}

function SheetTrigger({ children, ...props }) {
    const { setIsOpen } = React.useContext(SheetContext)

    return (
        <Button
            data-slot="sheet-trigger"
            onClick={() => setIsOpen(true)}
            {...props}
        >
            {children}
        </Button>
    )
}

function SheetClose({ children, ...props }) {
    const { setIsOpen } = React.useContext(SheetContext)

    return (
        <Button
            data-slot="sheet-close"
            onClick={() => setIsOpen(false)}
            {...props}
        >
            {children}
        </Button>
    )
}

function SheetPortal({ children }) {
    return typeof document !== 'undefined'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

function SheetOverlay({ className, ...props }) {
    const { isOpen, setIsOpen } = React.useContext(SheetContext)

    if (!isOpen) return null

    return (
        <div
            data-slot="sheet-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/50 animate-in fade-in-0",
                className
            )}
            onClick={() => setIsOpen(false)}
            {...props}
        />
    )
}

function SheetContent({
    className,
    children,
    side = "right",
    ...props
}) {
    const { isOpen } = React.useContext(SheetContext)

    if (!isOpen) return null

    const positionClasses = {
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm animate-in slide-in-from-right",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm animate-in slide-in-from-left",
        top: "inset-x-0 top-0 h-auto border-b animate-in slide-in-from-top",
        bottom: "inset-x-0 bottom-0 h-auto border-t animate-in slide-in-from-bottom"
    }

    return (
        <SheetPortal>
            <SheetOverlay />
            <div
                data-slot="sheet-content"
                className={cn(
                    "bg-background fixed z-50 flex flex-col gap-4 shadow-lg",
                    positionClasses[side],
                    className
                )}
                {...props}
            >
                {children}
                <SheetClose
                    className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <XIcon className="size-4" />
                    <span className="sr-only">Close</span>
                </SheetClose>
            </div>
        </SheetPortal>
    )
}

function SheetHeader({ className, ...props }) {
    return (
        <div
            data-slot="sheet-header"
            className={cn("flex flex-col gap-1.5 p-4", className)}
            {...props}
        />
    )
}

function SheetFooter({ className, ...props }) {
    return (
        <div
            data-slot="sheet-footer"
            className={cn("mt-auto flex flex-col gap-2 p-4", className)}
            {...props}
        />
    )
}

function SheetTitle({ className, ...props }) {
    return (
        <h3
            data-slot="sheet-title"
            className={cn("text-foreground font-semibold", className)}
            {...props}
        />
    )
}

function SheetDescription({ className, ...props }) {
    return (
        <p
            data-slot="sheet-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription
}