import * as React from 'react';

const Toggle = React.forwardRef((props, forwardedRef) => {
    const {
        pressed: pressedProp,
        defaultPressed = false,
        onPressedChange,
        className = '',
        disabled,
        onClick,
        ...buttonProps
    } = props;

    const [pressed, setPressed] = React.useState({
        prop: pressedProp,
        onChange: onPressedChange,
        defaultProp: defaultPressed,
    });

    const handleClick = (event) => {
        if (onClick) onClick(event);
        if (!disabled) {
            setPressed(!pressed);
        }
    };

    // Tailwind classes for different states
    const baseClasses = 'px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const enabledClasses = pressed
        ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500';
    const disabledClasses = 'bg-gray-100 text-gray-400 cursor-not-allowed';

    const buttonClasses = `${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className}`;

    return (
        <button
            type="button"
            aria-pressed={pressed}
            data-state={pressed ? 'on' : 'off'}
            data-disabled={disabled ? '' : undefined}
            className={buttonClasses}
            disabled={disabled}
            {...buttonProps}
            ref={forwardedRef}
            onClick={handleClick}
        />
    );
});

Toggle.displayName = 'Toggle';

export { Toggle };