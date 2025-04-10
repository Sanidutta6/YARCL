import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { SelectList } from "@/components/ui/SelectList"

function CardExample() {
    return (
        <Card.Root className="w-[350px]">
            <Card.Header>
                <Card.Title>Create project</Card.Title>
                <Card.Description>Deploy your new project in one-click.</Card.Description>
            </Card.Header>
            <Card.Content>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Project Name</Label>
                            <Input id="name" placeholder="Name of your project" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Project Framework</Label>
                            <SelectList.Root>
                                <SelectList.Trigger
                                    id="framework"
                                    type="button" // Add this to prevent form submission
                                >
                                    <SelectList.Value placeholder="Select" />
                                </SelectList.Trigger>
                                <SelectList.Content position="popper">
                                    <SelectList.Item value="next">Next.js</SelectList.Item>
                                    <SelectList.Item value="sveltekit">SvelteKit</SelectList.Item>
                                    <SelectList.Item value="astro">Astro</SelectList.Item>
                                    <SelectList.Item value="nuxt">Nuxt.js</SelectList.Item>
                                </SelectList.Content>
                            </SelectList.Root>
                        </div>
                    </div>
                </form>
            </Card.Content>
            <Card.Footer className="flex justify-between">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit">Deploy</Button>
            </Card.Footer>
        </Card.Root>
    )
}

export default CardExample