import * as React from "react"

import { Button } from "@/components/ui/Button"
import { ChevronRight, Loader2, MailOpen } from "lucide-react"
import { Link } from "react-router"

function ButtonExample() {
    return (
        <div className="flex items-center justify-center gap-3">
            <Button>Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="outline" size="icon">
                <ChevronRight />
            </Button>
            <Button>
                <MailOpen /> Login with Email
            </Button>
            <Button disabled>
                <Loader2 className="animate-spin" />
                Please wait
            </Button>
            <Button asChild>
                <Link to="/login">Login</Link>
            </Button>
        </div>
    )
}

export default ButtonExample