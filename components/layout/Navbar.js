'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, usePlan } from '@/lib/hooks/useAuth'
import { logout } from '@/lib/firebase/auth'
import { Sparkles, History, LayoutDashboard, Settings, LogOut, Zap } from 'lucide-react'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/generate',   label: 'Generer',    icon: Sparkles        },
  { href: '/historique', label: 'Historique', icon: History         },
]

export default function Navbar() {
  const pathname = usePathname()
  const { plan, isPro } = usePlan()

  return (
    <nav className="sticky top-0 z-50 bg-bg-surface border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-white">NAWER</Link>
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
              pathname === href ? 'bg-bg-elevated text-white' : 'text-nawer-text-secondary hover:text-white hover:bg-bg-elevated'
            }`}>
              <Icon size={14} />{label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {plan === 'free' && (
            <Link href="/settings" className="hidden sm:flex items-center gap-1 bg-accent-purple/10 border border-accent-purple/30 text-accent-purple text-xs px-2.5 py-1 rounded-full">
              <Zap size={10} /> Pro
            </Link>
          )}
          {isPro && <span className="text-accent-blue text-xs">Pro</span>}
          <Link href="/settings" className="p-1.5 text-nawer-text-muted hover:text-white rounded"><Settings size={16} /></Link>
          <button onClick={async () => { await logout(); window.location.href = '/login' }} className="p-1.5 text-nawer-text-muted hover:text-red-400 rounded"><LogOut size={15} /></button>
        </div>
      </div>
      <div className="md:hidden flex border-t border-border">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-2 text-xs ${pathname === href ? 'text-accent-blue' : 'text-nawer-text-muted'}`}>
            <Icon size={17} />{label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
