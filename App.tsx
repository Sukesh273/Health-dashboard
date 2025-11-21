import React, { useState, useEffect, useCallback } from 'react';
import { Thermometer, Activity, Volume2, Zap } from 'lucide-react';
import { INITIAL_SENSORS, SIMULATION_RANGES } from './constants.ts';
import { SensorData, SensorType } from './types.ts';
import { SensorCard } from './components/SensorCard.tsx';
import { StatusPanel } from './components/StatusPanel.tsx';

const App: React.FC = () => {
  const [sensors, setSensors] = useState<Record<SensorType, SensorData>>(INITIAL_SENSORS);
  const [isSimulating, setIsSimulating] = useState(true);

  // Function to generate random value within a range
  const getRandomValue = (min: number, max: number, current: number): number => {
    // Create a "random walk" effect so values don't jump too wildly, but stay within simulation bounds
    const volatility = (max - min) * 0.1; 
    const change = (Math.random() - 0.5) * volatility;
    let newValue = current + change;
    
    // Clamp to simulation bounds
    if (newValue < min) newValue = min + Math.random();
    if (newValue > max) newValue = max - Math.random();
    
    return parseFloat(newValue.toFixed(1));
  };

  const updateSensors = useCallback(() => {
    setSensors(prev => {
      const newSensors = { ...prev };
      const HISTORY_LENGTH = 30;

      // Helper to update a single sensor
      const updateSensor = (type: SensorType, min: number, max: number, isInteger: boolean = false) => {
        const prevData = prev[type];
        let newVal = getRandomValue(min, max, prevData.value);
        if (isInteger) newVal = Math.round(newVal);
        
        // Update history
        const newHistory = [...prevData.history, newVal].slice(-HISTORY_LENGTH);

        newSensors[type] = {
          ...prevData,
          value: newVal,
          history: newHistory
        };
      };
      
      // Update Temperature
      const tempRange = SIMULATION_RANGES[SensorType.TEMPERATURE];
      updateSensor(SensorType.TEMPERATURE, tempRange.min, tempRange.max);

      // Update Pulse
      const pulseRange = SIMULATION_RANGES[SensorType.PULSE];
      updateSensor(SensorType.PULSE, pulseRange.min, pulseRange.max, true);

      // Update Sound
      const soundRange = SIMULATION_RANGES[SensorType.SOUND];
      updateSensor(SensorType.SOUND, soundRange.min, soundRange.max, true);

      return newSensors;
    });
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isSimulating) {
      intervalId = setInterval(updateSensors, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isSimulating, updateSensors]);

  // Calculate overall health
  const checkHealth = (): boolean => {
    const temp = sensors[SensorType.TEMPERATURE];
    const pulse = sensors[SensorType.PULSE];
    const sound = sensors[SensorType.SOUND];

    const isTempSafe = temp.value >= temp.minSafe && temp.value <= temp.maxSafe;
    const isPulseSafe = pulse.value >= pulse.minSafe && pulse.value <= pulse.maxSafe;
    const isSoundSafe = sound.value <= sound.maxSafe;

    return isTempSafe && isPulseSafe && isSoundSafe;
  };

  const overallHealthy = checkHealth();

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/30">
              <Zap className="text-neon-blue w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">
                BioSync <span className="text-cyan-400">Dashboard</span>
              </h1>
              <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">Real-time Sensor Monitoring v2.5</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end border-r border-gray-700 pr-4 mr-2 hidden sm:flex">
              <span className="text-gray-300 font-mono text-sm font-bold tracking-wider uppercase">Sukesh</span>
              <span className="text-cyan-500/70 font-mono text-xs">2401730273</span>
            </div>
            <button 
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all ${isSimulating ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'}`}
            >
              {isSimulating ? 'Simulation Active' : 'Simulation Paused'}
            </button>
          </div>
        </header>

        {/* Grid Layout */}
        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <SensorCard 
              data={sensors[SensorType.TEMPERATURE]} 
              icon={Thermometer} 
            />
            <SensorCard 
              data={sensors[SensorType.PULSE]} 
              icon={Activity} 
            />
            <SensorCard 
              data={sensors[SensorType.SOUND]} 
              icon={Volume2} 
            />
          </div>

          {/* Status Section */}
          <StatusPanel overallHealthy={overallHealthy} />
        </main>

        {/* Footer decoration */}
        <footer className="text-center text-gray-700 text-xs font-mono py-8">
          SECURE CONNECTION ESTABLISHED • END-TO-END ENCRYPTED • SERVER: US-EAST-4
        </footer>

      </div>
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
    </div>
  );
};

export default App;