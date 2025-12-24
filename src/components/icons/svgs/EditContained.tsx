import type { SVGProps } from "react";
import cn from "@/lib/utils";

function EditContained({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        fill="#555"
        fillRule="evenodd"
        d="M16.837 3.325a1.525 1.525 0 0 1 2.156 0l1.681 1.68a1.525 1.525 0 0 1 .001 2.156l-7.94 7.944a1.5 1.5 0 0 1-.777.417l-3.546.714a.55.55 0 0 1-.648-.648l.716-3.542c.06-.294.204-.564.416-.776zm1.378.778a.425.425 0 0 0-.6 0l-7.941 7.945a.4.4 0 0 0-.116.216l-.552 2.73 2.735-.55a.43.43 0 0 0 .217-.117l7.94-7.944a.425.425 0 0 0 0-.6zM6.353 5.524A2.374 2.374 0 0 0 3.98 7.9v9.748a2.374 2.374 0 0 0 2.374 2.374h9.749a2.374 2.374 0 0 0 2.374-2.374v-4.874a.55.55 0 0 1 1.1 0v4.874a3.474 3.474 0 0 1-3.474 3.474h-9.75a3.474 3.474 0 0 1-3.474-3.474V7.899a3.474 3.474 0 0 1 3.474-3.475h4.874a.55.55 0 1 1 0 1.1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
export default EditContained;
