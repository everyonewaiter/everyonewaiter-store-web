import type { SVGProps } from "react";
import cn from "@/lib/utils";

function Dot({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        fill="#333"
        d="M13.542 12.108c0 .837-.69 1.516-1.54 1.516s-1.541-.679-1.541-1.516.69-1.516 1.54-1.516 1.541.679 1.541 1.516m0-7.368c0 .838-.69 1.517-1.54 1.517s-1.541-.68-1.541-1.516c0-.838.69-1.516 1.54-1.516s1.541.678 1.541 1.516m0 14.519c0 .837-.69 1.515-1.54 1.515s-1.541-.678-1.541-1.516c0-.837.69-1.516 1.54-1.516s1.541.68 1.541 1.516"
      />
    </svg>
  );
}
export default Dot;
