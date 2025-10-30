'use client';

import React, { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
import { ApplianceService, Appliance, PriceSlot, SavingsData } from '@/lib/appliance-service';
import * as LucideIcons from 'lucide-react';

interface DeviceListProps {
  applianceService: ApplianceService;
  priceData: PriceSlot[];
  onSettingsClick: () => void;
  onUpdate: () => void;
}

export function DeviceList({ applianceService, priceData, onSettingsClick, onUpdate }: DeviceListProps) {
  const [expandedDevices, setExpandedDevices] = useState<Set<number>>(new Set());
  const [expandedSavings, setExpandedSavings] = useState(false);

  const enabledAppliances = applianceService.getEnabledAppliances();

  if (enabledAppliances.length === 0) {
    return (
      <div className="px-4 py-2 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-normal">Dina enheter</h2>
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-[#F2EFEC] rounded transition-colors"
            >
              <Settings className="w-6 h-6 text-[#000000]" />
            </button>
          </div>
        </div>
        <div className="p-8 text-center bg-white rounded">
          <p className="text-muted-foreground">Lägg till apparater för att se bästa tiderna</p>
        </div>
      </div>
    );
  }

  if (priceData.length === 0) {
    return (
      <div className="px-4 py-2 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-normal">Dina enheter</h2>
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-[#F2EFEC] rounded transition-colors"
            >
              <Settings className="w-6 h-6 text-[#000000]" />
            </button>
          </div>
        </div>
        <div className="bg-white rounded">
          <div className="px-4 py-3 grid grid-cols-3 gap-3 items-center border-b border-[#E5E5E5]">
            <div className="text-xs text-[#000000] opacity-60">Enhet</div>
            <div className="text-xs text-[#000000] opacity-60 text-center">Billigast tid</div>
            <div className="text-xs text-[#000000] opacity-60 text-right">Besparing</div>
          </div>
          {enabledAppliances.map(appliance => (
            <div key={appliance.id} className="border-b border-[#E5E5E5] last:border-0">
              <div className="w-full px-4 py-2 grid grid-cols-3 gap-3 items-center opacity-50">
                <div className="text-sm text-[#000000]">{appliance.name}</div>
                <div className="text-xs text-[#000000] opacity-60 text-center">—</div>
                <div className="text-sm text-[#000000] text-right">—</div>
              </div>
            </div>
          ))}
          <div className="px-4 py-4 text-center">
            <div className="text-xs text-[#000000] opacity-60">Priser för imorgon är inte tillgängliga än</div>
          </div>
        </div>
      </div>
    );
  }

  let totalSavings = 0;
  const savingsDataMap = new Map<number, SavingsData>();

  const dailyAvgPrice = priceData.reduce((sum, slot) => sum + slot.price, 0) / priceData.length;

  enabledAppliances.forEach((appliance) => {
    const savingsData = applianceService.calculateSavings(appliance, dailyAvgPrice, priceData);
    if (savingsData) {
      totalSavings += savingsData.savingsKr;
      savingsDataMap.set(appliance.id, savingsData);
    }
  });

  const toggleDevice = (id: number) => {
    setExpandedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? IconComponent : LucideIcons.Zap;
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const totalYearly = totalSavings * 365;
  const dailySavings = totalSavings.toFixed(2);

  return (
    <div className="py-2 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-normal">Dina enheter</h2>
          <button
            onClick={onSettingsClick}
            className="p-2 hover:bg-[#F2EFEC] rounded transition-colors"
          >
            <Settings className="w-6 h-6 text-[#000000]" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded">
        <div className="px-4 py-3 grid grid-cols-3 gap-3 items-center border-b border-[#E5E5E5]">
          <div className="text-xs text-[#000000] opacity-60">Enhet</div>
          <div className="text-xs text-[#000000] opacity-60 text-center">Optimal tid</div>
          <div className="text-xs text-[#000000] opacity-60 text-right">Besparing</div>
        </div>

        {enabledAppliances.map((appliance) => {
          const savingsData = savingsDataMap.get(appliance.id);
          const isExpanded = expandedDevices.has(appliance.id);
          const Icon = getIconComponent(appliance.icon);

          return (
            <div key={appliance.id} className="border-b border-[#E5E5E5] last:border-0">
                <button
                  onClick={() => toggleDevice(appliance.id)}
                  className="w-full px-4 py-2 grid grid-cols-3 gap-3 items-center hover:bg-[#F2EFEC]/30 transition-colors text-left"
                >
                  <div className="text-sm text-[#000000] truncate">
                    {appliance.name}
                  </div>
                  <div className="text-xs text-[#000000] opacity-60 text-center whitespace-nowrap">
                    {savingsData ? (
                      <>
                        {formatTime(savingsData.bestSlots[0].time)}–
                        {formatTime(new Date(savingsData.bestSlots[savingsData.bestSlots.length - 1].time.getTime() + 15 * 60000))}
                      </>
                    ) : '—'}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div className="text-sm text-[#000000]">
                      {savingsData ? savingsData.savingsDisplay : '—'}
                    </div>
                    <ChevronDown className={`w-3 h-3 text-[#000000] opacity-40 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && savingsData && (
                  <div className="px-4 pb-2 text-xs text-[#000000] space-y-1">
                    <div className="flex justify-between">
                      <span className="opacity-60">Förbrukning</span>
                      <span>{appliance.kWh} kWh · {appliance.hours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-60">Snittpris</span>
                      <span>{savingsData.bestAvg.toFixed(1)} öre/kWh</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {totalSavings > 0 && (
          <div className="border-t border-[#E5E5E5] mt-2">
            <button
              onClick={() => setExpandedSavings(!expandedSavings)}
              className="w-full px-4 pt-3 pb-3 flex items-center justify-between hover:bg-[#F2EFEC]/30 transition-colors"
            >
              <div className="text-sm text-[#000000]">Årlig besparing</div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-sm text-[#009A33]">{totalYearly.toFixed(0)} kr</div>
                <ChevronDown className={`w-4 h-4 text-[#000000] opacity-40 transition-transform ${expandedSavings ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {expandedSavings && (
              <div className="px-4 pb-3 text-xs text-[#000000] space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-60">Daglig besparing</span>
                  <span>{dailySavings} kr</span>
                </div>
                <div className="pt-1 border-t border-[#E5E5E5]">
                  <div className="opacity-60 mb-1">Så räknas det ut:</div>
                  <div className="space-y-0.5">
                    <div>Jämför snittpris för dagen med bästa tid för varje enhet</div>
                    <div>Multiplicerar skillnaden med förbrukning (kWh)</div>
                    <div>Summerar alla enheter = daglig besparing</div>
                    <div className="pt-1">{dailySavings} kr × 365 dagar = {totalYearly.toFixed(0)} kr/år</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

