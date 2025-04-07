import React from 'react'
import { Button } from "../components/ui/Button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/AlertDialog"


const AlertDialogExample = () => {
    return (
        <div className='flex flex-col items-start space-y-5'>
            <h2 className='text-2xl font-bold'>Alert Dialog</h2>
            <div className='w-full'>
                <h3 className='text-lg font-semibold'>Basic Confirmation Dialog</h3>
                <div className='flex items-center justify-center'>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button>Show Dialog</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent variant="warning">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

        </div>
    )
}

export default AlertDialogExample