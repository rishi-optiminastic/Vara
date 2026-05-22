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
            "!bg-card !border !border-border !text-foreground !shadow-lg !rounded-xl !p-3.5",
          title: "!text-foreground !font-medium !text-xs",
          description: "!text-muted-foreground !text-[11px]",
          icon: "!mt-0",
          closeButton:
            "!bg-surface !border-border !text-muted-foreground hover:!text-foreground",
          success: "!text-primary",
          error: "!text-primary",
          warning: "!text-primary",
        },
      }}
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-border': 'var(--border)',
          '--normal-text': 'var(--foreground)',
          '--success-bg': 'var(--card)',
          '--success-border': 'var(--border)',
          '--success-text': 'var(--primary)',
          '--error-bg': 'var(--card)',
          '--error-border': 'var(--border)',
          '--error-text': 'var(--primary)',
          '--warning-bg': 'var(--card)',
          '--warning-border': 'var(--border)',
          '--warning-text': 'var(--primary)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
