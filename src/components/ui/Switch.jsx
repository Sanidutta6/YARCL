import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function Switch({
  className,
  checked,
  onChange,
  disabled,
  ...props
}) {
  const [localChecked, setLocalChecked] = useState(false);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : localChecked;

  const handleChange = (e) => {
    if (!isControlled) {
      setLocalChecked(e.target.checked);
    }
    onChange?.(e); // Call onChange if provided
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={currentChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <div
        className={cn(
          "relative inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs",
          "transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          currentChecked ? "peer-checked:bg-primary peer-checked:border-primary" : "bg-input dark:bg-input/80",
          className
        )}
      >
        <div
          className={cn(
            "absolute bg-background dark:bg-primary-foreground",
            "block size-4 rounded-full ring-0 transition-transform",
            currentChecked ? "translate-x-[calc(100%-1px)]" : "translate-x-0"
          )}
        />
      </div>
    </label>
  );
}

export { Switch };
