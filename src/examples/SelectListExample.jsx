import React from 'react';
import { SelectList } from '../components/ui/SelectList';

function SelectListExample() {
    const [value, setValue] = React.useState("");

    return (
        <SelectList.Root value={value} onValueChange={setValue}>
            <SelectList.Trigger className="w-[180px]">
                <SelectList.Value placeholder="Select an option" />
            </SelectList.Trigger>
            <SelectList.Content>
                <SelectList.Viewport>
                    <SelectList.Group>
                        <SelectList.Label>Fruits</SelectList.Label>
                        <SelectList.Item value="apple">Apple</SelectList.Item>
                        <SelectList.Item value="banana">Banana</SelectList.Item>
                        <SelectList.Item value="orange">Orange</SelectList.Item>
                    </SelectList.Group>
                    <SelectList.Separator />
                    <SelectList.Group>
                        <SelectList.Label>Vegetables</SelectList.Label>
                        <SelectList.Item value="carrot">Carrot</SelectList.Item>
                        <SelectList.Item value="potato">Potato</SelectList.Item>
                    </SelectList.Group>
                </SelectList.Viewport>
            </SelectList.Content>
        </SelectList.Root>
    );
}

export default SelectListExample;