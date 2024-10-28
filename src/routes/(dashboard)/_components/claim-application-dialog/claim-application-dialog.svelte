<script lang="ts">
    import { Plus, X } from "lucide-svelte";
    import * as Dialog from "$lib/ui/dialog";
    import { Button } from "$lib/ui/button";
    import { Input } from "$lib/ui/input";
    import { Label } from "$lib/ui/label";
    import * as Select from "$lib/ui/select";
    import genId from "$lib/utils/gen-id";
    import type { SubmitFunction } from "./$types";
    import { toast } from "$lib/ui/sonner";
    import { invalidateAll } from "$app/navigation";
    import { enhance } from "$app/forms";

    let files = $state([{
        type:"",
        id:genId(),
        file:null,
    }]);

    let loading = $state(false);
    let open = $state(false);
    const onSubmit:SubmitFunction = ()=>{
        const t = setTimeout(() => {
                loading = true;
            }, 100);

        return async ({ result }) => {
            clearTimeout(t);
            loading = false;

                if (result.type === "failure" || result.type === "error") {
                    toast.error(`Failed to create claim application`, {
                        description:
                            (result as any)?.data?.message ||
                            "An unexpected error occurred.  Please try again.",
                    });
                    return;
                }
                await invalidateAll();
                toast.success(`Claim application created successfully`);
                open = false;
        };
    }

    const {trigger}:any = $props();
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
        {@render trigger({builders:[builder]})}
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[525px]">
        <Dialog.Header>
            <Dialog.Title>Insurance Claim Application</Dialog.Title>
            <Dialog.Description>
                Please attach all necessary documents for
                the claim.
            </Dialog.Description>
        </Dialog.Header>
        <form method="POST" action="/claims?/create" enctype="multipart/form-data" use:enhance={onSubmit}>
            <input type="hidden" name="number-of-files" value={files.length}/>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">Member ID</Label>
                    <Input name="membership-number" required class="w-full"/>
                </div>  

                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="name" class="text-right">Submitted by</Label>
                    <Select.Root>
                        <Select.Trigger class="col-span-3">
                            <Select.Value placeholder="Please select an option" />
                        </Select.Trigger>
                        <Select.Content>
                            <Select.Item value="member"
                                >CIMAS Member</Select.Item
                            >
                            <Select.Item value="provider"
                                >Health provider</Select.Item
                            >
                        </Select.Content>
                        <Select.Input name="submitted-by" />
                    </Select.Root>
                </div>  
        

                {#each files as file,i (i)}
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="file-{i}" class="text-right"
                            >File</Label
                        >
                        <div class="col-span-3 flex items-center gap-2">
                            <Input id="file-{i}" type="file" class="pl-0" name="file-{i}" bind:value={files[i].file}/>
                            <Select.Root>
                                <Select.Trigger class="w-[180px]">
                                    <Select.Value placeholder="File type" />
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="claim-application"
                                        >Claim application</Select.Item
                                    >
                                    <Select.Item value="invoice"
                                        >Invoice</Select.Item
                                    >
                                    <Select.Item value="prescription"
                                        >Prescription</Select.Item
                                    >
                                </Select.Content>
                                <Select.Input
                                    bind:value={files[i].type}
                                    name="file-{i}-type"
                                />
                            </Select.Root>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                class="aspect-square"
                                on:click={() => {
                                    files = files.filter((f) => f.id !== file.id);
                                }}
                            >
                                <X class="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                {/each}
                <Button
                    type="button"
                    variant="outline"
                    on:click={()=>{
                        files = [...files, {
                            type:"",
                            id:genId(),
                            file:null,
                        }];
                    }}
                    class="w-full"
                >
                    <Plus class="mr-2 h-4 w-4" /> Add Another File
                </Button>
            </div>
            <Dialog.Footer>
                <Button
                    disabled={loading || files.some((f) => !f.file)}
                type="submit">
                    {loading ? "Submitting..." : "Submit"}
            </Button>
            </Dialog.Footer>
        </form>
    </Dialog.Content>
</Dialog.Root>
