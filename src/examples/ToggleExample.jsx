import { Bold } from 'lucide-react'
import React from 'react'
import { Toggle } from "@/components/ui/Toggle"

const ToggleExample = () => {
    return (
        <div>
            <Toggle aria-label="Toggle italic">
                <Bold className="h-4 w-4" />
            </Toggle>
        </div>
    )
}

export default ToggleExample