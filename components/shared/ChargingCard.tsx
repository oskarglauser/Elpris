import React from 'react';
import { BatteryCharging } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ChargingCard() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex flex-col items-start">
        <BatteryCharging className="w-5 h-5 mb-2" />
        <div className="text-xl font-normal">0</div>
        <div className="text-xs text-muted-foreground">Not charging</div>
      </div>
    </Card>
  );
}

