<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/ui/button";
  import { Card } from "$lib/ui/card";
  import { Progress } from "$lib/ui/progress";
  import { Alert, AlertDescription, AlertTitle } from "$lib/ui/alert";
  import { Badge } from "$lib/ui/badge";
  import { Skeleton } from "$lib/ui/skeleton";
  import Upload from "lucide-svelte/icons/upload";
  import { onDestroy } from "svelte";
  import PageContainer from "../../_components/page-container";
  import type { GptResponse } from "$lib/types";
  import { toast } from "$lib/ui/sonner";

  let loading = false;
  let result: Result<GptResponse> | null = null;
  let fileName: string | null = null;
  let progressValue = 0;
  let progressInterval: ReturnType<typeof setInterval>;

  function startProgressSimulation() {
    progressValue = 0;
    progressInterval = setInterval(() => {
      progressValue += 10;
      if (progressValue >= 100) {
        clearInterval(progressInterval);
      }
    }, 1000);
  }

  function stopProgressSimulation() {
    clearInterval(progressInterval);
    progressValue = 0;
  }

  onDestroy(() => {
    clearInterval(progressInterval);
  });

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      fileName = input.files[0].name;
    }
  }
</script>

<PageContainer title="Claims Analysis">
  <div class="flex gap-4 p-4 h-full">
    <!-- Upload Section -->
    <Card class="flex-1 p-6">
      <form
        method="POST"
        action="?/analyze"
        enctype="multipart/form-data"
        use:enhance={() => {
          loading = true;
          startProgressSimulation();
          return async ({ result: formResult }) => {
            stopProgressSimulation();
            console.log(formResult);
            loading = false;

            if (formResult.type === "success" && formResult.data !== null) {
              console.log(result);
              result = formResult.data as Result<GptResponse>;
              if (result.success) {
                toast.success("Document analyzed successfully");
              }
            } else {
              toast.error("Something went wrong");
            }
          };
        }}
        class="space-y-4"
      >
        <div
          class="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12"
        >
          <Upload class="w-12 h-12 text-muted-foreground mb-4" />
          <input
            type="file"
            name="file"
            id="file"
            class="hidden"
            accept=".pdf,.doc,.docx"
            on:change={handleFileSelect}
          />
          <label
            for="file"
            class="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
          >
            {fileName ? fileName : "Click to upload or drag and drop"}
          </label>
        </div>

        <Button type="submit" disabled={loading || !fileName} class="w-full">
          {loading ? "Analyzing..." : "Analyze Document"}
        </Button>

        {#if loading}
          <Progress value={progressValue} class="w-full" />
        {/if}

        {#if result !== null && !result.success}
          <Alert variant="destructive">
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        {/if}
      </form>
    </Card>

    <!-- Analysis Results -->
    <Card class="flex-1 p-6">
      <h3 class="text-lg font-semibold mb-4">Analysis Results</h3>
      {#if loading}
        <div class="space-y-6">
          <div>
            <Skeleton class="h-6 w-32 mb-4" />
            <div class="grid grid-cols-2 gap-4">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
            </div>
          </div>
          <div>
            <Skeleton class="h-6 w-32 mb-4" />
            <div class="grid grid-cols-2 gap-4">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-full" />
            </div>
          </div>
          <div>
            <Skeleton class="h-6 w-32 mb-4" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-3/4" />
            </div>
          </div>
        </div>
      {:else if result !== null && result.success && result.data.isValid && result.data.analysis !== null}
        <div class="space-y-6">
          <!-- Claimant Info -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Claimant Information</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>Name: {result.data.analysis.claimant.name}</div>
              <div>Age: {result.data.analysis.claimant.age}</div>
            </div>
          </div>

          <!-- Claim Details -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Claim Details</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>Date: {result.data.analysis.claimDetails.submissionDate}</div>
              <div>Type: {result.data.analysis.claimDetails.treatmentType}</div>
              <div>Provider: {result.data.analysis.claimDetails.healthcareProvider}</div>
              <div>Amount: ${result.data.analysis.claimDetails.claimAmount}</div>
              <div>Location: {result.data.analysis.claimDetails.location}</div>
            </div>
          </div>

          <!-- Fraud Detection -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Risk Assessment</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div>Trust Score:</div>
                <Progress
                  value={result.data.analysis.fraudDetection.trustabilityScore}
                  class="w-32"
                />
                <span class="text-sm"
                  >{result.data.analysis.fraudDetection.trustabilityScore}%</span
                >
              </div>
              {#if result.data.analysis.fraudDetection.flags.length > 0}
                <div class="flex gap-2 flex-wrap">
                  {#each result.data.analysis.fraudDetection.flags as flag}
                    <Badge variant="destructive">{flag}</Badge>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <!-- Rule Violations -->
          {#if result.data.analysis.ruleViolations.length > 0}
            <div>
              <h4 class="text-sm font-semibold mb-2">Rule Violations</h4>
              <div class="space-y-2">
                {#each result.data.analysis.ruleViolations as violation}
                  <Alert variant="destructive">
                    <AlertTitle>{violation.rule}</AlertTitle>
                    <AlertDescription>{violation.description}</AlertDescription>
                  </Alert>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Metrics -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Processing Metrics</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                Est. Processing Time: {result.data.analysis.metrics.estimatedPayoutTime}
              </div>
              <div>
                Potential Savings: ${result.data.analysis.metrics.potentialSavings}
              </div>
              {#if result.data.analysis.metrics.humanInterventionRequired}
                <div class="col-span-2">
                  <Badge>Requires Manual Review</Badge>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {:else if result !== null && result.success && !result.data.isValid}
        <div>
          <Alert variant="destructive">
              The uploaded document could not be processed. Please check the file format and try again.
          </Alert>
        </div>
      {:else}
        <div class="text-muted-foreground text-center">
          Upload a document to see the analysis
        </div>
      {/if}
    </Card>
  </div>
</PageContainer>