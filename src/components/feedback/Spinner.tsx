import cn from "@/lib/utils";

interface SpinnerProps {
  className?: string;
}

function Spinner({ className }: Readonly<SpinnerProps>) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "border-t-primary size-6 animate-spin rounded-full border-4 border-gray-600",
          className
        )}
      />
    </div>
  );
}

export default Spinner;
