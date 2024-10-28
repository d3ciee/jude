<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';
  import { cn } from '../utils';

  type $$Props = TabsPrimitive.ListProps;

  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<TabsPrimitive.List
  class={cn(
    'inline-flex h-10 items-center justify-center p-1 pb-0 text-muted-foreground bg-background border-b',
    className
  )}
  {...$$restProps}
>
  <slot />
</TabsPrimitive.List>
