import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';
import { SpotPriceChart } from '@/components/prototypes/prototype-d/SpotPriceChart';
import { PowerUsageCard } from '@/components/shared/PowerUsageCard';
import { CostCard } from '@/components/shared/CostCard';
import { ChargingCard } from '@/components/shared/ChargingCard';
import { BatteryCard } from '@/components/shared/BatteryCard';

export default function PrototypeDHome() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="px-4 pb-6 pt-4 space-y-4">
        <SpotPriceChart prototypeId="d" />

        <div className="grid grid-cols-2 gap-4">
          <PowerUsageCard />
          <CostCard />
          <ChargingCard />
          <BatteryCard />
        </div>
      </main>

      <BottomNav prototypePrefix="/prototype-d" />
    </div>
  );
}

