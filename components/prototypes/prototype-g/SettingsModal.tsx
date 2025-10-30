'use client';

import React, { useState } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { ApplianceService, Appliance } from '@/lib/appliance-service';
import * as LucideIcons from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applianceService: ApplianceService;
  onUpdate: () => void;
}

export function SettingsModal({ isOpen, onClose, applianceService, onUpdate }: SettingsModalProps) {
  const [expandedSettings, setExpandedSettings] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const appliances = applianceService.getAppliances();

  const toggleAppliance = (id: number) => {
    applianceService.toggleAppliance(id);
    onUpdate();
  };

  const toggleSettings = (id: number) => {
    setExpandedSettings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const updateField = (id: number, field: keyof Appliance, value: any) => {
    applianceService.updateApplianceField(id, field, value);
    onUpdate();
  };

  const updateTimeWindow = (id: number, field: 'start' | 'end', value: number) => {
    applianceService.updateTimeWindow(id, field, value);
    onUpdate();
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? IconComponent : LucideIcons.Zap;
  };

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-normal">Enheter</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F2EFEC] rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3">
          {appliances.map((app) => {
            const isExpanded = expandedSettings.has(app.id);
            const Icon = getIconComponent(app.icon);

            return (
              <div key={app.id} className="bg-[#F2EFEC] rounded">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6" />
                    <div className="text-sm">{app.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSettings(app.id)}
                      className="p-2 hover:bg-[#CDC8C2] rounded transition-colors"
                    >
                      <SettingsIcon className="w-5 h-5 text-[#000000]" />
                    </button>
                    <button
                      onClick={() => toggleAppliance(app.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                        app.enabled ? 'bg-[#009A33]' : 'bg-[#CDC8C2]'
                      }`}
                      role="switch"
                      aria-checked={app.enabled}
                    >
                      <span
                        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
                          app.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-[#CDC8C2] pt-3">
                    <div>
                      <label className="text-xs text-[#000000] opacity-75 mb-1 block">
                        Förbrukning (kWh)
                      </label>
                      <input
                        type="number"
                        value={app.kWh}
                        onChange={(e) => updateField(app.id, 'kWh', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]"
                        step="0.1"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#000000] opacity-75 mb-1 block">
                        Tid (timmar)
                      </label>
                      <input
                        type="number"
                        value={app.hours}
                        onChange={(e) => updateField(app.id, 'hours', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]"
                        step="0.5"
                        min="0.5"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-[#000000] opacity-75 mb-1 block">
                        Tidsfönster
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={app.timeWindow.start}
                          onChange={(e) => updateTimeWindow(app.id, 'start', parseInt(e.target.value))}
                          className="flex-1 px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]"
                          min="0"
                          max="23"
                          placeholder="Från"
                        />
                        <span className="flex items-center text-sm">–</span>
                        <input
                          type="number"
                          value={app.timeWindow.end}
                          onChange={(e) => updateTimeWindow(app.id, 'end', parseInt(e.target.value))}
                          className="flex-1 px-3 py-2 bg-white rounded text-sm border border-[#CDC8C2]"
                          min="0"
                          max="24"
                          placeholder="Till"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

