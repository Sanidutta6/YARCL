import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/Alert"
import { AlertCircle, Terminal } from "lucide-react"

const AlertExample = () => {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="mb-4 text-lg font-medium">Default</h3>
                <Alert>
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        You can add components to your app using the cli.
                    </AlertDescription>
                </Alert>

            </div>

            <div>
                <h3 className="mt-8 mb-4 text-lg font-medium">Destructive</h3>
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Your session has expired. Please log in again.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
}

export default AlertExample