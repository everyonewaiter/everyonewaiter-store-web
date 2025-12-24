import type { SVGProps } from "react";
import cn from "@/lib/utils";

function ChevronDoubleUp({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      viewBox="0 0 24 24"
      className={cn(className)}
      {...props}
    >
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="M5.8 10.6 11.4 5l5.6 5.6M5.8 19l5.6-5.6L17 19"
      />
    </svg>
  );
}
export default ChevronDoubleUp;
