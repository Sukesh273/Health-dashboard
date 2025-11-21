import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SensorData, SensorStatus } from '../types';
import { CircularGauge } from './CircularGauge';
import { TrendGraph } from './TrendGraph';

interface SensorCardProps {
  data: SensorData;
  icon: LucideIcon;
}

const getStatus = (value: number, min: number, max: number): SensorStatus => {
  if (value < min || value > max) return SensorStatus.WARNING;
  return SensorStatus.NORMAL;
};

export const SensorCard: React.FC<SensorCardProps> = ({ data, icon: Icon }) => {
  const status = getStatus(data.value, data.minSafe, data.maxSafe);
  
  const isWarning = status === SensorStatus.WARNING;
  
  // Dynamic styles based on status
  const colorHex = isWarning ? '#ff003c' : '#00f3ff'; // Red or Neon Blue
  const textColorClass = isWarning ? 'text-neon-red' : 'text-neon-blue';
  const borderColorClass = isWarning ? 'border-neon-red neon-border-red' : 'border-cyan-500/30 neon-border-blue';
  const iconAnimation = data.id === 'PULSE' ? 'animate-pulse-fast' : '';

  // Helper for status text
  const getStatusText = () => {
    if (data.value < data.minSafe) return 'LOW';
    if (data.value > data.maxSafe) return 'HIGH';
    return 'NORMAL';
  };

  return (
    <div className={`glass-panel rounded-2xl p-6 flex flex-col items-center justify-between relative overflow-hidden transition-all duration-500 ${borderColorClass}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-2 z-10">
        <h2 className="text-xl font-mono uppercase tracking-widest text-gray-400">{data.label}</h2>
        <Icon className={`w-6 h-6 ${textColorClass} ${iconAnimation}`} />
      </div>

      {/* Visualization */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="relative">
          <CircularGauge 
            value={data.value}
            min={data.minDisplay}
            max={data.maxDisplay}
            color={colorHex}
            size={160}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold font-mono ${textColorClass} drop-shadow-md`}>
              {data.value.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 font-mono mt-1">{data.unit}</span>
          </div>
        </div>
        
        {/* Live Graph */}
        <div className="w-full mt-2">
          <TrendGraph 
            data={data.history} 
            min={data.minDisplay} 
            max={data.maxDisplay} 
            color={colorHex} 
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full flex justify-between items-center z-10 mt-4 bg-black/20 p-3 rounded-lg border border-white/5">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 uppercase">Range</span>
          <span className="text-xs font-mono text-gray-300">{data.minSafe} - {data.maxSafe} {data.unit}</span>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider border ${isWarning ? 'border-red-500 bg-red-500/20 text-red-400' : 'border-cyan-500 bg-cyan-500/20 text-cyan-400'}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Background decoration */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 ${isWarning ? 'bg-red-600' : 'bg-cyan-600'}`}></div>
    </div>
  );
};