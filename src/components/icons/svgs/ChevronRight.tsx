import type { SVGProps } from "react";
import cn from "@/lib/utils";

function ChevronRight({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        fill="#000"
        fillRule="evenodd"
        d="M16.5 12a.5.5 0 0 1-.146.354l-5 5a.5.5 0 0 1-.708-.708L15.293 12l-4.647-4.646a.5.5 0 0 1 .708-.708l5 5A.5.5 0 0 1 16.5 12"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default ChevronRight;
