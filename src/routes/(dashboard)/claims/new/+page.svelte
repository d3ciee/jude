<script lang="ts">
  import { enhance } from "$app/forms";
  import { Button } from "$lib/ui/button";
  import { Card } from "$lib/ui/card";
  import { Progress } from "$lib/ui/progress";
  import { Alert, AlertDescription, AlertTitle } from "$lib/ui/alert";
  import { Badge } from "$lib/ui/badge";
  import { Skeleton } from "$lib/ui/skeleton";
  import PageContainer from "../../_components/page-container";
  import Upload from "lucide-svelte/icons/upload";
  import { onDestroy } from "svelte";

  let loading = false;
  let error: string | null = null;
  let analysis: any = null;
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
          error = null;
          startProgressSimulation();
          return async ({ result }) => {
            stopProgressSimulation();
            console.log(result);
            loading = false;
            if (result.type === "success") {
              analysis = result?.data?.analysis;
            } else {
              error = "Failed to analyze document";
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

        {#if error}
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
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
      {:else if analysis}
        <div class="space-y-6">
          <!-- Claimant Info -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Claimant Information</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>Name: {analysis.claimant.name}</div>
              <div>Age: {analysis.claimant.age}</div>
            </div>
          </div>

          <!-- Claim Details -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Claim Details</h4>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>Date: {analysis.claim_details.submission_date}</div>
              <div>Type: {analysis.claim_details.treatment_type}</div>
              <div>Provider: {analysis.claim_details.healthcare_provider}</div>
              <div>Amount: ${analysis.claim_details.claim_amount}</div>
              <div>Location: {analysis.claim_details.location}</div>
            </div>
          </div>

          <!-- Fraud Detection -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Risk Assessment</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <div>Trust Score:</div>
                <Progress
                  value={analysis.fraud_detection.trustability_score}
                  class="w-32"
                />
                <span class="text-sm"
                  >{analysis.fraud_detection.trustability_score}%</span
                >
              </div>
              {#if analysis.fraud_detection.flags.length > 0}
                <div class="flex gap-2 flex-wrap">
                  {#each analysis.fraud_detection.flags as flag}
                    <Badge variant="destructive">{flag}</Badge>
                  {/each}
                </div>
              {/if}
            </div>
          </div>

          <!-- Rule Violations -->
          {#if analysis.rule_violations.length > 0}
            <div>
              <h4 class="text-sm font-semibold mb-2">Rule Violations</h4>
              <div class="space-y-2">
                {#each analysis.rule_violations as violation}
                  <Alert variant="destructive">
                    <AlertTitle>{violation.rule.name}</AlertTitle>
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
                Est. Processing Time: {analysis.metrics.estimated_payout_time}
              </div>
              <div>
                Potential Savings: ${analysis.metrics.potential_savings}
              </div>
              {#if analysis.metrics.human_intervention_required}
                <div class="col-span-2">
                  <Badge>Requires Manual Review</Badge>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {:else}
        <div class="text-muted-foreground text-center">
          Upload a document to see the analysis
        </div>
      {/if}
    </Card>
  </div>
</PageContainer>
