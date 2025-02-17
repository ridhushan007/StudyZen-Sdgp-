'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart2, FileText, MessageCircle, User, Settings } from 'lucide-react'
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BarChart2, label: 'Progress', href: '/progress' },
  { icon: FileText, label: 'Journal', href: '/journal' },
  { icon: FileText, label: 'Quiz', href: '/quiz' },
  { icon: MessageCircle, label: 'Chat', href: '/chat' },
  { icon: MessageCircle, label: 'Confessions', href: '/confessions' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
          </div>
          <span className="text-xl font-bold">StudyZen</span>
        </Link>
        <nav className="mt-8 space-y-1.5">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href 
                  ? "bg-secondary text-secondary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}