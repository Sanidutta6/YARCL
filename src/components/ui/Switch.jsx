import * as React from "react"
import { cn } from "@/lib/utils"

function Switch({
    className,
    checked,
    onChange,
    disabled,
    ...props
}) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                {...props}
            />
            <div
                data-slot="switch"
                className={cn(
                    "peer-checked:bg-primary peer-checked:border-primary bg-input dark:bg-input/80",
                    "relative inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs",
                    "transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
            >
                <div
                    data-slot="switch-thumb"
                    className={cn(
                        "bg-background dark:peer-checked:bg-primary-foreground dark:peer-not-checked:bg-foreground",
                        "absolute block size-4 rounded-full ring-0 transition-transform",
                        "peer-checked:translate-x-[calc(100%-2px)] peer-not-checked:translate-x-0"
                    )}
                />
            </div>
        </label>
    )
}

export { Switch }