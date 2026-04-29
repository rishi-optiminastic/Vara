"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { signOut } from "@/lib/auth-client"
import type { User, Advertiser } from "@prisma/client"
import {
  LayoutDashboard,
  Target,
  Users,
  Settings,
  Bell,
  Search,
  LogOut,
  Globe,
  BarChart3,
} from "lucide-react"
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
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/campaigns", icon: Target, label: "Campaigns" },
  { href: "/dashboard/segments", icon: Users, label: "Audiences" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/chains", icon: Globe, label: "Chains" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
] as const

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

interface Props {
  user: Pick<User, "id" | "name" | "email">
  advertiser: Pick<Advertiser, "id" | "projectName">
  children: React.ReactNode
}

export default function DashboardShell({ user, advertiser, children }: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true)
    await signOut()
    router.push("/sign-in")
    router.refresh()
  }

  const isActive = (href: string): boolean =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)

  return (
    <SidebarProvider style={{ "--sidebar-width": "13.5rem", "--sidebar-width-icon": "3rem" } as React.CSSProperties}>
      <Sidebar collapsible="icon" className="border-r border-[rgba(55,50,47,0.12)]">
        <SidebarHeader className="h-11 px-3 py-0 flex-row items-center gap-2 border-b border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
            <div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#37322F] text-[#FAFAF8] text-[10px] font-bold shadow-[0_0_0_2px_rgba(255,255,255,0.08)_inset] shrink-0">V</div>
            <span className="text-[13px] font-semibold tracking-tight text-[#37322F] truncate group-data-[collapsible=icon]:hidden">Varaads</span>
          </Link>
          <Badge variant="outline" className="ml-auto h-4 px-1.5 text-[9px] font-medium uppercase tracking-[0.12em] bg-white/60 border-[rgba(55,50,47,0.16)] group-data-[collapsible=icon]:hidden">DSP</Badge>
        </SidebarHeader>
        <SidebarContent className="gap-0">
          <SidebarGroup className="py-2">
            <div className="px-2 mb-1 group-data-[collapsible=icon]:hidden">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/80">Project</p>
              <p className="text-xs font-medium text-[#37322F] truncate">{advertiser.projectName}</p>
            </div>
            <SidebarGroupLabel className="h-5 text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70 mt-2">Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV.map((item) => (
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
        <SidebarFooter className="p-2 border-t border-[rgba(55,50,47,0.12)]">
          <div className="flex items-center gap-2 rounded-md border border-[rgba(55,50,47,0.12)] bg-white/60 p-1.5 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#37322F] text-[10px] font-semibold text-[#FAFAF8] shadow-[0_0_0_2px_rgba(255,255,255,0.08)_inset]">
              {initials(user.name || "U")}
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-[11px] font-medium leading-tight text-[#37322F]">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground leading-tight">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-[#F0ECE6] group-data-[collapsible=icon]:hidden"
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign out"
            >
              <LogOut className="size-3" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-[#F7F5F3]">
        <header className="sticky top-0 z-20 flex h-11 items-center gap-2 border-b border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6)] bg-[#F7F5F3]/85 backdrop-blur-sm px-3">
          <SidebarTrigger className="size-7 text-[#37322F] hover:bg-[#F0ECE6]" />
          <Separator orientation="vertical" className="h-4 bg-[rgba(55,50,47,0.12)]" />
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search campaigns, wallets, chains…" className="h-7 pl-7 text-xs bg-white border-[rgba(55,50,47,0.12)] focus-visible:border-[rgba(55,50,47,0.32)] focus-visible:ring-[rgba(55,50,47,0.06)]" />
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-7 w-7 relative hover:bg-[#F0ECE6]">
            <Bell className="size-3.5 text-[#37322F]" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#C2410C] ring-2 ring-[#F7F5F3]" />
          </Button>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
