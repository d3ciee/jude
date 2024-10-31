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

    import FilesTab from "./_components/files-tab";
    import CostAnalysisTab from "./_components/cost-analysis-tab";
    import SocialAnalysisTab from "./_components/social-analysis-tab";

    import type {
        GptProviderResponse,
        GptSocialProfilerResponse,
    } from "$lib/types";
    import ProviderAnalysisTab from "./_components/provider-analysis-tab/provider-analysis-tab.svelte";
    import DescisionTab from "./_components/descision-tab";
    const { data } = $props();
    let claim:
        | (TClaim & {
              files: TFile[];
              socialProfile?: GptSocialProfilerResponse["extractedData"];
              providerProfile?: GptProviderResponse["extractedData"];
          })
        | null = $state(null);

    $effect(() => {
        if (!data.props.success) {
            toast.error("Failed to get claim", {
                description: data.props.error,
            });
            return;
        }
        //@ts-ignore
        claim = data.props.data.claim;
    });
</script>

<PageContainer>
    <div class="w-full h-full p-6 gap-6 flex flex-col overflow-auto">
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
                        <Tabs.Trigger value="attached-files"
                            >Attached files</Tabs.Trigger
                        >
                        <Tabs.Trigger value="cost-analysis"
                            >Cost analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="social-analysis"
                            >Social analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="provider-analysis"
                            >Provider analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="descision">Descision</Tabs.Trigger>
                    </Tabs.List>

                    <FilesTab files={claim.files} />
                    <CostAnalysisTab />
                    <SocialAnalysisTab socialProfile={claim.socialProfile} />
                    <ProviderAnalysisTab />
                    <DescisionTab />
                </Tabs.Root>
            {/if}
        </div>
    </div>
</PageContainer>
