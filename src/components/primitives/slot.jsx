import * as React from 'react';

// Utility function to compose multiple refs
function composeRefs(...refs) {
    return (node) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref != null) {
                ref.current = node;
            }
        });
    };
}

// Slottable identifier
const SLOTTABLE_IDENTIFIER = Symbol('slottable');

// Slottable component
export function Slottable({ children }) {
    return React.Children.only(children);
}
Slottable.__yarclId = SLOTTABLE_IDENTIFIER;

// Check if a component is Slottable
function isSlottable(child) {
    return (
        React.isValidElement(child) &&
        typeof child.type === 'function' &&
        child.type.__yarclId === SLOTTABLE_IDENTIFIER
    );
}

// Merge props from slot and child components
function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };

    for (const propName in childProps) {
        const slotPropValue = slotProps[propName];
        const childPropValue = childProps[propName];

        const isHandler = /^on[A-Z]/.test(propName);
        if (isHandler) {
            if (slotPropValue && childPropValue) {
                overrideProps[propName] = (...args) => {
                    childPropValue(...args);
                    slotPropValue(...args);
                };
            } else if (slotPropValue) {
                overrideProps[propName] = slotPropValue;
            }
        } else if (propName === 'style') {
            overrideProps[propName] = { ...slotPropValue, ...childPropValue };
        } else if (propName === 'className') {
            overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
        }
    }

    return { ...slotProps, ...overrideProps };
}

// Get element ref safely
function getElementRef(element) {
    return element.ref || (element.props && element.props.ref);
}

// SlotClone component
function SlotClone({ children, ...props }, forwardedRef) {
    if (React.isValidElement(children)) {
        const childrenRef = getElementRef(children);
        const mergedProps = mergeProps(props, children.props);

        if (children.type !== React.Fragment) {
            mergedProps.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
        }

        return React.cloneElement(children, mergedProps);
    }

    return React.Children.count(children) > 1 ? React.Children.only(null) : null;
}

// Main Slot component
export const Slot = React.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = React.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);

    if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
            if (child === slottable) {
                if (React.Children.count(newElement) > 1) return React.Children.only(null);
                return React.isValidElement(newElement)
                    ? newElement.props.children
                    : null;
            }
            return child;
        });

        return (
            <SlotClone {...slotProps} ref={forwardedRef}>
                {React.isValidElement(newElement)
                    ? React.cloneElement(newElement, undefined, newChildren)
                    : null}
            </SlotClone>
        );
    }

    return (
        <SlotClone {...slotProps} ref={forwardedRef}>
            {children}
        </SlotClone>
    );
});

// Create named components
export function createSlot(ownerName) {
    const Component = React.forwardRef((props, ref) => <Slot {...props} ref={ref} />);
    Component.displayName = `${ownerName}.Slot`;
    return Component;
}

export function createSlottable(ownerName) {
    const Component = ({ children }) => <Slottable>{children}</Slottable>;
    Component.displayName = `${ownerName}.Slottable`;
    Component.__yarclId = SLOTTABLE_IDENTIFIER;
    return Component;
}

// Aliases
export const Root = Slot;