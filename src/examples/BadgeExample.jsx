import React from 'react'
import { Badge } from "@/components/ui/Badge"

const BadgeExample = () => {
    return (
        <div className='flex flex-col space-y-2'>
            <div>
                <h3 className='text-lg font-semibold'>Default</h3>
                <Badge>Badge</Badge>
            </div>
            <div>
                <h3 className='text-lg font-semibold'>Secondary</h3>
                <Badge variant="secondary">Secondary</Badge>
            </div>
            <div>
                <h3 className='text-lg font-semibold'>Outline</h3>
                <Badge variant="outline">Outline</Badge>
            </div>
            <div>
                <h3 className='text-lg font-semibold'>Destructive</h3>
                <Badge variant="destructive">Destructive</Badge>
            </div>
        </div>
    )
}

export default BadgeExample