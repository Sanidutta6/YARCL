import React from 'react'
import { Switch } from "@/components/ui/Switch"
import { Label } from "@/components/ui/Label"

const SwitchExample = () => {
    return (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
    )
}

export default SwitchExample