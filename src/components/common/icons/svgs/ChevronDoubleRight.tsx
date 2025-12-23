import type { SVGProps } from 'react'
import cn from '@/lib/utils'

const ChevronDoubleRight = ({
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
      d="M10.6 17.2 5 11.6 10.6 6M19 17.2l-5.6-5.6L19 6"
    />
  </svg>
)

export { ChevronDoubleRight }
