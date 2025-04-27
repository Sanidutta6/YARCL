import React from 'react'
import { Badge } from "@/components/ui/Badge"

const BadgeExample = () => {
    return (
        <div className='flex space-x-2'>
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
        </div>
    )
}

export default BadgeExample