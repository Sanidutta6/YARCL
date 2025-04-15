import * as React from "react";
import { cn } from "@/lib/utils";

const AvatarContext = React.createContext({
    status: "loading" // 'loading' | 'loaded' | 'error'
});

function Avatar({ className, children, ...props }) {
    const [status, setStatus] = React.useState("loading");

    return (
        <AvatarContext.Provider value={{ status, setStatus }}>
            <div
                className={cn(
                    "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </AvatarContext.Provider>
    );
}

function AvatarImage({ className, src, alt, ...props }) {
    const { setStatus } = React.useContext(AvatarContext);

    return (
        <img
            className={cn(
                "aspect-square h-full w-full object-cover",
                className
            )}
            src={src}
            alt={alt}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            {...props}
        />
    );
}

function AvatarFallback({ className, children, ...props }) {
    const { status } = React.useContext(AvatarContext);

    if (status === "loaded") return null;

    return (
        <div
            className={cn(
                "flex h-full w-full items-center justify-center rounded-full bg-gray-100",
                className
            )}
            {...props}
        >
            <span className="text-sm font-medium text-gray-600">
                {children}
            </span>
        </div>
    );
}

export { Avatar, AvatarImage, AvatarFallback };