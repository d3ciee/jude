<script lang="ts">
    import ArrowUpRight from "lucide-svelte/icons/arrow-up-right";
    import Clock from "lucide-svelte/icons/clock";

    import * as Card from "$lib/ui/card";
    import * as Table from "$lib/ui/table";
    import { Button } from "$lib/ui/button";
    import { Badge } from "$lib/ui/badge";
    import * as Avatar from "$lib/ui/avatar";
    import PageContainer from "../_components/page-container";
    import { Medal, Star, TriangleAlert } from "lucide-svelte";
    import { onMount } from "svelte";

    import 'chartjs-adapter-luxon';

    import {
		Chart,
		TimeScale,
        LineController,
        LineElement,
		CategoryScale,
		LinearScale,
		Tooltip,
        PointElement
	} from 'chart.js';

    const {data} = $props();

    let canvas: HTMLCanvasElement;
	let chart: Chart<any> | undefined = undefined;

    onMount(()=>{
        const data = {
        labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
        };

        Chart.register(LineController, LineElement, CategoryScale, LinearScale, TimeScale, Tooltip,PointElement);
		const ctx = canvas.getContext('2d')!;

        chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                font: {
                    family: 'Nunito, sans-serif',
                    weight: 'bold'
                },
                maintainAspectRatio: false,
                borderColor:"transparent",
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks:{
                            font:{}
                        }
                    },
                    x: {
                        
                        ticks:{
                            font:{}
                        }
                    }
                }
            }
        });
    })

</script>

{#snippet KpiCard({title, icon, value, previousValue}:any)}
<Card.Root>
    <Card.Header    
        class="flex flex-row items-center justify-between space-y-0 pb-1 p-4"
    >
        <Card.Title class="text-sm font-medium"
            >{title}</Card.Title
        >
        <svelte:component this={icon} class="text-muted-foreground h-4 w-4" />
    </Card.Header>
    <Card.Content class="p-4 pt-0">
        <div class="text-2xl font-bold">{value}</div>
        <p class="text-muted-foreground text-xs">
            {previousValue} previous week
        </p>
    </Card.Content>
</Card.Root>
{/snippet}

<PageContainer title="Overview">
    <div class="flex min-h-screen w-full flex-col p-6 gap-6 overflow-y-scroll">
        <div class="grid gap-1.5">
            <h1
                class="text-lg font-semibold leading-none tracking-tight space-y-1.5"
            >
                Overview
            </h1>
            <p class="text-muted-foreground text-sm">
                A summary of what has been happening.
            </p>
        </div>
        <main class="flex flex-1 flex-col gap-4">
            <div class="grid gap-4 grid-cols-4">
                {@render KpiCard({title:"Avg Claim Processing Time", icon: Clock, value:"2m 52s", previousValue:"3m 12s"})}
                {@render KpiCard({title:" First-Pass Resolution Rate", icon: Medal, value:"98%", previousValue:"95%"})}
                {@render KpiCard({title:"Claim denial rate", icon: TriangleAlert, value:"2%", previousValue:"5%"})}
                {@render KpiCard({title:"User satisfaction score", icon: Star, value:"4.9/5", previousValue:"4.5"})}
            </div>
            <div class="h-[300px] p-4 border rounded">
                
                    <canvas id="line-chart" class="w-full" bind:this={canvas} ></canvas>
                  
                  
              </div>
              
            <div class="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card.Root class="xl:col-span-2">
                    <Card.Header class="flex flex-row items-center">
                        <div class="grid gap-2">
                            <Card.Title>Claims</Card.Title>
                            <Card.Description
                                >Recent claims applied for.</Card.Description
                            >
                        </div>
                        <Button href="##" size="sm" class="ml-auto gap-1">
                            View All
                            <ArrowUpRight class="h-4 w-4" />
                        </Button>
                    </Card.Header>
                    <Card.Content>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head>Customer</Table.Head>
                                    <Table.Head class="xl:table.-column hidden"
                                        >Type</Table.Head
                                    >
                                    <Table.Head class="xl:table.-column hidden"
                                        >Status</Table.Head
                                    >
                                    <Table.Head class="xl:table.-column hidden"
                                        >Date</Table.Head
                                    >
                                    <Table.Head class="text-right"
                                        >Amount</Table.Head
                                    >
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        <div class="font-medium">
                                            Liam Johnson
                                        </div>
                                        <div
                                            class="text-muted-foreground hidden text-sm md:inline"
                                        >
                                            liam@example.com
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="xl:table.-column hidden"
                                        >Sale</Table.Cell
                                    >
                                    <Table.Cell class="xl:table.-column hidden">
                                        <Badge class="text-xs" variant="outline"
                                            >Approved</Badge
                                        >
                                    </Table.Cell>
                                    <Table.Cell
                                        class="md:table.-cell xl:table.-column hidden lg:hidden"
                                    >
                                        2023-06-23
                                    </Table.Cell>
                                    <Table.Cell class="text-right"
                                        >$250.00</Table.Cell
                                    >
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <div class="font-medium">
                                            Olivia Smith
                                        </div>
                                        <div
                                            class="text-muted-foreground hidden text-sm md:inline"
                                        >
                                            olivia@example.com
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="xl:table.-column hidden"
                                        >Refund</Table.Cell
                                    >
                                    <Table.Cell class="xl:table.-column hidden">
                                        <Badge class="text-xs" variant="outline"
                                            >Declined</Badge
                                        >
                                    </Table.Cell>
                                    <Table.Cell
                                        class="md:table.-cell xl:table.-column hidden lg:hidden"
                                    >
                                        2023-06-24
                                    </Table.Cell>
                                    <Table.Cell class="text-right"
                                        >$150.00</Table.Cell
                                    >
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <div class="font-medium">
                                            Noah Williams
                                        </div>
                                        <div
                                            class="text-muted-foreground hidden text-sm md:inline"
                                        >
                                            noah@example.com
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="xl:table.-column hidden">
                                        Subscription
                                    </Table.Cell>
                                    <Table.Cell class="xl:table.-column hidden">
                                        <Badge class="text-xs" variant="outline"
                                            >Approved</Badge
                                        >
                                    </Table.Cell>
                                    <Table.Cell
                                        class="md:table.-cell xl:table.-column hidden lg:hidden"
                                    >
                                        2023-06-25
                                    </Table.Cell>
                                    <Table.Cell class="text-right"
                                        >$350.00</Table.Cell
                                    >
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <div class="font-medium">
                                            Emma Brown
                                        </div>
                                        <div
                                            class="text-muted-foreground hidden text-sm md:inline"
                                        >
                                            emma@example.com
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="xl:table.-column hidden"
                                        >Sale</Table.Cell
                                    >
                                    <Table.Cell class="xl:table.-column hidden">
                                        <Badge class="text-xs" variant="outline"
                                            >Approved</Badge
                                        >
                                    </Table.Cell>
                                    <Table.Cell
                                        class="md:table.-cell xl:table.-column hidden lg:hidden"
                                    >
                                        2023-06-26
                                    </Table.Cell>
                                    <Table.Cell class="text-right"
                                        >$450.00</Table.Cell
                                    >
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <div class="font-medium">
                                            Liam Johnson
                                        </div>
                                        <div
                                            class="text-muted-foreground hidden text-sm md:inline"
                                        >
                                            liam@example.com
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell class="xl:table.-column hidden"
                                        >Sale</Table.Cell
                                    >
                                    <Table.Cell class="xl:table.-column hidden">
                                        <Badge class="text-xs" variant="outline"
                                            >Approved</Badge
                                        >
                                    </Table.Cell>
                                    <Table.Cell
                                        class="md:table.-cell xl:table.-column hidden lg:hidden"
                                    >
                                        2023-06-27
                                    </Table.Cell>
                                    <Table.Cell class="text-right"
                                        >$550.00</Table.Cell
                                    >
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    </Card.Content>
                </Card.Root>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Recent Sales</Card.Title>
                    </Card.Header>
                    <Card.Content class="grid gap-8">
                        <div class="flex items-center gap-4">
                            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                <Avatar.Image
                                    src="/avatars/01.png"
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>OM</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    Olivia Martin
                                </p>
                                <p class="text-muted-foreground text-sm">
                                    olivia.martin@email.com
                                </p>
                            </div>
                            <div class="ml-auto font-medium">+$1,999.00</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                <Avatar.Image
                                    src="/avatars/02.png"
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>JL</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    Jackson Lee
                                </p>
                                <p class="text-muted-foreground text-sm">
                                    jackson.lee@email.com
                                </p>
                            </div>
                            <div class="ml-auto font-medium">+$39.00</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                <Avatar.Image
                                    src="/avatars/03.png"
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>IN</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    Isabella Nguyen
                                </p>
                                <p class="text-muted-foreground text-sm">
                                    isabella.nguyen@email.com
                                </p>
                            </div>
                            <div class="ml-auto font-medium">+$299.00</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                <Avatar.Image
                                    src="/avatars/04.png"
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>WK</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    William Kim
                                </p>
                                <p class="text-muted-foreground text-sm">
                                    will@email.com
                                </p>
                            </div>
                            <div class="ml-auto font-medium">+$99.00</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                <Avatar.Image
                                    src="/avatars/05.png"
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>SD</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    Sofia Davis
                                </p>
                                <p class="text-muted-foreground text-sm">
                                    sofia.davis@email.com
                                </p>
                            </div>
                            <div class="ml-auto font-medium">+$39.00</div>
                        </div>
                    </Card.Content>
                </Card.Root>
            </div>
        </main>
    </div>
</PageContainer>
