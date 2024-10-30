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
    import PdfViewer from "./_components/pdf-viewer";
    import { ScrollArea } from "$lib/ui/scroll-area";

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
                Claim with ID: {claim?.id} for member {claim?.membershipNumber}
            </h1>
            <p class="text-muted-foreground text-sm">
                Manage and view claim: {claim?.id}
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
                        <Tabs.Trigger value="socail-analysis"
                            >Social analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="risk-analysis"
                            >Risk analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="section-4">Section 4</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="summary" class="mt-3"
                        >stuff</Tabs.Content
                    >
                    <Tabs.Content value="attached-files" class="mt-3">
                        <Accordion.Root class="w-full">
                            {#each claim.files as file, i}
                                <Accordion.Item value="item-{i}">
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
                                            class="grid gap-6 grid-cols-3 h-full w-full"
                                        >
                                            <div class="col-span-2">
                                                {#if file.name.endsWith(".pdf")}
                                                    <PdfViewer
                                                        fileName={file.fileStorageKey}
                                                    />
                                                {:else if ["png", "gif", "jpeg", "jpg", "webp"].includes(file.name
                                                        .split(".")[1]
                                                        .toLowerCase())}
                                                    <img
                                                        src={`https://pub-3d4d614658744eaaba570c12de083c1c.r2.dev/${file.fileStorageKey}`}
                                                        alt={file.name}
                                                        class="w-full bg-secondary aspect-video object-contain"
                                                    />
                                                {:else}
                                                    <div
                                                        class="flex items-center justify-center w-full bg-secondary aspect-video"
                                                    >
                                                        <Paperclip
                                                            class="h-12 w-12 text-primary"
                                                        />
                                                    </div>
                                                {/if}
                                            </div>
                                            <div class="col-span-1">
                                                <h3
                                                    class="text-lg font-semibold mb-2"
                                                >
                                                    Extracted Data
                                                </h3>
                                                <ScrollArea class="h-full">
                                                    <dl
                                                        class="grid grid-cols-2 gap-2 text-sm"
                                                    >
                                                        {#each Object.entries(file.extractedData ? file.extractedData : { "File Name": file.name, "File Size": formatFileSize(file.size), "Created At": new Date(file.createdAt).toLocaleDateString() }) as [key, value]}
                                                            <dt
                                                                class="font-medium"
                                                            >
                                                                {key}:
                                                            </dt>
                                                            <dd>{value}</dd>
                                                        {/each}
                                                    </dl>
                                                </ScrollArea>
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
