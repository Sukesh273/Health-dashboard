import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface StatusPanelProps {
  overallHealthy: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ overallHealthy }) => {
  const [uptimeSeconds, setUptimeSeconds] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setUptimeSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full glass-panel rounded-2xl p-8 mt-6 border-l-8 transition-all duration-500 ${overallHealthy ? 'border-l-neon-green' : 'border-l-neon-red'}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-full ${overallHealthy ? 'bg-green-500/10 text-neon-green' : 'bg-red-500/10 text-neon-red animate-pulse'}`}>
            {overallHealthy ? <CheckCircle2 size={48} /> : <AlertTriangle size={48} />}
          </div>
          <div>
            <h3 className="text-gray-400 uppercase tracking-widest text-sm font-mono mb-1">Overall System Status</h3>
            <h1 className={`text-3xl md:text-4xl font-bold font-mono ${overallHealthy ? 'text-white neon-text-green' : 'text-white neon-text-red'}`}>
              {overallHealthy ? 'OPTIMAL CONDITION' : 'CRITICAL WARNING'}
            </h1>
            <p className="text-gray-500 mt-2 max-w-md text-sm">
              {overallHealthy 
                ? 'All biological systems are operating within normal parameters. No anomalies detected.'
                : 'Abnormal readings detected in one or more sensors. Immediate attention required.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-xl border border-white/5">
           <Activity className="text-gray-600" />
           <div className="flex flex-col text-right">
             <span className="text-xs text-gray-500 uppercase">System Uptime</span>
             <span className="font-mono text-lg text-gray-300">{formatUptime(uptimeSeconds)}</span>
           </div>
        </div>

      </div>
    </div>
  );
};