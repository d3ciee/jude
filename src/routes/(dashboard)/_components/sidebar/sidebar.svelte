<script lang="ts">
    import { cn } from "$lib/ui/utils";
    import { Separator } from "$lib/ui/select";
    import SidebarNav from "./sidebar-nav.svelte";
    import PanelLeftClose from "lucide-svelte/icons/panel-left-close";
    import PanelRightClose from "lucide-svelte/icons/panel-right-close";

    import { Command, MailCheckIcon } from "lucide-svelte";

    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";

    import { Book, Contact, Gauge, Search, Ticket } from "lucide-svelte";

    import * as DropdownMenu from "$lib/ui/dropdown-menu";
    import { Button } from "$lib/ui/button";

    import { Input } from "$lib/ui/input";
    import Inbox from "lucide-svelte/icons/inbox";
    import ChartBar from "lucide-svelte/icons/chart-bar";

    let accounts = [
        {
            label: "Decent Femayi",
            email: "alicia@example.com",
            icon: MailCheckIcon,
        },
    ];
    let isCollapsed = false;
</script>

<div class="flex flex-col border-r h-full gap-2 bg-muted/40 sticky">
    <div
        class={cn(
            "flex h-[52px] items-center justify-center border-b",
            isCollapsed ? "h-[52px]" : "px-2 w-64",
        )}
    >
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                class={cn(
                    "flex w-full rounded-md items-center gap-2 text-sm [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
                    isCollapsed &&
                        "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>div>svg]:hidden [&>span]:w-auto",
                )}
                aria-label="Select account"
            >
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOZWD3D24cxVBucYc4dklLYs5KmY8PX7bZmQ&s"
                    alt="avatar"
                    class="rounded-full h-8 w-8 before:content-[''] before:size-2"
                />
                <span
                    class={cn(
                        isCollapsed
                            ? "!ml-0 !hidden"
                            : "h-fit flex flex-col items-start w-full justify-start",
                    )}
                >
                    <div
                        class="text-sm font-medium leading-none text-left w-full"
                    >
                        Decent Femai
                    </div>
                    <div
                        class="text-xs text-muted-foreground leading-none text-left w-full"
                    >
                        decent@mobisoft.co.zw
                    </div>
                </span>
                <ChevronsUpDown
                    class={cn("w-4 h-4", isCollapsed && "hidden")}
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content class="w-56">
                <DropdownMenu.Label>My Account</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                    <DropdownMenu.Item>
                        Profile
                        <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        Billing
                        <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        Settings
                        <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                        Keyboard shortcuts
                        <DropdownMenu.Shortcut>⌘K</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                    <DropdownMenu.Item>Team</DropdownMenu.Item>
                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger
                            >Invite users</DropdownMenu.SubTrigger
                        >
                        <DropdownMenu.SubContent>
                            <DropdownMenu.Item>Email</DropdownMenu.Item>
                            <DropdownMenu.Item>Message</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>More...</DropdownMenu.Item>
                        </DropdownMenu.SubContent>
                    </DropdownMenu.Sub>
                    <DropdownMenu.Item>
                        New Team
                        <DropdownMenu.Shortcut>⌘+T</DropdownMenu.Shortcut>
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>GitHub</DropdownMenu.Item>
                <DropdownMenu.Item>Support</DropdownMenu.Item>
                <DropdownMenu.Item>API</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                    Log out
                    <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>

    <div class={cn("relative h-fit px-2", isCollapsed && "hidden")}>
        <Input
            placeholder="Search for anything..."
            class="w-full h-8 pl-8 text-xs shadow-sm bg-elevated"
            aria-label="Search"
        />
        <Search
            class="absolute top-1/2 left-4 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <span
            class="absolute h-fit flex gap-1 top-1/2 right-4 transform -translate-y-1/2 items-center justify-center"
        >
            <kbd
                class="h-5 w-5 shadow-sm inline-flex justify-center items-center border font-mono rounded-md bg-muted"
            >
                <Command class="w-3 h-3" />
            </kbd>
            <kbd
                class="h-5 w-5 text-sm shadow-sm inline-flex justify-center items-center border font-mono rounded-md bg-muted"
            >
                k
            </kbd>
        </span>
    </div>

    <SidebarNav
        {isCollapsed}
        routes={[
            {
                title: "Overview",
                label: "128",
                icon: Gauge,
                path: "/",
            },
            {
                title: "Rules",
                label: "9",
                icon: Inbox,
                path: "/inbox",
            },
            {
                title: "Tickets",
                label: "9",
                icon: Ticket,
                path: "/tickets",
            },
            {
                title: "Contacts",
                label: "",
                icon: Contact,
                path: "/contacts",
            },
            {
                title: "Analytics",
                label: "",
                icon: ChartBar,
                path: "/analytics",
            },
            {
                title: "Knowledge Base",
                label: "23",
                icon: Book,
                path: "/knowledge-base",
            },
        ]}
    />
    <Separator />

    <div class="flex-1 w-full"></div>
    <div
        class={cn(
            "flex h-[52px] items-center justify-between",
            isCollapsed ? "h-[52px]" : "px-2 w-64",
        )}
    >
        <div
            class={cn(
                "flex gap-2 font-semibold items-center",
                isCollapsed && "hidden",
            )}
        >
            <img
                src="https://www.263chat.com/wp-content/uploads/2022/06/ZB-Logo.jpeg"
                alt="logo"
                class="h-7 w-7 border rounded-md"
            />
            <span class="text-xs"> </span>
        </div>
        <Button
            size="icon"
            on:click={() => {
                isCollapsed = !isCollapsed;
            }}
            class={cn("w-8 h-8", isCollapsed ? "ml-2.5" : "-mr-1.5")}
            variant="ghost"
        >
            <PanelLeftClose class="w-4 h-4" />
        </Button>
    </div>
</div>
