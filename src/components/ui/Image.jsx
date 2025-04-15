import * as React from "react";
import { cn } from "@/lib/utils";

const ImageContext = React.createContext({
    status: "loading", // 'loading' | 'loaded' | 'error'
    setStatus: () => { }
});

function ImageRoot({
    className,
    children,
    loading = "eager",
    ...props
}) {
    const [status, setStatus] = React.useState(loading === "lazy" ? "idle" : "loading");

    return (
        <ImageContext.Provider value={{ status, setStatus }}>
            <div
                className={cn(
                    "relative overflow-hidden",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </ImageContext.Provider>
    );
}

function Img({
    src,
    srcSet,
    sizes,
    alt = "",
    className,
    loading = "eager",
    decoding = "async",
    fetchPriority = "auto",
    onLoad,
    onError,
    ...props
}) {
    const { setStatus } = React.useContext(ImageContext);
    const [isIntersecting, setIsIntersecting] = React.useState(loading !== "lazy");
    const imgRef = React.useRef(null);

    // Intersection Observer for lazy loading
    React.useEffect(() => {
        if (loading !== "lazy" || !imgRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: "200px" }
        );

        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [loading]);

    const handleLoad = (e) => {
        setStatus("loaded");
        onLoad?.(e);
    };

    const handleError = (e) => {
        setStatus("error");
        onError?.(e);
    };

    return (
        <img
            ref={imgRef}
            src={isIntersecting ? src : undefined}
            srcSet={isIntersecting ? srcSet : undefined}
            sizes={sizes}
            alt={alt}
            className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                className,
                status === "loaded" ? "opacity-100" : "opacity-0"
            )}
            loading={loading}
            decoding={decoding}
            fetchPriority={fetchPriority}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
        />
    );
}

function ImageFallback({
    className,
    children,
    showOn = ["loading", "error"], // Array of statuses when to show
    ...props
}) {
    const { status } = React.useContext(ImageContext);

    if (!showOn.includes(status)) return null;

    return (
        <div
            className={cn(
                "absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800",
                className
            )}
            {...props}
        >
            {children || (
                <div className="flex items-center justify-center w-full h-full">
                    <svg
                        className="w-1/2 h-1/2 text-gray-400 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}

function ImageSkeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse",
                className
            )}
            {...props}
        />
    );
}

export const Image = Object.assign(ImageRoot, {
    Img,
    Fallback: ImageFallback,
    Skeleton: ImageSkeleton
});