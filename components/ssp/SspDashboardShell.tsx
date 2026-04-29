'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth-client'
import type { User } from '@prisma/client'
import {
  LayoutDashboard,
  Layers,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const NAV = [
  { href: '/ssp/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/ssp/dashboard/inventory', icon: Layers, label: 'Inventory' },
  { href: '/ssp/dashboard/payouts', icon: Wallet, label: 'Payouts' },
  { href: '/ssp/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/ssp/dashboard/settings', icon: Settings, label: 'Settings' },
] as const

function initials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface Props {
  user: Pick<User, 'id' | 'name' | 'email'>
  children: React.ReactNode
}

export default function SspDashboardShell({ user, children }: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true)
    await signOut()
    router.push('/ssp/sign-in')
    router.refresh()
  }

  const isActive = (href: string): boolean =>
    href === '/ssp/dashboard' ? pathname === '/ssp/dashboard' : pathname.startsWith(href)

  return (
    <SidebarProvider
      style={
        { '--sidebar-width': '13.5rem', '--sidebar-width-icon': '3rem' } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="h-11 px-3 py-0 flex-row items-center gap-2 border-b border-border shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          <Link href="/ssp/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="flex h-5 w-5 items-center justify-center rounded-[5px] text-[10px] font-bold shadow-[0_0_0_2px_rgba(255,255,255,0.08)_inset] shrink-0">
              V
            </div>
            <span className="text-[13px] font-semibold tracking-tight text-foreground truncate group-data-[collapsible=icon]:hidden">
              Vara
            </span>
          </Link>
          <Badge
            variant="outline"
            className="ml-auto h-4 px-1.5 text-[9px] font-medium uppercase tracking-[0.12em] bg-white/60 border-foreground/[0.16] group-data-[collapsible=icon]:hidden"
          >
            SSP
          </Badge>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <SidebarGroup className="py-2">
            <SidebarGroupLabel className="h-5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 mt-2">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map(item => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      isActive={isActive(item.href)}
                      className="h-7 text-xs"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-3.5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-border">
          <div className="flex items-center gap-2 rounded-md border border-border bg-white/60 p-1.5 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground shadow-[0_0_0_2px_rgba(255,255,255,0.08)_inset]">
              {initials(user.name || 'U')}
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-[11px] font-medium leading-tight text-foreground">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground leading-tight">
                {user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-muted group-data-[collapsible=icon]:hidden"
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign out"
            >
              <LogOut className="size-3" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-20 flex h-11 items-center gap-2 border-b border-border shadow-[0_1px_0_rgba(255,255,255,0.6)] bg-background/85 backdrop-blur-sm px-3">
          <SidebarTrigger className="size-7 text-foreground hover:bg-muted" />
          <Separator orientation="vertical" className="h-4 bg-border" />
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search placements, slots, payouts…"
              className="h-7 pl-7 text-xs bg-white border-border focus-visible:border-ring focus-visible:ring-foreground/[0.06]"
            />
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 relative hover:bg-muted">
            <Bell className="size-3.5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive ring-2 ring-background" />
          </Button>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
