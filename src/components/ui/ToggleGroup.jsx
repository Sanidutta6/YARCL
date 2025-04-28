import React from 'react';

// Create context for ToggleGroup
const ToggleGroupContext = React.createContext();

// Main ToggleGroup component
const ToggleGroup = React.forwardRef((props, forwardedRef) => {
    const {
        type = 'single',
        value: valueProp,
        defaultValue,
        onValueChange,
        disabled = false,
        rovingFocus = true,
        orientation = 'horizontal',
        loop = true,
        className = '',
        children,
        ...rest
    } = props;

    const [value, setValue] = useControllableState({
        prop: valueProp,
        defaultProp: type === 'single' ? (defaultValue || '') : (defaultValue || []),
        onChange: onValueChange,
    });

    const handleItemToggle = (itemValue) => {
        if (disabled) return;

        if (type === 'single') {
            setValue(itemValue === value ? '' : itemValue);
        } else {
            setValue(prev => {
                const currentValue = Array.isArray(prev) ? prev : [];
                const newValue = [...currentValue];
                const index = newValue.indexOf(itemValue);
                if (index > -1) {
                    newValue.splice(index, 1);
                } else {
                    newValue.push(itemValue);
                }
                return newValue;
            });
        }
    };

    // Convert value to array for consistent checking
    const getValueArray = () => {
        if (type === 'single') {
            return value ? [value] : [];
        }
        return Array.isArray(value) ? value : [];
    };

    const contextValue = {
        type,
        value: getValueArray(),
        disabled,
        onItemToggle: handleItemToggle
    };

    const groupClasses = `inline-flex rounded-md shadow-sm ${orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row space-x-1'
        } ${className}`;

    return (
        <div
            ref={forwardedRef}
            role="group"
            className={groupClasses}
            {...rest}
        >
            <ToggleGroupContext.Provider value={contextValue}>
                {React.Children.map(children, child => {
                    if (React.isValidElement(child)) {
                        if (rovingFocus) {
                            return (
                                <RovingFocusItem disabled={disabled}>
                                    {child}
                                </RovingFocusItem>
                            );
                        }
                        return child;
                    }
                    return child;
                })}
            </ToggleGroupContext.Provider>
        </div>
    );
});

ToggleGroup.displayName = 'ToggleGroup';

// ToggleGroupItem component
const ToggleGroupItem = React.forwardRef((props, forwardedRef) => {
    const { value, disabled, className = '', children, ...rest } = props;
    const context = React.useContext(ToggleGroupContext);

    if (!context) {
        throw new Error('ToggleGroupItem must be used within a ToggleGroup');
    }

    // Safely check if value is included
    const pressed = Array.isArray(context.value)
        ? context.value.includes(value)
        : false;
    const isDisabled = context.disabled || disabled;

    const buttonClasses = `px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDisabled
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : pressed
            ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
            : 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
        } ${className}`;

    const handleClick = () => {
        if (!isDisabled) {
            context.onItemToggle(value);
        }
    };

    return (
        <button
            ref={forwardedRef}
            type="button"
            aria-pressed={pressed}
            disabled={isDisabled}
            className={buttonClasses}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </button>
    );
});

ToggleGroupItem.displayName = 'ToggleGroupItem';

// Simple RovingFocus implementation
const RovingFocusItem = ({ children, disabled }) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return React.cloneElement(React.Children.only(children), {
        onFocus: () => !disabled && setIsFocused(true),
        onBlur: () => setIsFocused(false),
        className: `${children.props.className || ''} ${isFocused ? 'ring-2 ring-blue-500' : ''}`,
    });
};

// Simple useControllableState implementation
function useControllableState({ prop, defaultProp, onChange }) {
    const [state, setState] = React.useState(defaultProp);
    const isControlled = prop !== undefined;
    const value = isControlled ? prop : state;

    const updateValue = (newValue) => {
        if (!isControlled) {
            setState(newValue);
        }
        if (onChange) {
            onChange(newValue);
        }
    };

    return [value, updateValue];
}

// Export components
const Root = ToggleGroup;
const Item = ToggleGroupItem;

export { ToggleGroup, ToggleGroupItem, Root, Item };