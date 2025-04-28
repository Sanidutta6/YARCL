import React from 'react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectViewport,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectSeparator
} from '@/components/ui/SelectList';

function SelectExample() {
    const [value, setValue] = React.useState("");

    return (
        <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                <SelectViewport>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Vegetables</SelectLabel>
                        <SelectItem value="carrot">Carrot</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                    </SelectGroup>
                </SelectViewport>
            </SelectContent>
        </Select>
    );
}

export default SelectExample;