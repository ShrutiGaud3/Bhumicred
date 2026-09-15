import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Card } from '../ui/Card.jsx';

const MOCK_MANDI_COMMODITIES = [];
const FORECAST_DAYS = [];

export const MandiWeatherWidget = () => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'MANDI', 'WEATHER'

  return (
    <div className="w-full space-y-4">
      {/* 1. Live Mandi Commodity Price Marquee Ticker */}
      <div className="bg-gradient-to-r from-emerald-900 via-neutral-900 to-slate-900 text-white rounded-2xl p-3 shadow-lg border border-emerald-800/40 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE MANDI APMC
          </div>

          {/* Marquee ticker list */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none whitespace-nowrap text-xs font-medium">
            {MOCK_MANDI_COMMODITIES.length > 0 ? (
              MOCK_MANDI_COMMODITIES.map((c, idx) => (
                <div key={idx} className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/10 shrink-0">
                  <span className="text-neutral-300 font-semibold">{c.name}:</span>
                  <span className="font-bold text-white">{c.price}</span>
                  <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${c.trend === 'UP' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.trend === 'UP' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {c.change}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-normal">({c.mandi})</span>
                </div>
              ))
            ) : (
              <span className="text-neutral-400 text-xs italic">Live APMC spot price stream will connect to regional mandis.</span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Micro-Climate 7-Day Satellite Weather Card */}
      <Card className="p-5 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                Hyperlocal Agro-Meteorological Weather Radar
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  IMD Grid Active
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Agro-Climatic Zone Doppler Satellite Telemetry Feed
              </p>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Grid or Connecting State */}
        {FORECAST_DAYS.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-4">
            {FORECAST_DAYS.map((f, idx) => {
              const Icon = f.icon;
              const isToday = idx === 0;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isToday
                      ? 'bg-primary-50/60 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800 shadow-sm'
                      : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700/60'
                  }`}
                >
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">{f.day}</span>
                  <Icon className={`w-6 h-6 mx-auto my-1.5 ${f.rain > '50%' ? 'text-blue-500' : 'text-amber-500'}`} />
                  <div className="text-sm font-black text-neutral-900 dark:text-white">{f.temp}</div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                    Rain: {f.rain}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-neutral-400">
            Hyperlocal satellite agro-meteorological forecast radar will sync when location sensors connect.
          </div>
        )}
      </Card>
    </div>
  );
};
