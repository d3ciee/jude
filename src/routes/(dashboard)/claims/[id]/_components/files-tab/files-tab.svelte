<script lang="ts">
    import FileText from "lucide-svelte/icons/file-text";
    import Info from "lucide-svelte/icons/info";
    import ThumbsDown from "lucide-svelte/icons/thumbs-down";
    import ThumbsUp from "lucide-svelte/icons/thumbs-up";

    import type { TFile } from "$lib/server/db/schema";
    import * as Accordion from "$lib/ui/accordion";
    import { Button } from "$lib/ui/button";
    import { ScrollArea } from "$lib/ui/scroll-area";
    import { toast } from "$lib/ui/sonner";
    import * as Tabs from "$lib/ui/tabs";
    import formatFileSize from "$lib/utils/format-file-size";

    const { files }: { files: TFile[] } = $props();
</script>

<Tabs.Content value="attached-files" class="mt-3">
    <Accordion.Root class="w-full">
        {#each files as file, i}
            <Accordion.Item value="item-{i}">
                <Accordion.Trigger
                    class="flex items-center justify-between px-6 py-3 hover:bg-gray-100 rounded-lg transition mb-2"
                >
                    <span class="flex items-center gap-3 text-left flex-1">
                        <FileText class="h-5 w-5 " />
                        <span class="font-medium">
                            {i + 1}. {file.name} ({formatFileSize(file.size)})
                        </span>
                    </span>
                    <span class="text-gray-600">
                        {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                </Accordion.Trigger>

                <Accordion.Content
                    class="min-h-max bg-muted/40 rounded-lg shadow-sm border mb-3 mx-6 p-4"
                >
                    <div class="flex gap-6 h-[450px] w-full">
                        <img
                            src={`https://pub-3d4d614658744eaaba570c12de083c1c.r2.dev/${file.fileStorageKey}`}
                            alt={file.name}
                            class="bg-secondary object-contain h-full rounded-md shadow-sm border"
                        />

                        <div class="flex-1">
                            <h3
                                class="text-lg font-semibold mb-2 flex justify-between items-center"
                            >
                                <span class="text-primary-700"
                                    >Extracted Data</span
                                >
                                <span class="flex gap-2">
                                    <Button
                                        size="icon"
                                        onclick={() => {
                                            toast.info("feedback received", {
                                                description:
                                                    "I'll try make it more like this next time",
                                            });
                                        }}
                                        class="h-8 w-8"
                                        variant="outline"
                                    >
                                        <ThumbsUp
                                            class="h-4 w-4 text-gray-500 hover:text-primary-600 transition"
                                        />
                                    </Button>
                                    <Button
                                        size="icon"
                                        class="h-8 w-8"
                                        onclick={() => {
                                            toast.info("feedback received", {
                                                description:
                                                    "I'll try make it better next time",
                                            });
                                        }}
                                        variant="outline"
                                    >
                                        <ThumbsDown
                                            class="h-4 w-4 text-gray-500 hover:text-primary-600 transition"
                                        />
                                    </Button>
                                </span>
                            </h3>

                            <ScrollArea class="h-full overflow-y-auto pb-6">
                                <dl
                                    class="grid grid-cols-2 gap-5 p-4 bg-gray-50 rounded-lg shadow-sm text-sm"
                                >
                                    {#each Object.entries(file.extractedData ? file.extractedData : { "File Name": file.name, "File Size": formatFileSize(file.size), "Created At": new Date(file.createdAt).toLocaleDateString() }) as [key, value]}
                                        <dt
                                            class="font-medium text-gray-800 flex items-center gap-2"
                                        >
                                            <span>{key}:</span>
                                        </dt>

                                        <dd class="text-gray-700 rounded-md">
                                            {#if Array.isArray(value)}
                                                {#each value as v}
                                                    <div
                                                        class="w-full flex flex-col gap-1 bg-gray-100 p-3 rounded-md border border-gray-200 mb-2"
                                                    >
                                                        {#if typeof v === "object"}
                                                            {#each Object.entries(v) as [k, val]}
                                                                <span
                                                                    class="text-sm text-gray-800 flex items-center gap-1"
                                                                >
                                                                    <span
                                                                        class="font-semibold"
                                                                        >{k}:</span
                                                                    >
                                                                    {val}
                                                                </span>
                                                            {/each}
                                                        {:else}
                                                            <span
                                                                class="text-sm text-gray-800 flex items-center gap-1"
                                                            >
                                                                <Info
                                                                    class="text-primary-500 h-4 w-4"
                                                                />
                                                                {v}
                                                            </span>
                                                        {/if}
                                                    </div>
                                                {/each}
                                            {:else}
                                                <span
                                                    class="text-sm text-gray-800 flex items-center gap-1"
                                                >
                                                    <Info
                                                        class="text-primary-500 h-4 w-4"
                                                    />
                                                    {value}
                                                </span>
                                            {/if}
                                        </dd>
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
