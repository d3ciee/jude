<script lang="ts">
    import { onMount } from "svelte";

    let iframe: HTMLIFrameElement;
    const { fileName }: { fileName: string } = $props();

    onMount(async () => {
        const url = `https://pub-3d4d614658744eaaba570c12de083c1c.r2.dev/${fileName}`;
        try {
            const blob = new Blob([await (await fetch(url)).blob()], {
                type: "application/pdf",
            });
            iframe.src = URL.createObjectURL(blob);
        } catch (error) {
            console.error("Error loading PDF:", error);
        }
    });
</script>

<iframe
    bind:this={iframe}
    class="w-full bg-secondary aspect-video"
    title={fileName}
    frameborder="0"
></iframe>
