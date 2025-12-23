import type { SVGProps } from 'react'
import cn from '@/lib/utils'

const Info = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
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
      fill="#222"
      fillRule="evenodd"
      d="M11.999 4.836a7.164 7.164 0 1 0 0 14.328 7.164 7.164 0 0 0 0-14.328M3.734 12a8.264 8.264 0 1 1 16.529 0 8.264 8.264 0 0 1-16.529 0M12 8.557a.55.55 0 0 1 .55.55v.034a.55.55 0 0 1-1.1 0v-.034a.55.55 0 0 1 .55-.55m0 2.893a.55.55 0 0 1 .55.55v3.857a.55.55 0 0 1-1.1 0V12a.55.55 0 0 1 .55-.55"
      clipRule="evenodd"
    />
  </svg>
)

export { Info }
