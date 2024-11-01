<script lang="ts">
    import * as Card from "$lib/ui/card";
    import { Progress } from "$lib/ui/progress";
    import { Alert } from "$lib/ui/alert";
    import { Button } from "$lib/ui/button";
    import { Badge } from "$lib/ui/badge";
    import PageContainer from "../../(dashboard)/_components/page-container/index.js";

    const { data } = $props();
    let member = $state(null);

    // Initialize member data or show error if fetch failed
    $effect(() => {
        if (!data.props.success) {
            toast.error("Failed to load member data", {
                description: data.props.error,
            });
            return;
        }
        member = data.props.data.member;
    });
</script>

<PageContainer>
    <div class="container mx-auto max-w-7xl p-4 md:p-8 space-y-8">
        {#if member}
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Sidebar with Member Profile and Alerts -->
                <aside class="space-y-8">
                    <!-- Member Profile Card -->
                    <Card.Root class="bg-card">
                        <Card.Header class="pb-4">
                            <div class="flex items-center gap-4">
                                <div
                                    class="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
                                >
                                    <span
                                        class="text-2xl font-semibold text-primary"
                                        >{member.name[0]}</span
                                    >
                                </div>
                                <div>
                                    <Card.Title class="text-xl"
                                        >{member.name}</Card.Title
                                    >
                                    <Card.Description>
                                        Member #{member.membershipNumber}
                                    </Card.Description>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Content>
                            <div class="space-y-3">
                                <div class="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="text-muted-foreground"
                                        ><path
                                            d="M22 20v-7.826a4 4 0 0 0-1.253-2.908l-7.373-6.968a2 2 0 0 0-2.748 0L3.253 9.266A4 4 0 0 0 2 12.174V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
                                        /></svg
                                    >
                                    <span class="text-sm">{member.email}</span>
                                </div>
                            </div>
                        </Card.Content>
                    </Card.Root>

                    <!-- Alerts Section -->
                    {#if member.alerts?.length}
                        <section class="space-y-2">
                            <h3 class="text-lg font-semibold">Alerts</h3>
                            <div class="space-y-2">
                                {#each member.alerts as alert}
                                    <Alert variant={alert.type}>
                                        <p>{alert.message}</p>
                                        <span
                                            class="text-xs text-muted-foreground"
                                            >{alert.date}</span
                                        >
                                    </Alert>
                                {/each}
                            </div>
                        </section>
                    {/if}
                </aside>

                <!-- Main Content for Claims -->
                <main class="col-span-2 space-y-8">
                    <!-- Claims Header -->
                    <header class="flex items-center justify-between">
                        <h2 class="text-2xl font-semibold">Your Claims</h2>
                        <Button variant="default" size="sm">New Claim</Button>
                    </header>

                    <!-- Claims Grid Layout -->
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {#each member.claims as claim}
                            <Card.Root
                                class="hover:shadow-md transition-shadow"
                            >
                                <Card.Header
                                    class="flex items-center justify-between pb-2"
                                >
                                    <Card.Title class="text-sm font-medium">
                                        Claim #{claim.id}
                                    </Card.Title>
                                    <Badge
                                        variant={claim.status === "completed"
                                            ? "default"
                                            : "secondary"}
                                    >
                                        {claim.status}
                                    </Badge>
                                </Card.Header>
                                <Card.Content>
                                    <div class="space-y-4">
                                        <!-- Claim Details -->
                                        <div class="grid gap-2">
                                            <p>
                                                <strong>Type:</strong>
                                                {claim.type}
                                            </p>
                                            <p>
                                                <strong>Amount:</strong>
                                                ${claim.amount}
                                            </p>
                                            <p>
                                                <strong>Submitted:</strong>
                                                {claim.submittedDate}
                                            </p>
                                        </div>

                                        <!-- Progress Bar -->
                                        <div class="space-y-2">
                                            <div
                                                class="flex justify-between text-sm text-muted-foreground"
                                            >
                                                <span>Progress</span>
                                                <span>{claim.progress}%</span>
                                            </div>
                                            <Progress
                                                value={claim.progress}
                                                class="h-2"
                                            />
                                        </div>

                                        <!-- Actions -->
                                        <div class="flex justify-end gap-2">
                                            <Button variant="outline" size="sm"
                                                >View Details</Button
                                            >
                                            {#if claim.status === "completed"}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    >Rate Service</Button
                                                >
                                            {:else}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    >Contest Claim</Button
                                                >
                                            {/if}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        {/each}
                    </div>
                </main>
            </div>
        {/if}
    </div>
</PageContainer>
