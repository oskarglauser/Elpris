'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart3, Zap, User } from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export function BottomNav({ prototypePrefix = '' }: { prototypePrefix?: string }) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Hem',
      icon: <Home className="w-5 h-5" />,
      href: prototypePrefix || '/',
    },
    {
      label: 'Insikter',
      icon: <BarChart3 className="w-5 h-5" />,
      href: `${prototypePrefix}/insights`,
    },
    {
      label: 'Enheter',
      icon: <Zap className="w-5 h-5" />,
      href: `${prototypePrefix}/devices`,
    },
    {
      label: 'Profil',
      icon: <User className="w-5 h-5" />,
      href: `${prototypePrefix}/profile`,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <div className={isActive ? 'text-foreground' : ''}>{item.icon}</div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

