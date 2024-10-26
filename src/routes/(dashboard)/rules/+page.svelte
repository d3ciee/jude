<script lang="ts">
    import PageContainer from "../_components/page-container";

    import Ellipsis from "lucide-svelte/icons/ellipsis";
    import { Badge } from "$lib/ui/badge";
    import { Button } from "$lib/ui/button";
    import * as Card from "$lib/ui/card";
    import * as Dialog from "$lib/ui/dialog";
    import { Input } from "$lib/ui/input";
    import { Label } from "$lib/ui/label";
    import * as DropdownMenu from "$lib/ui/dropdown-menu";
    import * as Table from "$lib/ui/table";

    import CircleFadingPlus from "lucide-svelte/icons/circle-fading-plus";
    import { Textarea } from "$lib/ui/textarea";
</script>

<PageContainer title="">
    <div class="w-full h-full p-6 grid gap-6">
        <div class="flex justify-between">
            <div class="grid gap-1.5">
                <h1
                    class="text-lg font-semibold leading-none tracking-tight space-y-1.5"
                >
                    Adjudication Rules
                </h1>
                <p class="text-muted-foreground text-sm">
                    Manage rules that affect the claims adjudication process
                </p>
            </div>
            <div>
                <Dialog.Root>
                    <Dialog.Trigger asChild let:builder>
                        <Button size="sm" builders={[builder]}>
                            <CircleFadingPlus class="h-4 w-4 mr-2" />
                            Add new rule</Button
                        >
                    </Dialog.Trigger>
                    <Dialog.Content class="sm:max-w-[425px]">
                        <Dialog.Header>
                            <Dialog.Title
                                >Create new adjudication rule</Dialog.Title
                            >
                            <Dialog.Description>
                                Create a new rule for the adjudication process.
                                Please provide a name and description for the
                                rule.
                            </Dialog.Description>
                        </Dialog.Header>
                        <form method="POST" action="?/create">
                            <div class="grid gap-4 py-4">
                                <div
                                    class="grid grid-cols-4 items-center gap-4"
                                >
                                    <Label for="name" class="text-right"
                                        >Name</Label
                                    >
                                    <Input
                                        id="name"
                                        value=""
                                        class="col-span-3"
                                    />
                                </div>
                                <div
                                    class="grid grid-cols-4 items-center gap-4"
                                >
                                    <Label for="username" class="text-right"
                                        >Description</Label
                                    >
                                    <Textarea
                                        id="description"
                                        class="col-span-3"
                                    />
                                </div>
                            </div>
                            <Dialog.Footer>
                                <Button type="submit">Save changes</Button>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </div>

        <Card.Root class="p-0">
            <Card.Content class="p-0">
                <Table.Root>
                    <Table.Header class="bg-muted/40">
                        <Table.Row>
                            <Table.Head>ID</Table.Head>
                            <Table.Head>Name</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head>Created by</Table.Head>
                            <Table.Head>Created at</Table.Head>
                            <Table.Head>
                                <span class="sr-only">Actions</span>
                            </Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <img
                                    alt="Product example"
                                    class="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/images/placeholder.svg"
                                    width="64"
                                />
                            </Table.Cell>
                            <Table.Cell class="font-medium"
                                >Laser Lemonade Machine</Table.Cell
                            >
                            <Table.Cell>
                                <Badge variant="outline">Draft</Badge>
                            </Table.Cell>
                            <Table.Cell>$499.99</Table.Cell>
                            <Table.Cell class="hidden md:table-cell"
                                >25</Table.Cell
                            >
                            <Table.Cell class="hidden md:table-cell">
                                2023-07-12 10:42 AM
                            </Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                            builders={[builder]}
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only"
                                                >Toggle menu</span
                                            >
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label
                                            >Actions</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Item
                                            >Edit</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Delete</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <img
                                    alt="Product"
                                    class="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/images/placeholder.svg"
                                    width="64"
                                />
                            </Table.Cell>
                            <Table.Cell class="font-medium"
                                >Hypernova Headphones</Table.Cell
                            >
                            <Table.Cell>
                                <Badge variant="outline">Active</Badge>
                            </Table.Cell>
                            <Table.Cell>$129.99</Table.Cell>
                            <Table.Cell class="hidden md:table-cell"
                                >100</Table.Cell
                            >
                            <Table.Cell class="hidden md:table-cell">
                                2023-10-18 03:21 PM
                            </Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            builders={[builder]}
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only"
                                                >Toggle menu</span
                                            >
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label
                                            >Actions</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Item
                                            >Edit</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Delete</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <img
                                    alt="Product"
                                    class="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/images/placeholder.svg"
                                    width="64"
                                />
                            </Table.Cell>
                            <Table.Cell class="font-medium"
                                >AeroGlow Desk Lamp</Table.Cell
                            >
                            <Table.Cell>
                                <Badge variant="outline">Active</Badge>
                            </Table.Cell>
                            <Table.Cell>$39.99</Table.Cell>
                            <Table.Cell class="hidden md:table-cell"
                                >50</Table.Cell
                            >
                            <Table.Cell class="hidden md:table-cell">
                                2023-11-29 08:15 AM
                            </Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            builders={[builder]}
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only"
                                                >Toggle menu</span
                                            >
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label
                                            >Actions</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Item
                                            >Edit</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Delete</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <img
                                    alt="Product"
                                    class="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/images/placeholder.svg"
                                    width="64"
                                />
                            </Table.Cell>
                            <Table.Cell class="font-medium"
                                >TechTonic Energy Drink</Table.Cell
                            >
                            <Table.Cell>
                                <Badge variant="secondary">Draft</Badge>
                            </Table.Cell>
                            <Table.Cell>$2.99</Table.Cell>
                            <Table.Cell class="hidden md:table-cell"
                                >0</Table.Cell
                            >
                            <Table.Cell class="hidden md:table-cell">
                                2023-12-25 11:59 PM
                            </Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            builders={[builder]}
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only"
                                                >Toggle menu</span
                                            >
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label
                                            >Actions</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Item
                                            >Edit</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Delete</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <img
                                    alt="Product"
                                    class="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/images/placeholder.svg"
                                    width="64"
                                />
                            </Table.Cell>
                            <Table.Cell class="font-medium"
                                >Gamer Gear Pro Controller</Table.Cell
                            >
                            <Table.Cell>
                                <Badge variant="outline">Active</Badge>
                            </Table.Cell>
                            <Table.Cell>$59.99</Table.Cell>
                            <Table.Cell class="hidden md:table-cell"
                                >75</Table.Cell
                            >
                            <Table.Cell class="hidden md:table-cell">
                                2024-01-01 12:00 AM
                            </Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            builders={[builder]}
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only"
                                                >Toggle menu</span
                                            >
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label
                                            >Actions</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Item
                                            >Edit</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Delete</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell class="hidden sm:table-cell">
                                <img
                                    alt="Product"
                                    class="aspect-square rounded-md object-cover"
                                    height="64"
                                    src="/images/placeholder.svg"
                                    width="64"
                                />
                            </Table.Cell>
                            <Table.Cell class="font-medium"
                                >Luminous VR Headset</Table.Cell
                            >
                            <Table.Cell>
                                <Badge variant="outline">Active</Badge>
                            </Table.Cell>
                            <Table.Cell>$199.99</Table.Cell>
                            <Table.Cell class="hidden md:table-cell"
                                >30</Table.Cell
                            >
                            <Table.Cell class="hidden md:table-cell">
                                2024-02-14 02:14 PM
                            </Table.Cell>
                            <Table.Cell>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild let:builder>
                                        <Button
                                            builders={[builder]}
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                            <span class="sr-only"
                                                >Toggle menu</span
                                            >
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content align="end">
                                        <DropdownMenu.Label
                                            >Actions</DropdownMenu.Label
                                        >
                                        <DropdownMenu.Item
                                            >Edit</DropdownMenu.Item
                                        >
                                        <DropdownMenu.Item
                                            >Delete</DropdownMenu.Item
                                        >
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Card.Content>
            <Card.Footer>
                <div class="text-muted-foreground text-xs">
                    Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
            </Card.Footer>
        </Card.Root>
    </div>
</PageContainer>
