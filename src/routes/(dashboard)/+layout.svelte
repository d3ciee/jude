<script lang="ts">
    import Sidebar from "./_components/sidebar/sidebar.svelte";

    const {children} = $props();
</script>

<div class="flex items-stretch h-screen overflow-hidden">
    <Sidebar/>
    <div class="w-full h-full">
        {@render children()}
    </div>
</div>
