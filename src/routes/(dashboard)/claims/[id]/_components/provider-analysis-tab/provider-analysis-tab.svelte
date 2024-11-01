<script lang="ts">
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/ui/avatar";
    import { Badge } from "$lib/ui/badge";

    import {
        Facebook,
        Instagram,
        Linkedin,
        Twitter,
        Stethoscope,
        Building,
        Award,
        Clock,
        Star,
        StarHalf,
        Loader,
        Globe,
        Phone,
        MapPin,
    } from "lucide-svelte";

    import * as Tabs from "$lib/ui/tabs";

    import * as Card from "$lib/ui/card";
    import { Progress } from "$lib/ui/progress";

    let claimD = $state({
        providerProfile: {
            providerName: "City Health Clinic",
            numberOfReviews: 123,
            location: "123 Wellness Ave, Metropolis",
            contactNumber: "+1 555-0199",
            website: "https://cityhealthclinic.com",
            operatingHours: "Mon-Fri 8:00 AM - 6:00 PM",
            accreditations: "Joint Commission Accredited",
            affiliations: "Health Network Partners, Metropolis Medical Society",
            trustabilityScore: 87.5,
            servicesOffered:
                "General Health, Pediatrics, Immunizations, Emergency Care",
            insuranceAccepted: "Blue Cross, HealthPlus, Medicare, Medicaid",
            emergencyServices: true,
            recentRatings: [
                {
                    comment:
                        "Friendly staff and clean facilities. Highly recommend!",
                    rating: 5,
                },
                {
                    comment:
                        "Wait time was a bit long, but overall good service.",
                    rating: 4,
                },
                {
                    comment: "Doctor was attentive and thorough.",
                    rating: 5,
                },
            ],
        },
        providerProfileConfidence: 0.92,
    });

    const { providerProfile, providerProfileConfidence } = $props();

    const claim = {
        providerProfile: providerProfile
            ? providerProfile
            : claimD.providerProfile,
        providerProfileConfidence: providerProfileConfidence
            ? providerProfileConfidence
            : claimD.providerProfileConfidence,
    };
</script>

<Tabs.Content value="provider-analysis" class="mt-3">
    {#if claim.providerProfile}
        <Card.Root class="w-full max-w-3xl mx-auto">
            <Card.Header>
                <Card.Title class="text-2xl font-bold text-primary-600"
                    >{claim.providerProfile.providerName}</Card.Title
                >
                <div
                    class="flex items-center space-x-2 text-sm text-muted-foreground"
                >
                    <span
                        >({claim.providerProfile.numberOfReviews} reviews)</span
                    >
                </div>
            </Card.Header>
            <Card.Content class="space-y-6">
                <!-- Contact & Location -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-3">
                        <div class="flex items-center space-x-2">
                            <MapPin class="w-5 h-5 text-gray-500" />
                            <span>{claim.providerProfile.location}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Phone class="w-5 h-5 text-gray-500" />
                            <span>{claim.providerProfile.contactNumber}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Globe class="w-5 h-5 text-gray-500" />
                            <a
                                href={claim.providerProfile.website}
                                class="text-blue-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {claim.providerProfile.website}
                            </a>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <div class="flex items-center space-x-2">
                            <Clock class="w-5 h-5 text-gray-500" />
                            <span>{claim.providerProfile.operatingHours}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Award class="w-5 h-5 text-gray-500" />
                            <span>{claim.providerProfile.accreditations}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <Building class="w-5 h-5 text-gray-500" />
                            <span>{claim.providerProfile.affiliations}</span>
                        </div>
                    </div>
                </div>

                <!-- Trustability Score -->
                <div class="space-y-2">
                    <h3 class="font-semibold text-lg">Trustability Score</h3>
                    <Progress
                        value={claim.providerProfile.trustabilityScore}
                        class="w-full bg-gray-200"
                    />
                    <span class="text-sm text-muted-foreground"
                        >{claim.providerProfile.trustabilityScore.toFixed(1)}%
                        trustable</span
                    >
                </div>

                <!-- Services & Insurance -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <h3 class="font-semibold text-lg">Services Offered</h3>
                        <p class="text-muted-foreground">
                            {claim.providerProfile.servicesOffered}
                        </p>
                    </div>
                    <div class="space-y-2">
                        <h3 class="font-semibold text-lg">
                            Insurance Accepted
                        </h3>
                        <p class="text-muted-foreground">
                            {claim.providerProfile.insuranceAccepted}
                        </p>
                    </div>
                </div>

                <!-- Additional Info -->
                <div class="flex items-center justify-between mt-4">
                    <Badge
                        variant={claim.providerProfile.emergencyServices
                            ? "default"
                            : "secondary"}
                        class="text-sm"
                    >
                        {claim.providerProfile.emergencyServices
                            ? "Emergency Services Available"
                            : "No Emergency Services"}
                    </Badge>
                    <div class="flex items-center space-x-1">
                        <Stethoscope class="w-5 h-5 text-gray-500" />
                        <span class="text-sm text-muted-foreground"
                            >Confidence Level: {(
                                Number(claim.providerProfileConfidence) * 100
                            ).toFixed(1)}%</span
                        >
                    </div>
                </div>

                <!-- Patient Ratings -->
                <div class="space-y-3">
                    <h3 class="font-semibold text-lg">Patient Ratings</h3>
                    <ul class="space-y-2">
                        {#each claim.providerProfile.recentRatings as rating}
                            <li class="flex items-center space-x-2">
                                <Star class="w-5 h-5 text-yellow-500" />
                                <span class="text-sm text-muted-foreground"
                                    >{rating.comment}</span
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            </Card.Content>
        </Card.Root>
    {:else}
        <div
            class="flex items-center h-full w-full justify-center text-center gap-2"
        >
            <Loader class="h-6 w-6 animate-spin duration-150 text-primary" />
            <span class="text-muted-foreground"
                >Loading provider profile...</span
            >
        </div>
    {/if}
</Tabs.Content>
