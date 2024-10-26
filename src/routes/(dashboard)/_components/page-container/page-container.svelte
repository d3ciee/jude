<script lang="ts">
    import { Button } from "$lib/ui/button";

    import Settings from "lucide-svelte/icons/settings";
    import Bell from "lucide-svelte/icons/bell";
    import CircleHelp from "lucide-svelte/icons/circle-help";
    import type { Snippet } from "svelte";

    type Props = {
        title: string;
        children: Snippet;
        actions?: Snippet;
    };

    const {title, children, actions}:Props = $props();
</script>

<div class="w-full h-screen flex flex-col">
    <div class="flex h-[52px] justify-between p-2 border-b bg-muted/40">
        <div class="flex items-center">
            <h1 class="text font-semibold pl-3">{title}</h1>
        </div>

        <div class="flex gap-2">
            <div class="flex gap-2">
                {#if actions}
                    {@render actions()}
                {/if}
            </div>
            <div class="border-l h-full mx-3 mr-1"></div>
            <div class="flex">
                <Button variant="ghost" size="icon" class="w-8 h-8">
                    <CircleHelp class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" class="w-8 h-8">
                    <Settings class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" class="w-8 h-8">
                    <Bell class="h-4 w-4" />
                </Button>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-y-4 w-full h-[calc(100%-52px)] flex-1 min-h-0">
        {@render children()}
    </div>
</div>
