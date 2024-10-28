<search>
  import { Progress } from "$lib/ui/progress";
  import { Alert, AlertDescription, AlertTitle } from "$lib/ui/alert";
  import { Badge } from "$lib/ui/badge";
  import { Skeleton } from "$lib/ui/skeleton";
  import Upload from "lucide-svelte/icons/upload";
  import { onDestroy } from "svelte";
</search>
<replace>
  import { Progress } from "$lib/ui/progress";
  import { Alert, AlertDescription, AlertTitle } from "$lib/ui/alert";
  import { Badge } from "$lib/ui/badge";
  import { Skeleton } from "$lib/ui/skeleton";
  import Upload from "lucide-svelte/icons/upload";
  import { onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
</replace>

<search>
            if (result.type === 'success' && result.data?.success) {
              analysis = result.data.data.analysis;
              error = null;
            } else {
              error = result.data?.error || "Failed to analyze document";
            }
</search>
<replace>
            if (result.type === 'success' && result.data?.success) {
              analysis = result.data.data.analysis;
              error = null;
              toast.success("Document analyzed successfully");
            } else {
              error = result.data?.error || "Failed to analyze document";
              toast.error(error);
            }
</replace>
