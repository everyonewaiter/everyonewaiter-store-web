import type { SVGProps } from 'react'
import cn from '@/lib/utils'

function ChevronLeft({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        d="M8.646 12.354a.5.5 0 0 1 0-.708l5-5a.5.5 0 0 1 .708.708L9.707 12l4.647 4.646a.5.5 0 0 1-.708.708z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default ChevronLeft
