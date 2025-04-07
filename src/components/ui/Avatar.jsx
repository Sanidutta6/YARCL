import React, { useState } from 'react';

const Avatar = ({
    src,
    alt = 'Avatar',
    initials,
    size = 'md',
    className = '',
}) => {
    const [imageError, setImageError] = useState(false);

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-lg',
        xl: 'w-24 h-24 text-2xl',
    };

    const renderFallback = () => {
        if (initials) {
            return <span className="font-medium">{initials}</span>;
        }

        if (alt && alt.length > 0) {
            // Get first letter of each word
            const letters = alt
                .split(' ')
                .map(word => word[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

            return <span className="font-medium">{letters}</span>;
        }

        return <span className="font-medium">U</span>;
    };

    return (
        <div
            className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-muted flex items-center justify-center text-muted-foreground ${className}`}
        >
            {src && !imageError ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                renderFallback()
            )}
        </div>
    );
};

export default Avatar;