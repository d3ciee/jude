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

    import { Avatar, AvatarImage, AvatarFallback } from "$lib/ui/avatar";
    import { Badge } from "$lib/ui/badge";
    import * as Card from "$lib/ui/card";
    import { Progress } from "$lib/ui/progress";
    import { Separator } from "$lib/ui/separator";
    import {
        Facebook,
        Instagram,
        Linkedin,
        Twitter,
        Stethoscope,
        Building,
        Award,
        Clock,
        Loader,
        Globe,
        Phone,
        MapPin,
    } from "lucide-svelte";
    import type { GptProviderResponse, GptSocialProfilerResponse } from "$lib/types";

    const { data } = $props();
    let claim: (TClaim & { files: TFile[], socialProfile?:GptSocialProfilerResponse["extractedData"], providerProfile?:GptProviderResponse["extractedData"] }) | null = $state(null);
    

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
                        <Tabs.Trigger value="social-analysis"
                            >Social analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="risk-analysis"
                            >Risk analysis</Tabs.Trigger
                        >
                        <Tabs.Trigger value="section-4">Section 4</Tabs.Trigger>
                    </Tabs.List>

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
                                                {:else if ["png", "gif", "jpeg", "jpg", "webp"].includes(file.fileStorageKey
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

                    <Tabs.Content value="social-analysis" class="mt-3">
                        {#if claim.socialProfile && claim.providerProfile}
                        <div class="min-h-screen bg-background flex flex-col">
                            <!-- <div class="flex items-center gap-2">
                                <Badge variant="outline"
                                    >Confidence: {claim.socialProfileConfidence
                                        ? Number(
                                              claim.socialProfileConfidence,
                                          ) * 100
                                        : 0}%</Badge
                                >
                                <Progress
                                    value={claim.socialProfileConfidence
                                        ? Number(
                                              claim.socialProfileConfidence,
                                          ) * 100
                                        : 0}
                                    class="w-24"
                                />
                            </div> -->

                            <main class="flex-grow container mx-auto px-4 py-8">
                                <div
                                    class="grid grid-cols-1 md:grid-cols-3 gap-8"
                                >
                                    <Card.Root class="md:col-span-1">
                                        <Card.Header class="text-center">
                                            <Avatar class="w-32 h-32 mx-auto">
                                                <AvatarImage
                                                    src={claim.socialProfile
                                                        .avatar}
                                                    alt={claim.socialProfile
                                                        .fullName}
                                                />
                                                <AvatarFallback
                                                    >{claim.socialProfile.fullName
                                                        .split(" ")
                                                        .map((n:string) => n[0])
                                                        .join(
                                                            "",
                                                        )}</AvatarFallback
                                                >
                                            </Avatar>
                                            <Card.Title
                                                class="mt-4 text-2xl font-bold"
                                                >{claim.socialProfile
                                                    .fullName}</Card.Title
                                            >
                                            <p class="text-muted-foreground">
                                                {claim.socialProfile
                                                    .knownAliases}
                                            </p>
                                        </Card.Header>
                                        <Card.Content class="text-center">
                                            <p
                                                class="text-sm text-muted-foreground mb-4"
                                            >
                                                {claim.socialProfile.occupation}
                                            </p>
                                            <Badge variant="secondary"
                                                >{claim.socialProfile
                                                    .location}</Badge
                                            >
                                            <Separator class="my-4" />
                                            <div
                                                class="flex justify-center gap-4"
                                            >
                                                {#if claim.socialProfile.socialMediaHandles.twitter}
                                                    <a
                                                        href="https://twitter.com/{claim
                                                            .socialProfile
                                                            .socialMediaHandles
                                                            .twitter}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="text-blue-500 hover:text-blue-600"
                                                    >
                                                        <Twitter
                                                            class="w-6 h-6"
                                                        />
                                                        <span class="sr-only"
                                                            >Twitter</span
                                                        >
                                                    </a>
                                                {/if}
                                                {#if claim.socialProfile.socialMediaHandles.facebook}
                                                    <a
                                                        href="https://facebook.com/{claim
                                                            .socialProfile
                                                            .socialMediaHandles
                                                            .facebook}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Facebook
                                                            class="w-6 h-6"
                                                        />
                                                        <span class="sr-only"
                                                            >Facebook</span
                                                        >
                                                    </a>
                                                {/if}
                                                {#if claim.socialProfile.socialMediaHandles.instagram}
                                                    <a
                                                        href="https://instagram.com/{claim
                                                            .socialProfile
                                                            .socialMediaHandles
                                                            .instagram}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="text-pink-600 hover:text-pink-700"
                                                    >
                                                        <Instagram
                                                            class="w-6 h-6"
                                                        />
                                                        <span class="sr-only"
                                                            >Instagram</span
                                                        >
                                                    </a>
                                                {/if}
                                                {#if claim.socialProfile.socialMediaHandles.linkedin}
                                                    <a
                                                        href="https://linkedin.com/in/{claim
                                                            .socialProfile
                                                            .socialMediaHandles
                                                            .linkedin}"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        class="text-blue-700 hover:text-blue-800"
                                                    >
                                                        <Linkedin
                                                            class="w-6 h-6"
                                                        />
                                                        <span class="sr-only"
                                                            >LinkedIn</span
                                                        >
                                                    </a>
                                                {/if}
                                            </div>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root class="md:col-span-2">
                                        <Card.Header>
                                            <Card.Title
                                                >Profile Details</Card.Title
                                            >
                                        </Card.Header>
                                        <Card.Content class="space-y-6">
                                            <div>
                                                <h3
                                                    class="font-semibold text-lg mb-2"
                                                >
                                                    Birth Date
                                                </h3>
                                                <p>
                                                    {claim.socialProfile
                                                        .birthDate}
                                                </p>
                                            </div>
                                            <div>
                                                <h3
                                                    class="font-semibold text-lg mb-2"
                                                >
                                                    Followers
                                                </h3>
                                                <p>
                                                    {claim.socialProfile.followersCount.toLocaleString()}
                                                </p>
                                            </div>
                                            {#if claim.socialProfile.publications}
                                                <div>
                                                    <h3
                                                        class="font-semibold text-lg mb-2"
                                                    >
                                                        Publications
                                                    </h3>
                                                    <p>
                                                        {claim.socialProfile
                                                            .publications}
                                                    </p>
                                                </div>
                                            {/if}
                                            <div>
                                                <h3
                                                    class="font-semibold text-lg mb-2"
                                                >
                                                    Affiliations
                                                </h3>
                                                <p>
                                                    {claim.socialProfile
                                                        .organizationAffiliations}
                                                </p>
                                            </div>
                                            <div>
                                                <h3
                                                    class="font-semibold text-lg mb-2"
                                                >
                                                    Notable Achievements
                                                </h3>
                                                <p>
                                                    {claim.socialProfile
                                                        .notableAchievements}
                                                </p>
                                            </div>
                                            <div>
                                                <h3
                                                    class="font-semibold text-lg mb-2"
                                                >
                                                    Interests
                                                </h3>
                                                <div
                                                    class="flex flex-wrap gap-2"
                                                >
                                                    {#each claim.socialProfile.knownInterests.split(", ") as interest}
                                                        <Badge
                                                            variant="secondary"
                                                            >{interest}</Badge
                                                        >
                                                    {/each}
                                                </div>
                                            </div>
                                            <div>
                                                <h3
                                                    class="font-semibold text-lg mb-2"
                                                >
                                                    Related Persons
                                                </h3>
                                                <p>
                                                    {claim.socialProfile
                                                        .relatedPersons}
                                                </p>
                                            </div>
                                        </Card.Content>
                                    </Card.Root>
                                    <Card.Root class="w-full max-w-3xl mx-auto">
                                        <Card.Header>
                                            <Card.Title
                                                class="text-2xl font-bold"
                                                >{claim.providerProfile
                                                    .providerName}</Card.Title
                                            >
                                            <div
                                                class="flex items-center space-x-2"
                                            >
                                                TODO:Add stars
                                                <!-- <StarRating rating={claim.providerProfile.ratings} /> -->
                                                <span
                                                    class="text-sm text-gray-500"
                                                    >({claim.providerProfile
                                                        .numberOfReviews} reviews)</span
                                                >
                                            </div>
                                        </Card.Header>
                                        <Card.Content class="grid gap-4">
                                            <div
                                                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                <div class="space-y-2">
                                                    <div
                                                        class="flex items-center space-x-2"
                                                    >
                                                        <MapPin
                                                            class="w-5 h-5 text-gray-500"
                                                        />
                                                        <span
                                                            >{claim
                                                                .providerProfile
                                                                .location}</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="flex items-center space-x-2"
                                                    >
                                                        <Phone
                                                            class="w-5 h-5 text-gray-500"
                                                        />
                                                        <span
                                                            >{claim
                                                                .providerProfile
                                                                .contactNumber}</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="flex items-center space-x-2"
                                                    >
                                                        <Globe
                                                            class="w-5 h-5 text-gray-500"
                                                        />
                                                        <a
                                                            href={claim
                                                                .providerProfile
                                                                .website}
                                                            class="text-blue-500 hover:underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {claim
                                                                .providerProfile
                                                                .website}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="space-y-2">
                                                    <div
                                                        class="flex items-center space-x-2"
                                                    >
                                                        <Clock
                                                            class="w-5 h-5 text-gray-500"
                                                        />
                                                        <span
                                                            >{claim
                                                                .providerProfile
                                                                .operatingHours}</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="flex items-center space-x-2"
                                                    >
                                                        <Award
                                                            class="w-5 h-5 text-gray-500"
                                                        />
                                                        <span
                                                            >{claim
                                                                .providerProfile
                                                                .accreditations}</span
                                                        >
                                                    </div>
                                                    <div
                                                        class="flex items-center space-x-2"
                                                    >
                                                        <Building
                                                            class="w-5 h-5 text-gray-500"
                                                        />
                                                        <span
                                                            >{claim
                                                                .providerProfile
                                                                .affiliations}</span
                                                        >
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="space-y-2">
                                                <h3 class="font-semibold">
                                                    Trustability Score
                                                </h3>
                                                <Progress
                                                    value={claim.providerProfile
                                                        .trustabilityScore}
                                                    class="w-full"
                                                />
                                                <span
                                                    class="text-sm text-gray-500"
                                                    >{claim.providerProfile.trustabilityScore.toFixed(
                                                        1,
                                                    )}% trustable</span
                                                >
                                            </div>
                                            <div class="space-y-2">
                                                <h3 class="font-semibold">
                                                    Services Offered
                                                </h3>
                                                <p>
                                                    {claim.providerProfile
                                                        .servicesOffered}
                                                </p>
                                            </div>
                                            <div class="space-y-2">
                                                <h3 class="font-semibold">
                                                    Insurance Accepted
                                                </h3>
                                                <p>
                                                    {claim.providerProfile
                                                        .insuranceAccepted}
                                                </p>
                                            </div>
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <Badge
                                                    variant={claim
                                                        .providerProfile
                                                        .emergencyServices
                                                        ? "default"
                                                        : "secondary"}
                                                    class="text-sm"
                                                >
                                                    {claim.providerProfile
                                                        .emergencyServices
                                                        ? "Emergency Services Available"
                                                        : "No Emergency Services"}
                                                </Badge>
                                                <div
                                                    class="flex items-center space-x-1"
                                                >
                                                    <Stethoscope
                                                        class="w-5 h-5 text-gray-500"
                                                    />
                                                    <span
                                                        class="text-sm text-gray-500"
                                                        >Confidence Level: {(
                                                            Number(
                                                                claim.providerProfileConfidence,
                                                            ) * 100
                                                        ).toFixed(1)}%</span
                                                    >
                                                </div>
                                            </div>
                                        </Card.Content>
                                    </Card.Root>
                                </div>
                            </main>
                            <footer class="bg-muted py-4">
                                <div
                                    class="container mx-auto px-4 text-center text-sm text-muted-foreground"
                                >
                                    Data extracted by AI. Confidence level: {(claim.socialProfileConfidence
                                        ? Number(
                                              claim.socialProfileConfidence,
                                          ) * 100
                                        : 0
                                    ).toFixed(1)}%
                                </div>
                            </footer>
                        </div>
                        {:else}
                        <div
                        class="items-center flex h-full w-full justify-center text-center gap-2 items-center"
                    >
                        <Loader
                            class="h-6 w-6 animate-spin duration-150 text-primary"
                        />
                        loading...
                    </div>
                        {/if}
                    </Tabs.Content>
                </Tabs.Root>
            {/if}
        </div>
    </div>
</PageContainer>
