import type { SVGProps } from 'react'
import cn from '@/lib/utils'

const ChevronDown = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
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
      d="M6.631 10.662a.5.5 0 0 1 .707-.03L12 14.901l4.661-4.27a.5.5 0 0 1 .676.737l-5 4.58a.5.5 0 0 1-.675 0l-5-4.58a.5.5 0 0 1-.032-.707"
      clipRule="evenodd"
    />
  </svg>
)

export { ChevronDown }
