import * as React from "react"
import { XIcon } from "lucide-react"
import ReactDOM from "react-dom"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext()

function Dialog({ children, open: controlledOpen, onOpenChange, defaultOpen = false, ...props }) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : isOpen

    const setOpen = (value) => {
        if (!isControlled) setIsOpen(value)
        onOpenChange?.(value)
    }

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            <div data-slot="dialog" {...props}>
                {React.Children.map(children, child => {
                    if (child.type === DialogTrigger) {
                        return React.cloneElement(child, { setOpen })
                    }
                    return child
                })}
            </div>
        </DialogContext.Provider>
    )
}

function DialogTrigger({ children, setOpen, ...props }) {
    return React.cloneElement(React.Children.only(children), {
        'data-slot': 'dialog-trigger',
        onClick: () => setOpen(true),
        ...props
    })
}

function DialogPortal({ children }) {
    return typeof document !== 'undefined'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

function DialogOverlay({ className, ...props }) {
    const { open, setOpen } = React.useContext(DialogContext)

    if (!open) return null

    return (
        <div
            data-slot="dialog-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/50 animate-in fade-in-0",
                className
            )}
            onClick={() => setOpen(false)}
            {...props}
        />
    )
}

function DialogContent({ className, children, ...props }) {
    const { open } = React.useContext(DialogContext)

    if (!open) return null

    return (
        <DialogPortal>
            <DialogOverlay />
            <div
                data-slot="dialog-content"
                className={cn(
                    "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
                    "animate-in fade-in-0 zoom-in-95",
                    className
                )}
                {...props}
            >
                {children}
                <DialogClose
                    className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <XIcon className="size-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </div>
        </DialogPortal>
    )
}

function DialogClose({ children, className, ...props }) {
    const { setOpen } = React.useContext(DialogContext)

    return (
        <button
            data-slot="dialog-close"
            className={cn(
                "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                className
            )}
            onClick={() => setOpen(false)}
            {...props}
        >
            {children || <XIcon className="size-4" />}
        </button>
    )
}

function DialogHeader({ className, ...props }) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    )
}

function DialogFooter({ className, ...props }) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
            {...props}
        />
    )
}

function DialogTitle({ className, ...props }) {
    return (
        <h2
            data-slot="dialog-title"
            className={cn("text-lg leading-none font-semibold", className)}
            {...props}
        />
    )
}

function DialogDescription({ className, ...props }) {
    return (
        <p
            data-slot="dialog-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    )
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
}