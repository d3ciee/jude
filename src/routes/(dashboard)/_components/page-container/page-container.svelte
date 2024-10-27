<script lang="ts">
    import type { Snippet } from "svelte";
    
    type Props = {
        title: string;
        children: Snippet;
    };

    const {title, children}:Props = $props();
</script>

<div class="w-full h-screen flex flex-col">
    <div class="flex h-[52px] justify-between p-2 border-b bg-muted/40">
        <div class="flex items-center">
            <h1 class="text font-semibold pl-3">{title}</h1>
        </div>
    </div>

    <div class="flex flex-col gap-y-4 w-full h-[calc(100%-52px)] flex-1 ">
        {@render children()}
    </div>
</div>
