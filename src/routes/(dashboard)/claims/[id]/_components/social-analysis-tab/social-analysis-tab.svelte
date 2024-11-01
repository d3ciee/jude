<script lang="ts">
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/ui/avatar";
    import { Badge } from "$lib/ui/badge";

    import * as Tabs from "$lib/ui/tabs";

    import * as Card from "$lib/ui/card";
    import { Separator } from "$lib/ui/separator";
    import { Facebook, Instagram, Linkedin, Twitter } from "lucide-svelte";

    let claimD = {
        socialProfile: {
            fullName: "Jane Doe",
            birthDate: "1985-04-23",
            avatar: "https://example.com/avatar/janedoe.jpg",
            knownAliases: "J.D., Janey",
            occupation: "Data Scientist",
            location: "San Francisco, CA",
            socialMediaHandles: {
                twitter: "janedoe",
                linkedin: "janedoe",
                facebook: "jane.doe.123",
                instagram: "jane_doe_in_sf",
            },
            followersCount: 12400,
            publications: "Understanding Big Data, A Guide to Data Science",
            organizationAffiliations:
                "Tech Innovators Association, Data Science Guild",
            notableAchievements:
                "Top 50 Women in Tech 2022, Keynote Speaker at DataCon 2023",
            knownInterests: "AI, machine learning, hiking, photography",
            relatedPersons:
                "John Doe (brother), Lisa Smith (colleague), Mike Brown (mentor)",
        },
        confidenceLevel: 0.92,
    };

    const { socialProfile, confidenceLevel }: any = $props();
    let claim = {
        confidenceLevel: confidenceLevel
            ? confidenceLevel
            : claimD.confidenceLevel,
        socialProfile: socialProfile
            ? { ...claimD.socialProfile, ...socialProfile }
            : claimD.socialProfile,
    };
</script>

<Tabs.Content value="social-analysis" class="mt-3">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <Card.Root
            class="md:col-span-1 shadow-lg border border-gray-200 rounded-lg"
        >
            <Card.Header class="text-center p-6">
                <Avatar class="w-32 h-32 mx-auto shadow-md">
                    <AvatarImage
                        src={claim.socialProfile.avatar}
                        alt={claim.socialProfile.fullName}
                    />
                    <AvatarFallback>
                        {claim.socialProfile.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <Card.Title class="mt-4 text-2xl font-bold text-gray-800">
                    {claim.socialProfile.fullName}
                </Card.Title>
                <p class="text-muted-foreground text-sm">
                    Known as: {claim.socialProfile.knownAliases}
                </p>
            </Card.Header>
            <Card.Content class="text-center px-6 pb-6">
                <p class="text-sm text-muted-foreground mb-4">
                    {claim.socialProfile.occupation}
                </p>
                <Badge
                    variant="secondary"
                    class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                >
                    {claim.socialProfile.location}
                </Badge>
                <Separator class="my-4 border-t border-gray-200" />
                <div class="flex justify-center gap-4 mt-4">
                    <!-- Social Media Links -->
                    {#if claim.socialProfile.socialMediaHandles.twitter}
                        <a
                            href="https://twitter.com/{claim.socialProfile
                                .socialMediaHandles.twitter}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-500 hover:text-blue-600"
                        >
                            <Twitter class="w-6 h-6" />
                            <span class="sr-only">Twitter</span>
                        </a>
                    {/if}
                    {#if claim.socialProfile.socialMediaHandles.facebook}
                        <a
                            href="https://facebook.com/{claim.socialProfile
                                .socialMediaHandles.facebook}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-600 hover:text-blue-700"
                        >
                            <Facebook class="w-6 h-6" />
                            <span class="sr-only">Facebook</span>
                        </a>
                    {/if}
                    {#if claim.socialProfile.socialMediaHandles.instagram}
                        <a
                            href="https://instagram.com/{claim.socialProfile
                                .socialMediaHandles.instagram}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-pink-600 hover:text-pink-700"
                        >
                            <Instagram class="w-6 h-6" />
                            <span class="sr-only">Instagram</span>
                        </a>
                    {/if}
                    {#if claim.socialProfile.socialMediaHandles.linkedin}
                        <a
                            href="https://linkedin.com/in/{claim.socialProfile
                                .socialMediaHandles.linkedin}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-blue-700 hover:text-blue-800"
                        >
                            <Linkedin class="w-6 h-6" />
                            <span class="sr-only">LinkedIn</span>
                        </a>
                    {/if}
                </div>
            </Card.Content>
        </Card.Root>

        <!-- Profile Details -->
        <Card.Root
            class="md:col-span-2 shadow-lg border border-gray-200 rounded-lg"
        >
            <Card.Header class="p-6 border-b border-gray-200">
                <Card.Title class="text-xl font-bold text-gray-800">
                    Profile Details
                </Card.Title>
            </Card.Header>
            <Card.Content class="p-6 space-y-6">
                <div>
                    <h3 class="font-semibold text-lg text-gray-700 mb-1">
                        Birth Date
                    </h3>
                    <p class="text-gray-600">{claim.socialProfile.birthDate}</p>
                </div>
                <div>
                    <h3 class="font-semibold text-lg text-gray-700 mb-1">
                        Followers
                    </h3>
                    <p class="text-gray-600">
                        {claim.socialProfile.followersCount.toLocaleString()}
                    </p>
                </div>
                {#if claim.socialProfile.publications}
                    <div>
                        <h3 class="font-semibold text-lg text-gray-700 mb-1">
                            Publications
                        </h3>
                        <p class="text-gray-600">
                            {claim.socialProfile.publications}
                        </p>
                    </div>
                {/if}
                <div>
                    <h3 class="font-semibold text-lg text-gray-700 mb-1">
                        Affiliations
                    </h3>
                    <p class="text-gray-600">
                        {claim.socialProfile.organizationAffiliations}
                    </p>
                </div>
                <div>
                    <h3 class="font-semibold text-lg text-gray-700 mb-1">
                        Notable Achievements
                    </h3>
                    <p class="text-gray-600">
                        {claim.socialProfile.notableAchievements}
                    </p>
                </div>
                <div>
                    <h3 class="font-semibold text-lg text-gray-700 mb-1">
                        Interests
                    </h3>
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each claim.socialProfile.knownInterests.split(", ") as interest}
                            <Badge
                                variant="secondary"
                                class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                            >
                                {interest}
                            </Badge>
                        {/each}
                    </div>
                </div>
                <div>
                    <h3 class="font-semibold text-lg text-gray-700 mb-1">
                        Related Persons
                    </h3>
                    <p class="text-gray-600">
                        {claim.socialProfile.relatedPersons}
                    </p>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</Tabs.Content>
