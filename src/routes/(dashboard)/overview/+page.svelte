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

    import colors from "tailwindcss/colors";

    import {
		Chart,
		TimeScale,
        LineController,
        LineElement,
		CategoryScale,
        Filler,
		LinearScale,
		Tooltip,
        PointElement
	} from 'chart.js';
    import type { AuditLog, TClaim } from "$lib/server/db/schema";
    import { toast } from "$lib/ui/sonner";

    const {data} = $props();

    let claims:Array<TClaim & {
        files: number;
    }> = $state([])

    let auditLogs:Array<typeof AuditLog.$inferInsert & { user: { name: string, email: string } }> = $state([])

    $effect(()=>{
        if(!data.props.auditLogs.success){
            toast.error("Failed to get audit logs", {description:data.props.auditLogs.error})
            return;
        }
        auditLogs = data.props.auditLogs.data.logs;
    })

    $effect(()=>{
        if(!data.props.claims.success){
            toast.error("Failed to get audit logs", {description:data.props.claims.error})
            return;
        }
        claims = data.props.claims.data.claims;
    })

    let canvas: HTMLCanvasElement;
	let chart: Chart<any> | undefined = undefined;

        
        onMount(()=>{
            const ctx = canvas.getContext('2d')!;
            

        const data = {
        labels: Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`),
        datasets: [
        {
            label: 'Accepted claims',
            data: [0,0, 0, 1, 1, 2],
            borderColor: colors.green[500],
            borderWidth: 2,

            tension: 0.3
        },{
            label: 'Rejected claims',
            data: [0,0, 1, 0, 1, 1],
            borderWidth: 2,
            
            borderColor: colors.red[500],
            tension: 0.3
        },
        {
            label: 'Total submitted claims',
            data: [0,0, 1, 1, 2, 4],
            borderWidth: 2,
            
            borderColor: colors.gray[700],
            tension: 0.3
        },
    ]
        };

        Chart.register(LineController, LineElement, CategoryScale, LinearScale, TimeScale, Tooltip,PointElement,Filler);
		
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
                            stepSize:1,
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
                {@render KpiCard({title:"Avg Claim Processing Time", icon: Clock, value:"2m 52s", previousValue:"0s"})}
                {@render KpiCard({title:" Total claims processed", icon: Medal, value:"8", previousValue:"0"})}
                {@render KpiCard({title:"Claim denial rate", icon: TriangleAlert, value:"2%", previousValue:"0%"})}
                {@render KpiCard({title:"User satisfaction score", icon: Star, value:"4.9/5", previousValue:"0/5"})}
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
                        <Button href="/claims" size="sm" class="ml-auto gap-1">
                            View All
                            <ArrowUpRight class="h-4 w-4" />
                        </Button>
                    </Card.Header>
                    <Card.Content>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head>Membership Number</Table.Head>
                                    <Table.Head class="xl:table.-column hidden"
                                        >Submitted by</Table.Head
                                    >
                                    <Table.Head class="xl:table.-column hidden"
                                        >Status</Table.Head
                                    >
                                    <Table.Head class="xl:table.-column hidden"
                                        >Date</Table.Head
                                    >
                                    <Table.Head class="text-right"
                                        >Status</Table.Head
                                    >
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {#each claims as c}
                                    <Table.Row>
                                        <Table.Cell>
                                            <div class="font-medium">
                                                {c.membershipNumber}
                                            </div>
                                            <div
                                                class="text-muted-foreground hidden text-sm md:inline"
                                            >
                                                submitted claim using {c.submissionChannel}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell class="xl:table.-column hidden"
                                            >{c.submittedBy}</Table.Cell
                                        >
                                        <Table.Cell class="xl:table.-column hidden">
                                            <Badge class="text-xs" variant="outline"
                                                >{c.status}</Badge
                                            >
                                        </Table.Cell>
                                        <Table.Cell
                                            class="md:table.-cell xl:table.-column hidden lg:hidden"
                                        >
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </Table.Cell>
                                        <Table.Cell class="text-right"
                                            >{c.status}</Table.Cell
                                        >
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </Card.Content>
                </Card.Root>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Audit logs</Card.Title>
                    </Card.Header>
                    <Card.Content class="grid gap-8">
                        {#each auditLogs as log}
                        
                        <div class="flex items-center gap-4">
                            <Avatar.Root class="hidden h-9 w-9 sm:flex">
                                <Avatar.Image
                                    src="/avatars/01.png"
                                    alt="Avatar"
                                />
                                <Avatar.Fallback>{log.user.name[0].toUpperCase()}</Avatar.Fallback>
                            </Avatar.Root>
                            <div class="grid gap-1">
                                <p class="text-sm font-medium leading-none">
                                    {log.user.name}
                                </p>
                                <p class="text-muted-foreground text-sm">
                                    {log.details}
                                </p>
                            </div>
                            <div class="ml-auto font-medium">
                                {new Date(log.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        
                        {/each}
                    </Card.Content>
                </Card.Root>
            </div>
        </main>
    </div>
</PageContainer>
