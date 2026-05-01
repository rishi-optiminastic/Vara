'use client'

import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "!bg-[#FAFAF8] !border !border-[rgba(55,50,47,0.12)] !text-[#37322F] !shadow-[0_4px_16px_-4px_rgba(55,50,47,0.14),0_0_0_1px_rgba(55,50,47,0.05)] !rounded-xl !p-3.5",
          title: "!text-[#37322F] !font-medium !text-xs",
          description: "!text-[#6B6460] !text-[11px]",
          icon: "!mt-0",
          closeButton:
            "!bg-[#F0ECE6] !border-[rgba(55,50,47,0.12)] !text-[#6B6460] hover:!text-[#37322F]",
          success: "!text-[#15803D]",
          error: "!text-[#C2410C]",
          warning: "!text-[#92400E]",
        },
      }}
      style={
        {
          '--normal-bg': '#FAFAF8',
          '--normal-border': 'rgba(55,50,47,0.12)',
          '--normal-text': '#37322F',
          '--success-bg': '#F0FDF4',
          '--success-border': 'rgba(21,128,61,0.2)',
          '--success-text': '#15803D',
          '--error-bg': '#FFF3EE',
          '--error-border': 'rgba(194,65,12,0.2)',
          '--error-text': '#C2410C',
          '--warning-bg': '#FFFBEB',
          '--warning-border': 'rgba(146,64,14,0.2)',
          '--warning-text': '#92400E',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
