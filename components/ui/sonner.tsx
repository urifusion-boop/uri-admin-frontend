"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-right"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          background: '#ffffff',
          border: '1px solid #E5E5E5',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        },
        classNames: {
          toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-[#0d0e0f] group-[.toaster]:border-[#E5E5E5] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[#6C727F]',
          actionButton: 'group-[.toast]:bg-[#CD1B78] group-[.toast]:text-white group-[.toast]:hover:bg-[#a01560]',
          cancelButton: 'group-[.toast]:bg-[#F2F2F2] group-[.toast]:text-[#0d0e0f]',
          success: 'group-[.toast]:text-[#10b981]',
          error: 'group-[.toast]:text-[#ef4444]',
          warning: 'group-[.toast]:text-[#f59e0b]',
          info: 'group-[.toast]:text-[#3b82f6]',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
