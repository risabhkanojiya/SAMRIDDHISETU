'use client'

import { FC } from 'react'
import { ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Link from 'next/link'

function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

interface Props {
  label: string
  variant?: 'primary' | 'secondary'
  classes?: string
  animate?: boolean
  delay?: number
  href?: string
}

const MotionButton: FC<Props> = ({ label, classes, href }) => {
  const content = (
    <button
      className={cn(
        'bg-white group relative h-auto w-50 cursor-pointer rounded-[30px] border border-[#e5e7eb] shadow-sm p-1 outline-none min-w-[200px] active:scale-[0.98] transition-transform',
        classes
      )}
    >
      <span
        className='circle bg-[#013e4e] m-0 block h-12 w-12 overflow-hidden rounded-[30px] duration-500 group-hover:w-full group-active:bg-[#012d39]'
        aria-hidden='true'
      ></span>
      <div className='icon absolute top-1/2 left-4 translate-x-0 -translate-y-1/2 duration-500 group-hover:translate-x-[0.4rem]'>
        <ArrowRight className='text-white size-6' />
      </div>
      <span className='button-text text-[#272727] group-hover:text-white font-manrope absolute top-2/4 left-2/4 ml-4 -translate-x-2/4 -translate-y-2/4 text-center text-base font-medium tracking-tight whitespace-nowrap transition-colors duration-500'>
        {label}
      </span>
    </button>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export default MotionButton
