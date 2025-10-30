import { Header } from '@/components/shared/Header';
import { BottomNav } from '@/components/shared/BottomNav';
import { SpotPriceChart } from '@/components/prototypes/prototype-g/SpotPriceChart';
import { PowerUsageCard } from '@/components/shared/PowerUsageCard';
import { CostCard } from '@/components/shared/CostCard';
import { ChargingCard } from '@/components/shared/ChargingCard';
import { BatteryCard } from '@/components/shared/BatteryCard';

export default function PrototypeGHome() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="px-4 pb-4 pt-2 space-y-4">
        {/* Spot Price Chart */}
        <div className="mb-4">
          <SpotPriceChart prototypeId="g" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <PowerUsageCard />
          <CostCard />
          <ChargingCard />
          <BatteryCard />
        </div>
      </main>

      <BottomNav prototypePrefix="/prototype-g" />
    </div>
  );
}

