import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/DropdownMenu";

function DropdownMenuExample() {
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [radioValue, setRadioValue] = useState("option1");

    return (
        <div className="space-x-4">
            <Dropdown.Menu>
                <Dropdown.Trigger asChild>
                    <Button variant="outline">Open</Button>
                </Dropdown.Trigger>
                <Dropdown.Content className="w-56">
                    <Dropdown.Label>My Account</Dropdown.Label>
                    <Dropdown.Separator />
                    <Dropdown.Group>
                        <Dropdown.Item>
                            Profile
                            <span className="ml-auto text-xs text-muted-foreground">⇧⌘P</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Billing
                            <span className="ml-auto text-xs text-muted-foreground">⌘B</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Settings
                            <span className="ml-auto text-xs text-muted-foreground">⌘S</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            Keyboard shortcuts
                            <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
                        </Dropdown.Item>
                    </Dropdown.Group>
                    <Dropdown.Separator />
                    <Dropdown.CheckboxItem
                        checked={checkboxChecked}
                        onCheckedChange={setCheckboxChecked}
                    >
                        Enable Notifications
                    </Dropdown.CheckboxItem>
                    <Dropdown.Separator />
                    <Dropdown.RadioGroup>
                        <Dropdown.RadioItem
                            value="option1"
                            checked={radioValue === "option1"}
                            onValueChange={setRadioValue}
                        >
                            Radio Option 1
                        </Dropdown.RadioItem>
                        <Dropdown.RadioItem
                            value="option2"
                            checked={radioValue === "option2"}
                            onValueChange={setRadioValue}
                        >
                            Radio Option 2
                        </Dropdown.RadioItem>
                    </Dropdown.RadioGroup>
                    <Dropdown.Separator />
                    <Dropdown.Group>
                        <Dropdown.Item>Team</Dropdown.Item>
                        <Dropdown.SubMenu>
                            <Dropdown.SubTrigger>Invite users</Dropdown.SubTrigger>
                            <Dropdown.SubContent>
                                <Dropdown.Item>Email</Dropdown.Item>
                                <Dropdown.Item>Message</Dropdown.Item>
                                <Dropdown.Separator />
                                <Dropdown.Item>More...</Dropdown.Item>
                            </Dropdown.SubContent>
                        </Dropdown.SubMenu>
                        <Dropdown.Item>
                            New Team
                            <span className="ml-auto text-xs text-muted-foreground">⌘+T</span>
                        </Dropdown.Item>
                    </Dropdown.Group>
                    <Dropdown.Separator />
                    <Dropdown.Item>GitHub</Dropdown.Item>
                    <Dropdown.Item>Support</Dropdown.Item>
                    <Dropdown.Item disabled>API</Dropdown.Item>
                    <Dropdown.Separator />
                    <Dropdown.Item>
                        Log out
                        <span className="ml-auto text-xs text-muted-foreground">⇧⌘Q</span>
                    </Dropdown.Item>
                </Dropdown.Content>
            </Dropdown.Menu>

            <Dropdown.Menu>
                <Dropdown.Trigger>Open</Dropdown.Trigger>
                <Dropdown.Content>
                    <Dropdown.Label>My Account</Dropdown.Label>
                    <Dropdown.Separator />
                    <Dropdown.Item>Profile</Dropdown.Item>
                    <Dropdown.Item>Billing</Dropdown.Item>
                    <Dropdown.Item>Team</Dropdown.Item>
                    <Dropdown.Item>Subscription</Dropdown.Item>
                </Dropdown.Content>
            </Dropdown.Menu>

        </div>
    );
}

export default DropdownMenuExample;