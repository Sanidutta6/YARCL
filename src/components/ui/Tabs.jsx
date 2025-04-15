import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

// Create context for tabs
const TabsContext = React.createContext({
    activeTab: null,
    setActiveTab: () => { }
})

function Tabs({
    className,
    defaultValue,
    children,
    ...props
}) {
    const [activeTab, setActiveTab] = React.useState(defaultValue || null)

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div
                data-slot="tabs"
                className={cn("flex flex-col gap-2", className)}
                {...props}
            >
                {children}
            </div>
        </TabsContext.Provider>
    )
}

function TabsList({
    className,
    children,
    ...props
}) {
    return (
        <div
            data-slot="tabs-list"
            className={cn(
                "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

function TabsTrigger({
    className,
    value,
    children,
    ...props
}) {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    const isActive = value === activeTab

    return (
        <Button
            data-slot="tabs-trigger"
            className={cn(
                "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                isActive ? "bg-background shadow-sm dark:text-foreground dark:border-input dark:bg-input/30" : "text-foreground dark:text-muted-foreground",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring",
                className
            )}
            onClick={() => setActiveTab(value)}
            {...props}
        >
            {children}
        </Button>
    )
}

function TabsContent({
    className,
    value,
    children,
    ...props
}) {
    const { activeTab } = React.useContext(TabsContext)
    if (value !== activeTab) return null

    return (
        <div
            data-slot="tabs-content"
            className={cn("flex-1 outline-none", className)}
            {...props}
        >
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }