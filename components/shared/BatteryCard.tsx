import React from 'react';
import { Car, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function BatteryCard() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex flex-col items-start">
        <div className="relative mb-2">
          <Car className="w-5 h-5" />
          <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5">
            <Zap className="w-2 h-2 text-primary-foreground" />
          </div>
        </div>
        <div className="text-xl font-normal">62 <span className="text-sm">%</span></div>
        <div className="text-xs text-muted-foreground">Battery</div>
      </div>
    </Card>
  );
}

