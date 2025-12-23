import type { SVGProps } from 'react'
import cn from '@/lib/utils'

function ChevronDoubleDown({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        d="M17.2 13.4 11.6 19 6 13.4M17.2 5l-5.6 5.6L6 5"
      />
    </svg>
  )
}
export default ChevronDoubleDown
