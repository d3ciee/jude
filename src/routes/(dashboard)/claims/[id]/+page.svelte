<script lang="ts">
    import PageContainer from "../../_components/page-container";
    import Paperclip from "lucide-svelte/icons/paperclip";
    import X from "lucide-svelte/icons/x";

    import * as Tabs from "$lib/ui/tabs";
    import * as Accordion from "$lib/ui/accordion";

    import { Button } from "$lib/ui/button";
    import type { TClaim, TFile } from "$lib/server/db/schema";
    import { toast } from "$lib/ui/sonner";
    import formatFileSize from "$lib/utils/format-file-size";

    const { data } = $props();
    let claim: (TClaim & { files: TFile[] }) | null = $state(null);

    $effect(() => {
        if (!data.props.success) {
            toast.error("Failed to get claim", {
                description: data.props.error,
            });
            return;
        }
        claim = data.props.data.claim;
    });
</script>

<PageContainer>
    <div class="w-full h-full p-6 gap-6 flex flex-col">
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
        <div class="w-full h-full flex">
            {#if claim}
                <Tabs.Root value="attached-files" class="w-full ">
                    <Tabs.List class="grid w-full grid-cols-3 lg:grid-cols-6">
                        <Tabs.Trigger value="summary">Summary</Tabs.Trigger>
                        <Tabs.Trigger value="attached-files"
                            >Attached files</Tabs.Trigger
                        >
                        <Tabs.Trigger value="section-3">Section 3</Tabs.Trigger>
                        <Tabs.Trigger value="section-4">Section 4</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="summary" class="mt-3"
                        >stuff</Tabs.Content
                    >
                    <Tabs.Content value="attached-files" class="mt-3">
                        <Accordion.Root class="w-full">
                            {#each claim.files as file, i}
                                <Accordion.Item value="item-1">
                                    <Accordion.Trigger class="flex">
                                        <span class="flex-1 text-left px-6">
                                            {i + 1}. {file.name} ({formatFileSize(
                                                file.size,
                                            )})
                                        </span>
                                        <span class="px-6">
                                            {new Date(
                                                file.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </Accordion.Trigger>
                                    <Accordion.Content class="min-h-max">
                                        <div
                                            class="grid gap-6 grid-cols-3 h-full w-full bg-red-200"
                                        >
                                            <div class="col-span-2">
                                                {#if file.name.endsWith(".pdf")}
                                                    <iframe
                                                        class="w-full bg-secondary aspect-video"
                                                        title={file.name}
                                                        src="https://pub-3d4d614658744eaaba570c12de083c1c.r2.dev/{file.fileStorageKey}"
                                                        frameborder="0"
                                                    ></iframe>
                                                {/if}
                                            </div>
                                            <div class="col-span-1">
                                                extracted data goes here
                                            </div>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Item>
                            {/each}
                        </Accordion.Root>
                    </Tabs.Content>
                </Tabs.Root>
            {/if}
        </div>
    </div>
</PageContainer>
