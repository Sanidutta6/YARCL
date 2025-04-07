import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Accordion = ({
    items,
    className = '',
    allowMultiple = false,
}) => {
    const [openIndexes, setOpenIndexes] = useState([]);

    const toggleItem = (index) => {
        if (allowMultiple) {
            setOpenIndexes((prevIndexes) =>
                prevIndexes.includes(index)
                    ? prevIndexes.filter((i) => i !== index)
                    : [...prevIndexes, index]
            );
        } else {
            setOpenIndexes((prevIndexes) =>
                prevIndexes.includes(index) ? [] : [index]
            );
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {items.map((item, index) => {
                const isOpen = openIndexes.includes(index);

                return (
                    <div
                        key={index}
                        className="border-b border-border last:border-0"
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="flex w-full justify-between py-4 px-3 text-left font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
                            aria-expanded={isOpen}
                        >
                            {item.title}
                            <ChevronDown
                                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'
                                }`}
                            aria-hidden={!isOpen}
                        >
                            <div className="p-4 text-muted-foreground">{item.content}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion;