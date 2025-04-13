import { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../components/ui/Drawer";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

function DrawerExample() {
    const [openRight, setOpenRight] = useState(false);
    const [openLeft, setOpenLeft] = useState(false);
    const [openBottom, setOpenBottom] = useState(false);
    const [openTop, setOpenTop] = useState(false);

    return (
        <div className="flex items-center justify-center gap-2">
            <Drawer open={openRight} onOpenChange={setOpenRight}>
                <DrawerTrigger asChild>
                    <button className="px-4 py-2 border rounded">
                        Edit Profile Right
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Edit profile</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4">
                        <form className={"grid items-start gap-4"}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" defaultValue="shadcn@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="@shadcn" />
                            </div>
                            <Button type="submit">Save changes</Button>
                        </form>
                    </div>
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Drawer open={openLeft} onOpenChange={setOpenLeft} direction="left">
                <DrawerTrigger asChild>
                    <button className="px-4 py-2 border rounded">
                        Edit Profile Left
                    </button>
                </DrawerTrigger>
                <DrawerContent >
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Edit profile</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4">
                        <form className={"grid items-start gap-4"}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" defaultValue="shadcn@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="@shadcn" />
                            </div>
                            <Button type="submit">Save changes</Button>
                        </form>
                    </div>
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Drawer open={openBottom} onOpenChange={setOpenBottom} direction="bottom">
                <DrawerTrigger asChild>
                    <button className="px-4 py-2 border rounded">
                        Edit Profile Bottom
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Edit profile</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4">
                        <form className={"grid items-start gap-4"}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" defaultValue="shadcn@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="@shadcn" />
                            </div>
                            <Button type="submit">Save changes</Button>
                        </form>
                    </div>
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Drawer open={openTop} onOpenChange={setOpenTop} direction="top">
                <DrawerTrigger asChild>
                    <button className="px-4 py-2 border rounded">
                        Edit Profile Top
                    </button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Edit profile</DrawerTitle>
                        <DrawerDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4">
                        <form className={"grid items-start gap-4"}>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" defaultValue="shadcn@example.com" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" defaultValue="@shadcn" />
                            </div>
                            <Button type="submit">Save changes</Button>
                        </form>
                    </div>
                    <DrawerFooter className="pt-2">
                        <DrawerClose asChild>
                            <Button>
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default DrawerExample;