import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/Button';
import React, { useState } from 'react';

const Preview = ({ children, className = "" }) => {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className={`w-full rounded-lg border border-gray-200 ${darkMode ? 'bg-gray-950' : 'bg-white'} ${className}`}>
            {/* Header with controls */}
            <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>

                <div className="flex items-center">
                    <Button
                        onClick={() => setDarkMode(!darkMode)}
                        variant="icon"
                        className={`p-1 rounded-md ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {darkMode ? (
                            <Moon className='size-4' />
                        ) : (
                            <Sun className='size-4' />
                        )}
                    </Button>
                </div>
            </div>

            {/* Content area */}
            <div className={`p-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {children}
            </div>
        </div>
    );
};

export default Preview;