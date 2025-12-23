import * as SwitchPrimitives from "@radix-ui/react-switch";
import {
  type ComponentPropsWithoutRef,
  type ComponentRef,
  forwardRef,
  useMemo,
} from "react";
import cn from "@/lib/utils";

interface SwitchProps
  extends ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  width?: number; // 전체 width
  height?: number; // 전체 height
  thumbSize?: number; // thumb size (정사각형으로 가정)
}

const Switch = forwardRef<
  ComponentRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, width = 48, height = 24, thumbSize = 16, ...props }, ref) => {
  const containerPadding = useMemo(
    () => (height - thumbSize) / 2,
    [height, thumbSize]
  );

  const travelX = useMemo(
    () => width - thumbSize - containerPadding * 2,
    [width, thumbSize, containerPadding]
  );

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:border-primary inline-flex h-[24px] w-[48px] shrink-0 items-center justify-start rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed data-[state=checked]:bg-white disabled:data-[state=checked]:border-transparent disabled:data-[state=checked]:bg-[#F2202030] data-[state=unchecked]:border-gray-600 data-[state=unchecked]:bg-gray-600",
        className
      )}
      style={{
        width,
        height,
        padding: containerPadding,
        ["--travel-x" as string]: `${travelX}px`,
        cursor: props.disabled ? "default" : "pointer",
      }}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block translate-x-0 rounded-full ring-0 transition-transform duration-200 ease-out data-[state=checked]:translate-x-[var(--travel-x)]",
          "data-[state=checked]:bg-primary bg-white data-[disabled]:data-[state=checked]:bg-white"
        )}
        style={{
          width: thumbSize,
          height: thumbSize,
        }}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export default Switch;
