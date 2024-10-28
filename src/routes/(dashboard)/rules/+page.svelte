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
    import Loader from "lucide-svelte/icons/loader";
    import { Textarea } from "$lib/ui/textarea";
    import { toast } from "$lib/ui/sonner";
    import type { Rule } from "$lib/types";
    import { Switch } from "$lib/ui/switch";
    import { Trash2 } from "lucide-svelte";
    import type { SubmitFunction } from "./$types.js";
    import { enhance } from "$app/forms";
    import { invalidate, invalidateAll } from "$app/navigation";

    const { data } = $props();

    let rules: Rule[] | null = $state(null);
    let total = $state(0);

    $effect(() => {
        if (!data.props.success) {
            toast.error("Failed to get rules", {
                description: data.props.error,
            });
            return;
        }
        rules = data.props.data.rules;
        total = data.props.data.total;
    });

    let loading = $state({
        create: false,
        edit: false,
        delete: false,
    });
    let dialogOpenState = $state({
        create: false,
        edit: false,
        delete: false,
    });
    const createOnSubmitFunc =
        (action: "create" | "edit" | "delete"): SubmitFunction =>
        async () => {
            const t = setTimeout(() => {
                loading[action] = true;
            }, 100);
            return async ({ result }) => {
                clearTimeout(t);
                loading[action] = false;

                if (result.type === "failure" || result.type === "error") {
                    toast.error(`Failed to ${action} rule`, {
                        description:
                            (result as any)?.data?.message ||
                            "An unexpected error occurred.  Please try again.",
                    });
                    return;
                }
                await invalidateAll();
                dialogOpenState[action] = false;
                toast.success(`Rule ${action}ed successfully`);
            };
        };
</script>

<PageContainer title="Rules">
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
                <Dialog.Root bind:open={dialogOpenState.create}>
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
                        <form
                            use:enhance={createOnSubmitFunc("create")}
                            method="POST"
                            action="?/create"
                        >
                            <div class="grid gap-4 py-4">
                                <div
                                    class="grid grid-cols-4 items-center gap-4"
                                >
                                    <Label for="name" class="text-right"
                                        >Name</Label
                                    >
                                    <Input
                                        id="name"
                                        name="name"
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
                                        name="description"
                                        class="col-span-3"
                                    />
                                </div>
                            </div>
                            <Dialog.Footer>
                                <Button disabled={loading.create} type="submit">
                                    {loading.create
                                        ? "Creating..."
                                        : "Create rule"}
                                </Button>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Content>
                </Dialog.Root>
            </div>
        </div>
        <Card.Root class="p-0 h-full">
            <Card.Content class="p-0 h-full">
                {#if !rules}
                    <div
                        class="items-center flex h-full w-full justify-center text-center"
                    >
                        <Loader
                            class="h-6 w-6 animate-spin duration-150 text-primary"
                        />
                    </div>
                {:else}
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
                        {#if rules.length === 0}
                            <Table.Body class="h-64">
                                <div
                                    class="absolute top-12 items-center p-10 w-full justify-center text-center"
                                >
                                    you do not have any rules.
                                </div>
                            </Table.Body>
                        {:else}
                            <Table.Body class="h-fit">
                                {#each rules as rule (rule.id)}
                                    <Table.Row class="h-fit">
                                        <Table.Cell>
                                            <Dialog.Root
                                                bind:open={dialogOpenState.edit}
                                            >
                                                <Dialog.Trigger
                                                    class="underline underline-offset-4 hover:text-primary cursor-pointer"
                                                >
                                                    {rule.id}
                                                </Dialog.Trigger>
                                                <Dialog.Content
                                                    class="sm:max-w-[425px]"
                                                >
                                                    <Dialog.Header>
                                                        <Dialog.Title
                                                            >Claims Adjudication
                                                            Rule</Dialog.Title
                                                        >
                                                        <Dialog.Description>
                                                            View or edit the
                                                            details of the
                                                            claims adjudication
                                                            rule.
                                                        </Dialog.Description>
                                                    </Dialog.Header>
                                                    <form
                                                        use:enhance={createOnSubmitFunc(
                                                            "edit",
                                                        )}
                                                        method="POST"
                                                        action="?/update"
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="id"
                                                            value={rule.id}
                                                        />
                                                        <div
                                                            class="grid gap-4 py-4"
                                                        >
                                                            <div
                                                                class="grid grid-cols-4 items-center gap-4"
                                                            >
                                                                <Label
                                                                    for="name"
                                                                    class="text-right"
                                                                >
                                                                    Name
                                                                </Label>
                                                                <Input
                                                                    id="name"
                                                                    name="name"
                                                                    value={rule.name}
                                                                    required
                                                                    class="col-span-3"
                                                                />
                                                            </div>
                                                            <div
                                                                class="grid grid-cols-4 items-center gap-4"
                                                            >
                                                                <Label
                                                                    for="description"
                                                                    class="text-right"
                                                                >
                                                                    Description
                                                                </Label>
                                                                <Textarea
                                                                    id="description"
                                                                    name="description"
                                                                    required
                                                                    value={rule.description}
                                                                    class="col-span-3"
                                                                />
                                                            </div>
                                                            <div
                                                                class="grid grid-cols-4 items-center gap-4"
                                                            >
                                                                <Label
                                                                    for="active"
                                                                    class="text-right"
                                                                >
                                                                    Active
                                                                </Label>
                                                                <Switch
                                                                    id="active"
                                                                    name="active"
                                                                    checked={rule.active}
                                                                />
                                                            </div>
                                                            <div
                                                                class="grid grid-cols-4 items-center gap-4"
                                                            >
                                                                <Label
                                                                    class="text-right"
                                                                    >Created By</Label
                                                                >
                                                                <span
                                                                    class="col-span-3"
                                                                    >{rule
                                                                        .createdBy
                                                                        .name}</span
                                                                >
                                                            </div>
                                                            <div
                                                                class="grid grid-cols-4 items-center gap-4"
                                                            >
                                                                <Label
                                                                    class="text-right"
                                                                    >Created At</Label
                                                                >
                                                                <span
                                                                    class="col-span-3"
                                                                >
                                                                    {new Date(
                                                                        rule.createdAt,
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <Dialog.Footer>
                                                            <Button
                                                                disabled={loading.edit}
                                                                type="submit"
                                                            >
                                                                {loading.edit
                                                                    ? "Saving..."
                                                                    : "Save rule"}
                                                            </Button>
                                                        </Dialog.Footer>
                                                    </form>
                                                </Dialog.Content>
                                            </Dialog.Root>
                                        </Table.Cell>

                                        <Table.Cell>{rule.name}</Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                variant={rule.active
                                                    ? "default"
                                                    : "outline"}
                                            >
                                                {rule.active
                                                    ? "active"
                                                    : "inactive"}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell
                                            >{rule.createdBy.name}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{new Date(
                                                rule.createdAt,
                                            ).toLocaleDateString()}</Table.Cell
                                        >
                                        <Table.Cell>
                                            <Dialog.Root
                                                bind:open={dialogOpenState.delete}
                                            >
                                                <Dialog.Trigger
                                                    asChild
                                                    let:builder
                                                >
                                                    <Button
                                                        builders={[builder]}
                                                        size="icon"
                                                        class="!text-destructive h-8 w-8"
                                                        variant="ghost"
                                                    >
                                                        <Trash2
                                                            class="h-4 w-4"
                                                        />
                                                    </Button>
                                                </Dialog.Trigger>
                                                <Dialog.Content
                                                    class="sm:max-w-[425px]"
                                                >
                                                    <Dialog.Header>
                                                        <Dialog.Title>
                                                            Delete rule
                                                        </Dialog.Title>
                                                        <Dialog.Description>
                                                            Are you sure you
                                                            want to delete rule
                                                            '{rule.name}'?
                                                        </Dialog.Description>
                                                    </Dialog.Header>
                                                    <Dialog.Footer>
                                                        <form
                                                            action="?/delete"
                                                            use:enhance={createOnSubmitFunc(
                                                                "delete",
                                                            )}
                                                            method="POST"
                                                        >
                                                            <input
                                                                type="hidden"
                                                                name="id"
                                                                value={rule.id}
                                                            />
                                                            <Button
                                                                variant="destructive"
                                                                disabled={loading.delete}
                                                                type="submit"
                                                            >
                                                                {loading.delete
                                                                    ? "Deleting..."
                                                                    : "Delete rule"}
                                                            </Button>
                                                        </form>
                                                    </Dialog.Footer>
                                                </Dialog.Content>
                                            </Dialog.Root>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        {/if}
                    </Table.Root>
                {/if}
            </Card.Content>
        </Card.Root>
        <div class="flex justify-between items-center">
            <div class="text-muted-foreground text-xs">
                Showing <strong>1-{total < 10 ? total : 10}</strong> of
                <strong>{total}</strong> rules
            </div>
            <div>
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </div>
    </div>
</PageContainer>
