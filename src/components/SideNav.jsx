import { ArrowRight, Binoculars, ChevronRight, Home, SquareLibrary, Users } from "lucide-react"
import { Link, useLocation } from "react-router"
import WB_LOGO from "@/assets/react.svg"

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/Collapsible"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/Sidebar"

const SidebarNavConfig = {
    groups: [
        {
            label: "",
            items: [
                {
                    title: "Home",
                    icon: Home,
                    url: "/",
                    permissions: [""]
                },
                {
                    title: "Installation",
                    icon: SquareLibrary,
                    url: "/installation",
                    permissions: [""]
                },
                {
                    title: "Components",
                    icon: Binoculars,
                    permissions: [""],
                    items: [
                        {
                            title: "Accordian",
                            url: "/components/accordion",
                            permissions: [""]
                        },
                        {
                            title: "Alert",
                            url: "/components/alert",
                            permissions: [""]
                        },
                        {
                            title: "Alert Dialog",
                            url: "/components/alert-dialog",
                            permissions: [""]
                        },
                        {
                            title: "Aspect Ratio",
                            url: "/components/aspect-ratio",
                            permissions: [""]
                        },
                        {
                            title: "Avatar",
                            url: "/components/avatar",
                            permissions: [""]
                        },
                        {
                            title: "Badge",
                            url: "/components/badge",
                            permissions: [""]
                        },
                        {
                            title: "Breadcrumb",
                            url: "/components/breadcrumb",
                            permissions: [""]
                        },
                        {
                            title: "Button",
                            url: "/components/button",
                            permissions: [""]
                        },
                        {
                            title: "Card",
                            url: "/components/card",
                            permissions: [""]
                        },
                        {
                            title: "Checkbox",
                            url: "/components/checkbox",
                            permissions: [""]
                        },
                        {
                            title: "Collapsible",
                            url: "/components/collapsible",
                            permissions: [""]
                        },
                        {
                            title: "Context Menu",
                            url: "/components/context-menu",
                            permissions: [""]
                        },
                        {
                            title: "Dialog",
                            url: "/components/dialog",
                            permissions: [""]
                        },
                        {
                            title: "Drawer",
                            url: "/components/drawer",
                            permissions: [""]
                        },
                        {
                            title: "Dropdown Menu",
                            url: "/components/dropdown-menu",
                            permissions: [""]
                        },
                        {
                            title: "Hover Card",
                            url: "/components/hover-card",
                            permissions: [""]
                        },
                        {
                            title: "Input",
                            url: "/components/input",
                            permissions: [""]
                        },
                        {
                            title: "Label",
                            url: "/components/label",
                            permissions: [""]
                        },
                        {
                            title: "Pagination",
                            url: "/components/pagination",
                            permissions: [""]
                        },
                        {
                            title: "Popover",
                            url: "/components/popover",
                            permissions: [""]
                        },
                        {
                            title: "Progress",
                            url: "/components/progress",
                            permissions: [""]
                        },
                        {
                            title: "Skeleton",
                            url: "/components/skeleton",
                            permissions: [""]
                        },
                        {
                            title: "Radio Group",
                            url: "/components/radio-group",
                            permissions: [""]
                        },
                        {
                            title: "Scroll Area",
                            url: "/components/scroll-area",
                            permissions: [""]
                        },
                        {
                            title: "Select List",
                            url: "/components/select-list",
                            permissions: [""]
                        },
                        {
                            title: "Separator",
                            url: "/components/separator",
                            permissions: [""]
                        },
                        {
                            title: "Slider",
                            url: "/components/slider",
                            permissions: [""]
                        },
                        {
                            title: "Switch",
                            url: "/components/switch",
                            permissions: [""]
                        },
                        {
                            title: "Table",
                            url: "/components/table",
                            permissions: [""]
                        },
                        {
                            title: "Tabs",
                            url: "/components/tabs",
                            permissions: [""]
                        },
                        {
                            title: "Textarea",
                            url: "/components/textarea",
                            permissions: [""]
                        },
                        {
                            title: "Toast",
                            url: "/components/toast",
                            permissions: [""]
                        },
                        {
                            title: "Toggle",
                            url: "/components/toggle",
                            permissions: [""]
                        },
                        {
                            title: "Toggle Group",
                            url: "/components/toggle-group",
                            permissions: [""]
                        },
                        {
                            title: "Tooltip",
                            url: "/components/tooltip",
                            permissions: [""]
                        },
                    ],
                },
            ],
        },
    ],
}

function SideNav() {
    const location = useLocation();

    const userPermissions = [""];

    const isActive = (url) => {
        return location.pathname === url;
    };

    const isActiveParent = (items) => {
        return items.some(item => isActive(item.url));
    };

    const hasPermission = (requiredPermissions) => {
        return requiredPermissions.every(permission => userPermissions.includes(permission));
    };

    return (
        <Sidebar collapsible="icon" className="bg-background/80">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <div className="flex items-center">
                                <img src={WB_LOGO} alt="Logo" className="h-6 w-6 object-contain" />
                                <h1 className="ml-2 text-2xl font-bold">YARCL</h1>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {SidebarNavConfig.groups.map((group, groupIndex) => (
                    <SidebarGroup key={groupIndex} className={groupIndex === 1 ? "group-data-[collapsible=icon]:hidden" : ""}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarMenu>
                            {group.items.filter(item => hasPermission(item.permissions || [])).map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.items ? (
                                        <Collapsible defaultOpen={isActiveParent(item.items)} className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    tooltip={item.title}
                                                    className={isActiveParent(item.items) ? "bg-ternary-background text-primary font-medium" : ""}
                                                >
                                                    {item.icon && <item.icon className="size-4" />}
                                                    <span>{item.title}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.items.filter(subItem => hasPermission(subItem.permissions || [])).map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton className={isActive(subItem.url) ? "bg-ternary-background text-primary font-medium [&_svg]:text-primary" : ""} asChild>
                                                                <Link
                                                                    to={subItem.url}
                                                                    className="flex items-center gap-2 w-full h-full py-1"
                                                                >
                                                                    <ArrowRight className="size-4" />
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            className={isActive(item.url) ? "bg-ternary-background text-primary font-medium" : ""}
                                        >
                                            <Link to={item.url} className="flex items-center gap-2">
                                                {item.icon && <item.icon className="size-4" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}

export default SideNav;