import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
    className,
    checked,
    onChange,
    disabled,
    "aria-invalid": ariaInvalid,
    ...props
}) {
    return (
        <label className="inline-flex items-center">
            <input
                type="checkbox"
                className={cn(
                    "peer border-input dark:bg-input/30 checked:bg-primary checked:text-primary-foreground dark:checked:bg-primary checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                    className
                )}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                aria-invalid={ariaInvalid}
                {...props}
            />
            <span className="absolute size-4 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 text-current transition-none">
                <CheckIcon className="size-3.5" />
            </span>
        </label>
    );
}

export { Checkbox };