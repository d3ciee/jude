<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/ui/button";
  import { Input } from "$lib/ui/input";
  import { Card } from "$lib/ui/card";
  import { Progress } from "$lib/ui/progress";
  import Upload from "lucide-svelte/icons/upload";
  import { onDestroy } from "svelte";
  import PageContainer from "../../_components/page-container";
  import type {
    GptAnalysisResponse,
    GptOcrResponse,
    GptProviderResponse,
    GptSocialProfilerResponse,
  } from "$lib/types";
  import { toast } from "$lib/ui/sonner";

  let loading = false;
  let documentFileNames: string[] = [];
  let ocrFileName: string | null = null;
  let progressValue = 0;
  let progressInterval: ReturnType<typeof setInterval>;
  let name = "";
  let provider = "";

  let analysisResult: Result<GptAnalysisResponse> | null = $state(null);
  let ocrResult: Result<GptOcrResponse> | null = $state(null);
  let socialResult: Result<GptSocialProfilerResponse> | null = $state(null);
  let providerResult: Result<GptProviderResponse> | null = $state(null);

  function startProgressSimulation() {
    progressValue = 0;
    progressInterval = setInterval(() => {
      progressValue = Math.min(progressValue + 10, 95);
    }, 1000);
  }

  function stopProgressSimulation() {
    clearInterval(progressInterval);
    progressValue = 0;
  }

  onDestroy(() => {
    clearInterval(progressInterval);
  });

  function handleDocumentFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      documentFileNames = Array.from(target.files).map((f) => f.name);
    }
  }

  function handleOcrFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      ocrFileName = target.files[0].name;
    }
  }

  function createFormEnhancer(
    resultSetter: (result: any) => void,
    successMessage: string,
  ) {
    return () => {
      loading = true;
      startProgressSimulation();
      return async ({ result }) => {
        stopProgressSimulation();
        loading = false;
        if (result.type === "success") {
          resultSetter(result.data.result);
          if (result.data.result?.success) {
            toast.success(successMessage);
          }
        } else {
          toast.error("Operation failed");
        }
      };
    };
  }
</script>

<PageContainer title="OpenAI Service Testing">
  <div class="container mx-auto p-4 space-y-6">
    <!-- Service Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Document Analysis Card -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold mb-4">Document Analysis</h3>
        <form
          method="POST"
          action="?/analyze"
          enctype="multipart/form-data"
          use:enhance={createFormEnhancer(
            (result) => (analysisResult = result),
            "Document analyzed successfully",
          )}
          class="space-y-4"
        >
          <div
            class="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <Upload class="w-8 h-8 text-muted-foreground mb-3" />
            <input
              type="file"
              name="files"
              id="document-files"
              class="hidden"
              accept=".jpg,.jpeg,.png"
              multiple
              on:change={handleDocumentFileSelect}
            />
            <label
              for="document-files"
              class="text-sm text-muted-foreground cursor-pointer hover:text-foreground text-center"
            >
              {documentFileNames.length
                ? `Selected ${documentFileNames.length} files`
                : "Click to upload or drag and drop images"}
            </label>
          </div>
          <Button
            type="submit"
            disabled={loading || !documentFileNames.length}
            class="w-full"
          >
            {loading ? "Analyzing..." : "Analyze Document"}
          </Button>
        </form>
      </Card>

      <!-- OCR Testing Card -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold mb-4">OCR Testing</h3>
        <form
          method="POST"
          action="?/ocr"
          enctype="multipart/form-data"
          use:enhance={createFormEnhancer(
            (result) => (ocrResult = result),
            "OCR completed successfully",
          )}
          class="space-y-4"
        >
          <div
            class="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors"
          >
            <Upload class="w-8 h-8 text-muted-foreground mb-3" />
            <input
              type="file"
              name="file"
              id="ocr-file"
              class="hidden"
              accept=".jpg,.jpeg,.png"
              on:change={handleOcrFileSelect}
            />
            <label
              for="ocr-file"
              class="text-sm text-muted-foreground cursor-pointer hover:text-foreground text-center"
            >
              {ocrFileName || "Click to upload or drag and drop"}
            </label>
          </div>
          <Button
            type="submit"
            disabled={loading || !ocrFileName}
            class="w-full"
          >
            {loading ? "Processing..." : "Perform OCR"}
          </Button>
        </form>
      </Card>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Social Profiling Card -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold mb-4">Social Profiling</h3>
        <form
          method="POST"
          action="?/profileSocial"
          use:enhance={createFormEnhancer(
            (result) => (socialResult = result),
            "Social profile generated successfully",
          )}
          class="space-y-4"
        >
          <Input
            type="text"
            name="name"
            bind:value={name}
            placeholder="Enter name to profile"
            class="w-full"
          />
          <Button type="submit" disabled={loading || !name} class="w-full">
            {loading ? "Profiling..." : "Generate Social Profile"}
          </Button>
        </form>
      </Card>

      <!-- Provider Profiling Card -->
      <Card class="p-6">
        <h3 class="text-lg font-semibold mb-4">Provider Profiling</h3>
        <form
          method="POST"
          action="?/profileProvider"
          use:enhance={createFormEnhancer(
            (result) => (providerResult = result),
            "Provider profile generated successfully",
          )}
          class="space-y-4"
        >
          <Input
            type="text"
            name="provider"
            bind:value={provider}
            placeholder="Enter provider name"
            class="w-full"
          />
          <Button type="submit" disabled={loading || !provider} class="w-full">
            {loading ? "Profiling..." : "Generate Provider Profile"}
          </Button>
        </form>
      </Card>
    </div>

    <!-- Progress Bar -->
    {#if loading}
      <Progress value={progressValue} class="w-full" />
    {/if}

    <!-- Results Section -->
    {#if analysisResult || ocrResult || socialResult || providerResult}
      <Card class="p-6">
        <h3 class="text-lg font-semibold mb-4">Results</h3>
        <div class="overflow-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#if analysisResult}
              <div class="space-y-2">
                <h4 class="font-medium">Document Analysis Result:</h4>
                <pre class="bg-muted p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(analysisResult, null, 2)}
                </pre>
              </div>
            {/if}

            {#if ocrResult}
              <div class="space-y-2">
                <h4 class="font-medium">OCR Result:</h4>
                <pre class="bg-muted p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(ocrResult, null, 2)}
                </pre>
              </div>
            {/if}
          </div>
        </div>
      </Card>
    {/if}
  </div>
</PageContainer>
