import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/Avatar"

export function AvatarExample() {
    return (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}
