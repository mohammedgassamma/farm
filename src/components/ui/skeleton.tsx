import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="skeleton"
      className={cn("bg-primary/50 animate-pulse !rounded-sm mt-1 inline-block", className)}
      {...props}
    />
  );
}

export { Skeleton };
