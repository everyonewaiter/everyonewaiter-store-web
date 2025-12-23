import type { SVGProps } from 'react'
import cn from '@/lib/utils'

const ChevronDoubleLeft = ({
  className,
  ...props
}: SVGProps<SVGSVGElement>) => (
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
      d="m13.4 5.8 5.6 5.6-5.6 5.6M5 5.8l5.6 5.6L5 17"
    />
  </svg>
)

export { ChevronDoubleLeft }
