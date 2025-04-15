import * as React from 'react';
import ReactDOM from 'react-dom';

/**
 * Portal component that renders children into a different part of the DOM
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to portal
 * @param {HTMLElement|DocumentFragment} [props.container] - Target container (defaults to document.body)
 * @param {string} [props.className] - Tailwind classes for the portal wrapper
 * @param {React.Ref} ref - Forwarded ref
 */
const Portal = React.forwardRef((props, ref) => {
    const {
        children,
        container: containerProp,
        className = '',
        ...restProps
    } = props;

    const [mounted, setMounted] = React.useState(false);

    // Use layout effect to ensure we only try to portal after mount
    React.useLayoutEffect(() => {
        setMounted(true);
    }, []);

    // Determine container (default to document.body if mounted)
    const container = containerProp || (mounted && globalThis?.document?.body);

    if (!container) return null;

    return ReactDOM.createPortal(
        <div
            {...restProps}
            ref={ref}
            className={className}
        >
            {children}
        </div>,
        container
    );
});

Portal.displayName = 'Portal';

// Alias for Portal
const Root = Portal;

export { Portal, Root };