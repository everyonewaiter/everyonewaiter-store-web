import type { SVGProps } from 'react'
import cn from '@/lib/utils'

function Close({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
      viewBox="0 0 32 32"
      className={cn(className)}
      {...props}
    >
      <path
        stroke="#222"
        strokeLinecap="round"
        strokeWidth={1.3}
        d="m7.515 7.515 16.97 16.97m-16.97 0 16.97-16.97"
      />
    </svg>
  )
}
export default Close
