import type { SVGProps } from 'react'
import cn from '@/lib/utils'

function Home({ className, ...props }: SVGProps<SVGSVGElement>) {
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
        fill="#F22020"
        fillRule="evenodd"
        d="M16.384 5.582a.7.7 0 0 0-.768 0L6.7 11.611a.55.55 0 0 0-.254.455v11.282c0 .642.558 1.223 1.324 1.223h4.067V17.48c0-1.16.977-2.037 2.104-2.037h4.115c1.127 0 2.104.878 2.104 2.037v7.092h4.067c.766 0 1.324-.581 1.324-1.223V12.066a.55.55 0 0 0-.254-.456zm7.844 20.456c1.506 0 2.79-1.17 2.79-2.69V12.066a2.02 2.02 0 0 0-.899-1.67l-8.914-6.029a2.16 2.16 0 0 0-2.411 0L5.88 10.396a2.02 2.02 0 0 0-.9 1.67v11.282c0 1.52 1.285 2.69 2.79 2.69zm-5.533-1.467V17.48c0-.28-.25-.57-.638-.57h-4.115c-.387 0-.638.29-.638.57v7.092z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default Home
