import type { SVGProps } from 'react'
import cn from '@/lib/utils'

const Minus = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    className={cn(className)}
    {...props}
  >
    <path
      fill="#999"
      d="M5.485 10.625h9.028c.227 0 .41-.28.41-.625s-.183-.625-.41-.625H5.485c-.227 0-.41.28-.41.625s.183.625.41.625"
    />
    <path
      fill="#999"
      d="M16.395 9.375H3.603c-.321 0-.582.28-.582.625s.26.625.582.625h12.792c.321 0 .582-.28.582-.625s-.26-.625-.582-.625"
    />
  </svg>
)

export { Minus }
