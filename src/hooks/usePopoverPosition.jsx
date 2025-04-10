import { useState, useEffect, useCallback } from 'react';

/**
 * A hook that calculates positioning for popover/dropdown components
 * 
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.triggerRef - Ref to the trigger element
 * @param {React.RefObject} options.contentRef - Ref to the content element
 * @param {boolean} options.open - Whether the popover is open
 * @param {string} options.placement - Preferred placement ('top', 'bottom', 'left', 'right')
 * @param {string} options.align - Alignment ('start', 'center', 'end')
 * @param {number} options.offset - Space between trigger and content
 * @param {boolean} options.matchWidth - Whether content should match trigger width
 * @param {boolean} options.flip - Whether to flip placement if no space
 * @param {boolean} options.avoid - Whether to avoid screen edges
 * @param {Function} options.onPositionChange - Callback when position changes
 * @returns {Object} Position and size data for the popover
 */
export function usePopoverPosition({
    triggerRef,
    contentRef,
    open = false,
    placement = 'bottom',
    align = 'start',
    offset = 4,
    matchWidth = false,
    flip = true,
    avoid = true,
    onPositionChange = () => { }
}) {
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: undefined,
        maxHeight: undefined,
        placement
    });

    // Calculate initial position based on trigger element
    const calculatePosition = useCallback(() => {
        if (!open || !triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current?.getBoundingClientRect();

        // Set viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Default values if content isn't yet measurable
        const contentWidth = contentRect?.width || 0;
        const contentHeight = contentRect?.height || 0;

        // Calculate max height based on available space
        let maxHeight;
        if (placement === 'bottom') {
            maxHeight = viewportHeight - triggerRect.bottom - offset - 10;
        } else if (placement === 'top') {
            maxHeight = triggerRect.top - offset - 10;
        } else {
            maxHeight = viewportHeight - 20;
        }

        // Base position calculation
        let top = 0;
        let left = 0;
        let actualPlacement = placement;

        // Calculate position based on placement preference
        switch (placement) {
            case 'top':
                top = triggerRect.top - contentHeight - offset;
                break;
            case 'bottom':
                top = triggerRect.bottom + offset;
                break;
            case 'left':
                left = triggerRect.left - contentWidth - offset;
                break;
            case 'right':
                left = triggerRect.right + offset;
                break;
            default:
                top = triggerRect.bottom + offset;
                actualPlacement = 'bottom';
        }

        // Horizontal alignment for top/bottom placement
        if (placement === 'top' || placement === 'bottom') {
            switch (align) {
                case 'start':
                    left = triggerRect.left;
                    break;
                case 'center':
                    left = triggerRect.left + (triggerRect.width / 2) - (matchWidth ? triggerRect.width / 2 : contentWidth / 2);
                    break;
                case 'end':
                    left = triggerRect.right - (matchWidth ? triggerRect.width : contentWidth);
                    break;
                default:
                    left = triggerRect.left;
            }
        }
        // Vertical alignment for left/right placement
        else if (placement === 'left' || placement === 'right') {
            switch (align) {
                case 'start':
                    top = triggerRect.top;
                    break;
                case 'center':
                    top = triggerRect.top + (triggerRect.height / 2) - (contentHeight / 2);
                    break;
                case 'end':
                    top = triggerRect.bottom - contentHeight;
                    break;
                default:
                    top = triggerRect.top;
            }
        }

        // Add scroll position to make position absolute to the document
        top += window.scrollY;
        left += window.scrollX;

        // Handle flip if necessary
        if (flip && contentRect) {
            // Flip vertically if needed
            if (placement === 'bottom' && top + contentHeight > window.innerHeight + window.scrollY) {
                top = triggerRect.top + window.scrollY - contentHeight - offset;
                actualPlacement = 'top';
            } else if (placement === 'top' && top < window.scrollY) {
                top = triggerRect.bottom + window.scrollY + offset;
                actualPlacement = 'bottom';
            }

            // Flip horizontally if needed
            if (placement === 'right' && left + contentWidth > viewportWidth + window.scrollX) {
                left = triggerRect.left + window.scrollX - contentWidth - offset;
                actualPlacement = 'left';
            } else if (placement === 'left' && left < window.scrollX) {
                left = triggerRect.right + window.scrollX + offset;
                actualPlacement = 'right';
            }
        }

        // Avoid screen edges
        if (avoid && contentRect) {
            // Avoid right edge
            if (left + contentWidth > viewportWidth + window.scrollX - 10) {
                left = viewportWidth + window.scrollX - contentWidth - 10;
            }

            // Avoid left edge
            if (left < window.scrollX + 10) {
                left = window.scrollX + 10;
            }

            // Avoid bottom edge
            if (top + contentHeight > viewportHeight + window.scrollY - 10) {
                // If not enough space above, just constrain the height
                if (triggerRect.top - window.scrollY < contentHeight + offset) {
                    maxHeight = viewportHeight - (top - window.scrollY) - 10;
                } else {
                    // Otherwise flip to top
                    top = triggerRect.top + window.scrollY - contentHeight - offset;
                    actualPlacement = 'top';
                }
            }

            // Avoid top edge
            if (top < window.scrollY + 10) {
                top = window.scrollY + 10;
            }
        }

        // Calculate width based on preference
        const width = matchWidth ? triggerRect.width : undefined;

        const newPosition = {
            top,
            left,
            width,
            maxHeight,
            placement: actualPlacement
        };

        setPosition(newPosition);
        onPositionChange(newPosition);

    }, [
        open,
        triggerRef,
        contentRef,
        placement,
        align,
        offset,
        matchWidth,
        flip,
        avoid,
        onPositionChange
    ]);

    // Update position when required values change
    useEffect(() => {
        calculatePosition();
    }, [calculatePosition]);

    // Set up event listeners for responsive updates
    useEffect(() => {
        if (!open) return;

        const handleUpdate = () => {
            calculatePosition();
        };

        window.addEventListener('resize', handleUpdate);
        window.addEventListener('scroll', handleUpdate, true);

        // Initial calculation after mount
        const timeoutId = setTimeout(handleUpdate, 10);

        return () => {
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate, true);
            clearTimeout(timeoutId);
        };
    }, [open, calculatePosition]);

    return position;
}