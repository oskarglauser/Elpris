import React from 'react';
import { Receipt } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function CostCard() {
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex flex-col items-start">
        <Receipt className="w-5 h-5 mb-2" />
        <div className="text-xl font-normal">1625 <span className="text-sm">kr</span></div>
        <div className="text-xs text-muted-foreground">September</div>
      </div>
    </Card>
  );
}

