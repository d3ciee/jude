<script lang="ts">
    import { Button } from "$lib/ui/button";
    import { cn } from "$lib/ui/utils";
    import * as Tooltip from "$lib/ui/tooltip";

    import { page } from "$app/stores";

    const { isCollapsed, routes }: any = $props();

    let selected = $derived($page.url.pathname);
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4">
    <nav class="grid gap-1 group-[[data-collapsed=true]]:justify-center px-3">
        {#each routes as route}
            {#if isCollapsed}
                <Tooltip.Root openDelay={0}>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            href={route.path}
                            builders={[builder]}
                            variant={route.path === selected
                                ? "secondary"
                                : "ghost"}
                            size="icon"
                            class={cn(
                                "size-8",
                                route.path !== selected && "opacity-60",
                            )}
                        >
                            <svelte:component
                                this={route.icon}
                                class="size-4"
                                aria-hidden="true"
                            />
                            <span class="sr-only">{route.title}</span>
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                        side="right"
                        class="flex items-center gap-4"
                    >
                        {route.title}
                        {#if route.label}
                            <span class="text-muted-foreground ml-auto">
                                {route.label}
                            </span>
                        {/if}
                    </Tooltip.Content>
                </Tooltip.Root>
            {:else}
                <Button
                    href={route.path}
                    variant={route.path === selected ? "secondary" : "ghost"}
                    size="sm"
                    class={cn(
                        "justify-start p-2",
                        route.path === selected && "!bg-gray-200",
                    )}
                >
                    <svelte:component
                        this={route.icon}
                        class="mr-2 size-4"
                        aria-hidden="true"
                    />
                    {route.title}
                    {#if route.label}
                        <span
                            class={cn("ml-auto", {
                                "text-background": route.path !== selected,
                            })}
                        >
                            {route.label}
                        </span>
                    {/if}
                </Button>
            {/if}
        {/each}
    </nav>
</div>
