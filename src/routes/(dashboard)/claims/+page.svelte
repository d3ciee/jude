<script lang="ts">
    import PageContainer from "../_components/page-container";

    import { Badge } from "$lib/ui/badge";
    import { Button } from "$lib/ui/button";
    import * as Card from "$lib/ui/card";
    
    import * as Table from "$lib/ui/table";

    import CircleFadingPlus from "lucide-svelte/icons/circle-fading-plus";
    import Loader from "lucide-svelte/icons/loader";
    import { toast } from "$lib/ui/sonner";
    import type { SubmitFunction } from "./$types.js";
    import { invalidate, invalidateAll } from "$app/navigation";
    import ClaimApplicationDialog from "../_components/claim-application-dialog";
    import type { TClaim } from "$lib/server/db/schema";

    const { data } = $props();

    let claims: Array<TClaim & { files: number }> | null = $state(null);
    let total = $state(0);

    $effect(() => {
        if (!data.props.success) {
            toast.error("Failed to get claims", {
                description: data.props.error,
            });
            return;
        }
        claims = data.props.data.claims;
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

<PageContainer>
    <div class="w-full h-full p-6 flex flex-col gap-6">
        <div class="flex justify-between">
            <div class="grid gap-1.5">
                <h1
                    class="text-lg font-semibold leading-none tracking-tight space-y-1.5"
                >
                    Claims
                </h1>
                <p class="text-muted-foreground text-sm">
                    Manage and view claims that you have received
                </p>
            </div>
            <div>
                <ClaimApplicationDialog>
                    {#snippet trigger(attrs:any)}
                    <Button size="sm" {...attrs}>
                        <CircleFadingPlus class="h-4 w-4 mr-2" />
                        New application</Button
                    >
                    {/snippet}
                </ClaimApplicationDialog>
            </div>
        </div>
        <Card.Root class="p-0 h-full">
            <Card.Content class="p-0 h-full">
                {#if !claims}
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
                                <Table.Head>Approval status</Table.Head>
                                <Table.Head>Processing step</Table.Head>
                                <Table.Head>Membership Number</Table.Head>
                                <Table.Head>Submitted by</Table.Head>
                                <Table.Head>Submission channel</Table.Head>
                                <Table.Head>Number of files</Table.Head>
                                <Table.Head>Created at</Table.Head>
                                
                            </Table.Row>
                        </Table.Header>
                        {#if claims.length === 0}
                            <Table.Body class="h-64">
                                <div
                                    class="absolute top-12 items-center p-10 w-full justify-center text-center"
                                >
                                    you do not have any claims.
                                </div>
                            </Table.Body>
                        {:else}
                            <Table.Body class="h-fit">
                                {#each claims as claim (claim.id)}
                                    <Table.Row class="h-fit">
                                        <Table.Cell>
                                            <a href="/claims/{claim.id}" class="underline underline-offset-4 hover:text-primary cursor-pointer">
                                                {claim.id}
                                            </a>
                                        </Table.Cell>

                                        <Table.Cell>                                     
                                            <Badge variant="outline">
                                                {claim.status}
                                            </Badge>                              
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                variant={"outline"}
                                            >
                                                {claim.procesingStep}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell
                                        >{claim.membershipNumber}</Table.Cell
                                    >
                                        <Table.Cell
                                            >{claim.submittedBy}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{claim.submissionChannel}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{claim.files}</Table.Cell
                                        >
                                        <Table.Cell
                                            >{new Date(
                                                claim.createdAt,
                                            ).toLocaleDateString()}</Table.Cell
                                        >
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
