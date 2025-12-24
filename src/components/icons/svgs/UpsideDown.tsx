import type { SVGProps } from "react";
import cn from "@/lib/utils";

function UpsideDown({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 20 20"
      className={cn(className)}
      {...props}
    >
      <path
        stroke="#999"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.3}
        d="m11.667 5.833 2.5-2.5m0 0 2.5 2.5m-2.5-2.5v13.334m-5.833-2.5-2.5 2.5m0 0-2.5-2.5m2.5 2.5V3.333"
      />
    </svg>
  );
}
export default UpsideDown;
