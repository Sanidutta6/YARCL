import React from 'react';
import Accordion from '../components/ui/Accordion';

const AccordionExample = () => {
    const items = [
        {
            title: 'Is it accessible?',
            content: 'Yes. It adheres to the WAI-ARIA design pattern. The accordion wrapper acts as a container for all items. Each accordion item consists of a header and content.',
        },
        {
            title: 'Is it styled?',
            content: 'Yes. It comes with default styles that match the other components\' aesthetic. You can override any of the styles.',
        },
        {
            title: 'Is it animated?',
            content: 'Yes. It\'s animated by default, but you can disable it if you prefer. It uses CSS animations for smooth open and close animations.',
        }
    ]
    return (
        <div className="space-y-5">
            <div>
                <h3 className="mb-4 text-lg font-medium">Basic Accordion</h3>
                <div className='flex items-center justify-center'>
                    <Accordion items={items} className="w-full max-w-md" />
                </div>
            </div>

            <div>
                <h3 className="mt-8 mb-4 text-lg font-medium">Multiple Accordion</h3>
                <div className='flex items-center justify-center'>
                    <Accordion items={items} allowMultiple className="w-full max-w-md" />
                </div>
            </div>
        </div>
    );
};

export default AccordionExample;