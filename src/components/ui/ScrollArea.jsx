import React, { useState, useRef } from 'react';

const ScrollArea = React.forwardRef(({ children, className = '', ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
});

const ScrollAreaViewport = React.forwardRef(({ children, className = '', ...props }, ref) => {
    const viewportRef = useRef(null);
    const contentRef = useRef(null);
    const composedRefs = (node) => {
        viewportRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
          .scroll-area-viewport {
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
          }
          .scroll-area-viewport::-webkit-scrollbar {
            display: none;
          }
        `
            }} />
            <div
                ref={composedRefs}
                className={`scroll-area-viewport w-full h-full overflow-auto ${className}`}
                {...props}
            >
                <div ref={contentRef} className="min-w-full inline-block">
                    {children}
                </div>
            </div>
        </>
    );
});

const ScrollAreaScrollbar = React.forwardRef(({
    orientation = 'vertical',
    className = '',
    children,
    ...props
}, ref) => {
    const [visible, setVisible] = useState(false);
    const scrollbarRef = useRef(null);
    const composedRefs = (node) => {
        scrollbarRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

    const baseClasses = `flex touch-none select-none transition-colors`;
    const orientationClasses = orientation === 'vertical'
        ? 'w-2.5 h-full'
        : 'h-2.5 w-full';
    const hoverClasses = visible ? 'bg-gray-300' : 'bg-transparent';

    return (
        <div
            ref={composedRefs}
            className={`${baseClasses} ${orientationClasses} ${hoverClasses} ${className}`}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            {...props}
        >
            {children}
        </div>
    );
});

const ScrollAreaThumb = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`flex-1 bg-gray-500 rounded-full relative ${className}`}
            {...props}
        />
    );
});

const ScrollAreaCorner = React.forwardRef(({ className = '', ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={`bg-gray-300 ${className}`}
            {...props}
        />
    );
});

export {
    ScrollArea,
    ScrollAreaViewport,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaCorner
};