import { forwardRef, type ComponentProps, type ReactElement } from "react";
import cn from "@/lib/utils";

interface InputProps {
  prefix?: ReactElement;
  suffix?: ReactElement;
}

type CombineInputProps = Omit<ComponentProps<"input">, "prefix" | "suffix"> & InputProps;

const Input = forwardRef<HTMLInputElement, CombineInputProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    return (
      <div className="flex w-full flex-1 flex-col gap-1">
        <div className="relative w-full">
          {prefix && (
            <div className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2">{prefix}</div>
          )}
          {suffix && (
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center lg:right-4">
              {suffix}
            </div>
          )}
          <input
            ref={ref}
            data-slot="form-input"
            className={cn(
              "text-gray-0 text-s h-9 w-full rounded-lg border border-gray-600 py-2.5 pr-3 pl-3 font-normal outline-none placeholder:text-gray-300 disabled:border-gray-500 disabled:bg-gray-700 disabled:text-gray-300 disabled:placeholder:text-gray-400 lg:h-12 lg:rounded-xl lg:pl-4 lg:text-[15px]",
              prefix && "pl-10!",
              suffix && "pr-12 lg:pr-16",
              className
            )}
            autoComplete="off"
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
