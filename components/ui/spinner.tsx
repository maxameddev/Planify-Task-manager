import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "cn";

type SpinnerProps = ComponentProps<typeof LoaderCircle>;

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
