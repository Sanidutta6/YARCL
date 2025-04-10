import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import AccordionExample from '../examples/AccordionExample';
import AlertDialogExample from '../examples/AlertDialogExample';
import Preview from '../components/Preview';
import AlertExample from '../examples/AlertExample';
import DropdownMenuExample from '../examples/DropdownMenuExample';
import DialogExample from '../examples/DialogExample';
import InputExample from '../examples/InputExample';
import LabelExample from '../examples/LabelExample';
import ProgressExample from '../examples/ProgressExample';
import SkeletonExample from '../examples/SkeletonExample';
import BadgeExample from '../examples/BadgeExample';
import BreadcrumbExample from '../examples/BreadcrumbExample';
import CardExample from '../examples/CardExample';

// Import all component examples

const componentMap = {
    accordion: <AccordionExample />,
    alert: <AlertExample />,
    'alert-dialog': <AlertDialogExample />,
    // 'aspect-ratio': <AspectRatioExample />,
    // avatar: <AvatarExample />,
    badge: <BadgeExample />,
    breadcrumb: <BreadcrumbExample />,
    // button: <ButtonExample />,
    card: <CardExample />,
    // checkbox: <CheckboxExample />,
    // collapsible: <CollapsibleExample />,
    dialog: <DialogExample />,
    "dropdown-menu": <DropdownMenuExample />,
    // 'hover-card': <HoverCardExample />,
    input: <InputExample />,
    label: <LabelExample />,
    // pagination: <PaginationExample />,
    // popover: <PopoverExample />,
    progress: <ProgressExample />,
    // 'radio-group': <RadioGroupExample />,
    // 'scroll-area': <ScrollAreaExample />,
    // select: <SelectExample />,
    // separator: <SeparatorExample />,
    skeleton: <SkeletonExample />,
    // slider: <SliderExample />,
    // switch: <SwitchExample />,
    // table: <TableExample />,
    // tabs: <TabsExample />,
    // textarea: <TextareaExample />,
    // toast: <ToastExample />,
    // toggle: <ToggleExample />,
    // 'toggle-group': <ToggleGroupExample />,
    // tooltip: <TooltipExample />,
};

const Components = () => {
    const { componentName } = useParams();
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState(null);

    useEffect(() => {
        if (componentName && componentMap[componentName]) {
            setActiveComponent(componentName);
        } else if (Object.keys(componentMap).length > 0) {
            navigate(`/components/${Object.keys(componentMap)[0]}`);
        }
    }, [componentName, navigate]);

    return (
        <div className="">
            {/* Content */}
            <div className="p-6">
                {activeComponent && (
                    <div>
                        <h2 className="mb-6 text-2xl font-bold capitalize">
                            {activeComponent.replace(/-/g, ' ')}
                        </h2>

                        {/* Preview component wrapped around your component */}
                        <Preview className="mb-8">
                            <div className="rounded-lg">
                                {componentMap[activeComponent]}
                            </div>
                        </Preview>

                        {/* Optionally, you could add component code or usage examples below */}
                        <div className="mt-6">
                            {/* Component usage examples or code snippets can go here */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Components;