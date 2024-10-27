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

    const {title, children}:Props = $props();
</script>

<div class="w-full h-screen flex flex-col">
    <div class="flex flex-col gap-y-4 w-full h-[calc(100%-52px)] flex-1 ">
        {@render children()}
    </div>
</div>
