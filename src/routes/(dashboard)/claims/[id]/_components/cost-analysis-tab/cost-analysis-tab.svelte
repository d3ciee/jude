<script lang="ts">
    import { Badge } from "$lib/ui/badge";
    import * as Card from "$lib/ui/card";
    import { Progress } from "$lib/ui/progress";
    import * as Tabs from "$lib/ui/tabs";
    import DollarSign from "lucide-svelte/icons/dollar-sign";
    import BarChart2 from "lucide-svelte/icons/chart-bar";
    import TrendingUp from "lucide-svelte/icons/trending-up";
    import CheckCircle from "lucide-svelte/icons/circle-check";
    import AlertCircle from "lucide-svelte/icons/circle-alert";
    import { Activity, FileText } from "lucide-svelte";

    const defaultTotalCost = 1125;
    const defaultBreakdown = {
        consultation: 0,
        medication: 0,
        procedures: 998.59,
        laboratory: 780.6,
        other: 178.78,
    };

    const defaultReasonablenessScore = 0.7;
    const defaultMarketComparison = {
        percentileRank: 70,
        averageCost: 1050,
        variance: 7.14,
    };

    const defaultFlags = {
        overpriced: false,
        missingItems: true,
        inconsistencies: false,
    };

    const defaultHistoricalComparison = {
        lastThreeClaims: [1050.0, 1200.0, 1150.0],
        averageLastClaims: 1133.33,
    };

    let claim: any = {};
</script>

<Tabs.Content value="cost-analysis" class="mt-3">
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <!-- Cost Summary -->
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    <DollarSign
                        class="inline-block mr-2 text-primary-500 size-4"
                    /> Cost Summary
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="text-center">
                    <h3 class="font-semibold text-lg text-gray-600">
                        Total Claimed Cost
                    </h3>
                    <p class="text-3xl font-extrabold text-primary-500">
                        ${claim.costAnalysis?.totalCost ?? defaultTotalCost}
                    </p>
                </div>
                <p class="text-sm text-muted-foreground mt-4 text-center">
                    An analysis comparing the submitted claim against market
                    rates and historical data.
                </p>
            </Card.Content>
        </Card.Root>

        <!-- Category Breakdown -->
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    <BarChart2
                        class="inline-block mr-2 text-primary-500 size-4"
                    /> Category Breakdown
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <dl class="space-y-3 text-gray-800">
                    {#each Object.entries(defaultBreakdown) as [category, amount]}
                        <div class="flex justify-between items-center py-1">
                            <dt class="text-gray-600 font-medium">
                                {category.charAt(0).toUpperCase() +
                                    category.slice(1)}
                            </dt>
                            <dd class="text-gray-900 font-semibold">
                                ${claim.costAnalysis?.breakdown[category] ??
                                    amount}
                            </dd>
                        </div>
                    {/each}
                </dl>
            </Card.Content>
        </Card.Root>

        <!-- Reasonableness Score -->
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    <CheckCircle
                        class="inline-block mr-2 text-primary-500 size-4"
                    /> Reasonableness Score
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <Progress
                    value={(claim.costAnalysis?.reasonableness.score ??
                        defaultReasonablenessScore) * 100}
                    class="w-full"
                />
                <p class="text-sm text-muted-foreground mt-1 text-center">
                    {(
                        (claim.costAnalysis?.reasonableness.score ??
                            defaultReasonablenessScore) * 100
                    ).toFixed(1)}% reasonable
                </p>
                <p class="text-xs text-muted-foreground mt-3 text-center">
                    Confidence Level: {(claim.costAnalysis?.reasonableness
                        .score ?? defaultReasonablenessScore) >= 0.8
                        ? "High"
                        : "Moderate"}
                </p>
            </Card.Content>
        </Card.Root>

        <!-- Market Comparison -->
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    <TrendingUp
                        class="inline-block mr-2 text-primary-500 size-4"
                    /> Market Comparison
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <dl class="space-y-3 text-gray-800">
                    <div class="flex justify-between items-center">
                        <dt class="text-gray-600 font-medium">Percentile</dt>
                        <dd class="text-gray-900 font-semibold">
                            {claim.costAnalysis?.marketComparison
                                .percentileRank ??
                                defaultMarketComparison.percentileRank}th
                        </dd>
                    </div>
                    <div class="flex justify-between items-center">
                        <dt class="text-gray-600 font-medium">
                            Market Average
                        </dt>
                        <dd class="text-gray-900 font-semibold">
                            ${claim.costAnalysis?.marketComparison
                                .averageCost ??
                                defaultMarketComparison.averageCost}
                        </dd>
                    </div>
                    <div class="flex justify-between items-center">
                        <dt class="text-gray-600 font-medium">Variance</dt>
                        <dd class="text-gray-900 font-semibold">
                            {claim.costAnalysis?.marketComparison.variance ??
                                defaultMarketComparison.variance}%
                        </dd>
                    </div>
                </dl>
            </Card.Content>
        </Card.Root>

        <!-- Historical Comparison -->
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    <FileText
                        class="inline-block mr-2 text-primary-500 size-4"
                    /> Historical Comparison
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <p class="text-sm text-gray-600">Average of Last Claims</p>
                <p class="text-xl font-bold text-gray-900 mb-4">
                    ${defaultHistoricalComparison.averageLastClaims.toFixed(2)}
                </p>
                <p class="text-xs text-muted-foreground">
                    Comparison with previous three claims:
                </p>
                <ul class="mt-2 space-y-1">
                    {#each defaultHistoricalComparison.lastThreeClaims as amount}
                        <li class="text-gray-800 font-medium">
                            ${amount.toFixed(2)}
                        </li>
                    {/each}
                </ul>
            </Card.Content>
        </Card.Root>

        <!-- Flags & Insights -->
        <Card.Root>
            <Card.Header>
                <Card.Title>
                    <AlertCircle
                        class="inline-block mr-2 text-primary-500 size-4"
                    /> Flags & Insights
                </Card.Title>
            </Card.Header>
            <Card.Content>
                <div class="space-y-2 flex flex-wrap gap-2">
                    {#if claim.costAnalysis?.flags.overpriced ?? defaultFlags.overpriced}
                        <Badge variant="destructive">Overpriced</Badge>
                    {/if}
                    {#if claim.costAnalysis?.flags.missingItems ?? defaultFlags.missingItems}
                        <Badge variant="default">Missing Items</Badge>
                    {/if}
                    {#if claim.costAnalysis?.flags.inconsistencies ?? defaultFlags.inconsistencies}
                        <Badge variant="destructive">Inconsistencies</Badge>
                    {/if}
                </div>
                <p class="mt-4 text-sm text-muted-foreground">
                    Insights: Higher-than-average costs identified in medication
                    and laboratory categories. Verify documentation for detailed
                    breakdown.
                </p>
            </Card.Content>
        </Card.Root>
    </div>
</Tabs.Content>
