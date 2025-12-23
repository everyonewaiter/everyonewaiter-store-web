import cn from "@/lib/utils";
import type { PropsWithChildren } from "react";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-gray-700", className)}
      {...props}
    />
  );
}

function SkeletonWrapper({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}

function SkeletonInput({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn(
        "h-9 w-full rounded-lg md:w-full lg:h-12 lg:rounded-xl",
        className
      )}
      {...props}
    />
  );
}

function SkeletonLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Skeleton
      className={cn("h-[12px] w-20 lg:h-[13px]", className)}
      {...props}
    />
  );
}

function SkeletonFieldGroup({ total }: { total: number }) {
  return (
    <>
      {Array.from({ length: total })
        .fill(0)
        .map((_, i) => (
          <div className="flex flex-col gap-2.5" key={`skeleton-field-group-${i + 1}`}>
            <SkeletonLabel />
            <SkeletonInput />
          </div>
        ))}
    </>
  );
}

Skeleton.Wrapper = SkeletonWrapper;
Skeleton.Input = SkeletonInput;
Skeleton.Label = SkeletonLabel;
Skeleton.FieldGroup = SkeletonFieldGroup;

export { Skeleton };
