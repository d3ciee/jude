<script lang="ts">
    import * as Tabs from "$lib/ui/tabs";
    import { Badge } from "$lib/ui/badge";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/ui/card";

    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
    } from "$lib/ui/table";
    import { CheckCircle, Clock, DollarSign, XCircle } from "lucide-svelte";
    import type { GptClaimAnalysisResponse } from "$lib/types";

    const dataD = {
        memberNumber: "X0123456789",
        patientName: "Doe, John",
        providerName: "XYZ Insurance Company",
        claimAmount: 500,
        approvedAmount: 0,
        rejectedAmount: 500,
        verdict: "rejected",
        flags: [
            {
                type: "ruleViolation",
                description: "Missing required provider signature",
                severity: "high",
            },
        ],
        ruleViolations: [
            {
                ruleId: "R001",
                description: "Provider signature missing",
                impact: "high",
                suggestedResolution: "Obtain signature from provider",
            },
        ],
        metrics: {
            processingTime: 5,
            numberOfServices: 1,
            averageServiceCost: 500,
            totalAmountClaimed: 500,
            totalAmountApproved: 0,
            totalAmountRejected: 500,
            supportingDocumentsReviewed: 0,
            missingSupportingDocuments: ["provider signature"],
        },
        adjustments: [],
        breakdown: [
            {
                serviceLine: 1,
                serviceDescription: "General medical service",
                claimedAmount: 500,
                approvedAmount: 0,
                rejectedAmount: 500,
                notes: "Claim rejected due to missing provider signature",
            },
        ],
        paymentDetails: {
            payableAmount: 0,
            reason: "Claim rejected due to missing provider signature",
            paymentStatus: "rejected",
            expectedPaymentDate: "",
        },
        humanInterventionRequired: true,
        summary:
            "The claim submitted by John Doe for services provided by XYZ Insurance Company was rejected due to a missing provider signature, which is a critical requirement for claim processing. No supporting documents were reviewed as the claim was not processed further. It is recommended to obtain the necessary signature from the provider and resubmit the claim for processing.",
    };

    let { analysis }: any = $props();

    const data = {
        ...dataD,
        ...analysis,
    };

    function getVerdictColor(verdict: string) {
        switch (verdict) {
            case "approved":
                return "bg-green-100 text-green-800";
            case "partially approved":
                return "bg-yellow-100 text-yellow-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    function getSeverityColor(severity: string) {
        switch (severity) {
            case "low":
                return "bg-blue-100 text-blue-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "high":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
</script>

<Tabs.Content value="descision" class="mt-3">
    <div class="h-full p-4 space-y-6">
        <header
            class="bg-white shadow rounded-lg p-6 flex justify-between items-center"
        >
            <div>
                <h1 class="text-2xl font-bold text-gray-900">
                    Claim Analysis Report
                </h1>
                <p class="text-gray-600">
                    Member: {data.memberNumber} | Patient: {data.patientName}
                </p>
            </div>
            <Badge class={`text-lg px-3 py-1 ${getVerdictColor(data.verdict)}`}>
                {data?.verdict.charAt(0).toUpperCase() + data.verdict.slice(1)}
            </Badge>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{data.summary}</p>
                {#if data.humanInterventionRequired}
                    <Badge variant="destructive" class="mt-2"
                        >Human Intervention Required</Badge
                    >
                {/if}
            </CardContent>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <CardTitle class="text-sm font-medium"
                        >Total Claimed</CardTitle
                    >
                    <DollarSign class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        ${data.claimAmount.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <CardTitle class="text-sm font-medium"
                        >Approved Amount</CardTitle
                    >
                    <CheckCircle class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        ${data.approvedAmount.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <CardTitle class="text-sm font-medium"
                        >Rejected Amount</CardTitle
                    >
                    <XCircle class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        ${data.rejectedAmount.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader
                    class="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                    <CardTitle class="text-sm font-medium"
                        >Processing Time</CardTitle
                    >
                    <Clock class="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        {data.metrics.processingTime} min
                    </div>
                </CardContent>
            </Card>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Flags</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-2">
                        {#each data.flags as flag, index}
                            <li class="flex items-center space-x-2">
                                <Badge class={getSeverityColor(flag.severity)}
                                    >{flag.severity}</Badge
                                >
                                <span>{flag.type}: {flag.description}</span>
                            </li>
                        {/each}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Rule Violations</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-2">
                        {#each data.ruleViolations as violation, index}
                            <li class="space-y-1">
                                <div class="flex items-center space-x-2">
                                    <Badge
                                        class={getSeverityColor(
                                            violation.impact,
                                        )}>{violation.impact}</Badge
                                    >
                                    <span class="font-semibold"
                                        >{violation.ruleId}: {violation.description}</span
                                    >
                                </div>
                                <p class="text-sm text-gray-600">
                                    Resolution: {violation.suggestedResolution}
                                </p>
                            </li>
                        {/each}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Service Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Line</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Claimed</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Rejected</TableHead>
                            <TableHead>Notes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {#each data.breakdown as service}
                            <TableRow>
                                <TableCell>{service.serviceLine}</TableCell>
                                <TableCell
                                    >{service.serviceDescription}</TableCell
                                >
                                <TableCell
                                    >${service.claimedAmount.toFixed(
                                        2,
                                    )}</TableCell
                                >
                                <TableCell
                                    >${service.approvedAmount.toFixed(
                                        2,
                                    )}</TableCell
                                >
                                <TableCell
                                    >${service.rejectedAmount.toFixed(
                                        2,
                                    )}</TableCell
                                >
                                <TableCell>{service.notes || "-"}</TableCell>
                            </TableRow>
                        {/each}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul class="space-y-2">
                        {#each data.adjustments as adjustment, index}
                            <li class="flex justify-between items-center">
                                <span
                                    >{adjustment.adjustmentType}: {adjustment.description}</span
                                >
                                <Badge variant="outline"
                                    >${adjustment.amountAdjusted.toFixed(
                                        2,
                                    )}</Badge
                                >
                            </li>
                        {/each}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">Payable Amount:</span>
                        <span
                            >${data.paymentDetails.payableAmount.toFixed(
                                2,
                            )}</span
                        >
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">Status:</span>
                        <Badge>{data.paymentDetails.paymentStatus}</Badge>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">Expected Payment Date:</span
                        >
                        <span>{data.paymentDetails.expectedPaymentDate}</span>
                    </div>
                    <p class="text-sm text-gray-600">
                        {data.paymentDetails.reason}
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Additional Metrics</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="flex justify-between items-center">
                    <span>Number of Services:</span>
                    <span>{data.metrics.numberOfServices}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span>Average Service Cost:</span>
                    <span>${data.metrics.averageServiceCost.toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span>Supporting Documents Reviewed:</span>
                    <span>{data.metrics.supportingDocumentsReviewed}</span>
                </div>
                <div>
                    <span class="font-semibold"
                        >Missing Supporting Documents:</span
                    >
                    <ul class="list-disc list-inside">
                        {#each data.metrics.missingSupportingDocuments as doc}
                            <li>{doc}</li>
                        {/each}
                    </ul>
                </div>
            </CardContent>
        </Card>
    </div>
</Tabs.Content>
