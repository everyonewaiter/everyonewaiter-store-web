import * as React from "react";
import cn from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    data-slot="textarea"
    className={cn(
      "placeholder:text-muted-foreground aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-gray-600 bg-transparent px-4 pt-3 pb-4 text-base font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export default Textarea;
