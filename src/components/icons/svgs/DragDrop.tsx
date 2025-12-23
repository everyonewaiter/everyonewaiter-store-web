import type { SVGProps } from 'react'
import cn from '@/lib/utils'

function DragDrop({ className, ...props }: SVGProps<SVGSVGElement>) {
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
      <circle cx={9} cy={6} r={1.5} fill="#333" />
      <circle cx={15} cy={6} r={1.5} fill="#333" />
      <circle cx={9} cy={12} r={1.5} fill="#333" />
      <circle cx={15} cy={12} r={1.5} fill="#333" />
      <circle cx={9} cy={18} r={1.5} fill="#333" />
      <circle cx={15} cy={18} r={1.5} fill="#333" />
    </svg>
  )
}
export default DragDrop
