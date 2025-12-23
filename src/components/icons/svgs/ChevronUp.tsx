import type { SVGProps } from 'react'
import cn from '@/lib/utils'

function ChevronUp({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        d="M11.663 8.631a.5.5 0 0 1 .676 0l4.999 4.584a.5.5 0 1 1-.676.737l-4.661-4.274-4.663 4.274a.5.5 0 0 1-.676-.737z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default ChevronUp
