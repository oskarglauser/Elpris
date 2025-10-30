import React from 'react';
import { Gauge } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function PowerUsageCard() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex flex-col items-start">
        <Gauge className="w-5 h-5 mb-2" />
        <div className="text-xl font-normal">1254 <span className="text-sm">w</span></div>
        <div className="text-xs text-muted-foreground">Right now</div>
      </div>
    </Card>
  );
}

