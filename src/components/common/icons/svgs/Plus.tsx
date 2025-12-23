import type { SVGProps } from 'react'
import cn from '@/lib/utils'

const Plus = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    viewBox="0 0 28 28"
    className={cn(className)}
    {...props}
  >
    <path
      fill="#999"
      fillRule="evenodd"
      d="M14.001 7.358c.354 0 .642.288.642.642v5.358H20a.642.642 0 0 1 0 1.284h-5.358V20a.642.642 0 0 1-1.284 0v-5.358H8.001a.642.642 0 1 1 0-1.284h5.358V8c0-.354.288-.642.642-.642"
      clipRule="evenodd"
    />
  </svg>
)

export { Plus }
