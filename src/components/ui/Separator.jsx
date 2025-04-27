import React from 'react';
import { cn } from '@/lib/utils';

const ORIENTATIONS = ['horizontal', 'vertical'];
const DEFAULT_ORIENTATION = 'horizontal';

function isValidOrientation(orientation) {
    return ORIENTATIONS.includes(orientation);
}

const Separator = React.forwardRef((props, forwardedRef) => {
    const {
        decorative,
        orientation: orientationProp = DEFAULT_ORIENTATION,
        className,
        ...domProps
    } = props;

    const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
    const ariaOrientation = orientation === 'vertical' ? orientation : undefined;
    const semanticProps = decorative
        ? { role: 'none' }
        : { 'aria-orientation': ariaOrientation, role: 'separator' };

    return (
        <div
            data-orientation={orientation}
            className={cn(
                "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
                className
            )}
            {...semanticProps}
            {...domProps}
            ref={forwardedRef}
        />
    );
});

Separator.displayName = 'Separator';

export { Separator };