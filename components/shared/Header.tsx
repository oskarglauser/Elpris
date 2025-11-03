import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, Bell } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { WeatherDisplay } from './WeatherDisplay';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        
          <Image
            src="/fonts/Greenely-symbol.svg"
            alt="Greenely"
            width={28}
            height={0}
            style={{ width: '24px', height: 'auto' }}
          />
          <Image
            src="/fonts/Greenely-logotype.svg"
            alt="greenely"
            width={90}
            height={0}
            style={{ width: '90px', height: 'auto' }}
          />
       

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-secondary rounded transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Location and Weather */}
      <div className="flex items-center justify-between px-4 pb-3">
        <LocationSelector />
        <WeatherDisplay />
      </div>
    </header>
  );
}

