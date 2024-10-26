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

    const { rules } = $props();
</script>

<PageContainer title="">
    <div class="w-full h-full p-6 flex flex-col gap-6">
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
        <Card.Root class="p-0 h-full">
            <Card.Content class="p-0 h-full">
                <Table.Root class="h-full">
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
                        {#each rules as rule}
                            <Table.Row>
                                <Table.Cell>{rule.id}</Table.Cell>
                                <Table.Cell>{rule.name}</Table.Cell>
                                <Table.Cell>
                                    <Badge
                                        variant={rule.status === "active"
                                            ? "default"
                                            : "destructive"}
                                    >
                                        {rule.status}
                                    </Badge>
                                </Table.Cell>
                                <Table.Cell>{rule.createdBy}</Table.Cell>
                                <Table.Cell>{rule.createdAt}</Table.Cell>
                                <Table.Cell>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger
                                            class="flex items-center"
                                        >
                                            <Ellipsis class="h-4 w-4" />
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Content>
                                            <DropdownMenu.Item>
                                                Edit
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item>
                                                Delete
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                </Table.Cell>
                            </Table.Row>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </Card.Content>
        </Card.Root>
        <div class="flex justify-between items-center">
            <div class="text-muted-foreground text-xs">
                Showing <strong>1-10</strong> of <strong>32</strong> rules
            </div>
            <div>
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </div>
    </div>
</PageContainer>
