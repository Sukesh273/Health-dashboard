import { SensorType, SensorData } from './types';

// Helper to generate initial history
const initHistory = (val: number, count: number = 30) => Array(count).fill(val);

export const INITIAL_SENSORS: Record<SensorType, SensorData> = {
  [SensorType.TEMPERATURE]: {
    id: SensorType.TEMPERATURE,
    value: 36.5,
    unit: '°C',
    label: 'Body Temp',
    minSafe: 36.0,
    maxSafe: 37.5,
    minDisplay: 34,
    maxDisplay: 42,
    history: initHistory(36.5),
  },
  [SensorType.PULSE]: {
    id: SensorType.PULSE,
    value: 75,
    unit: 'BPM',
    label: 'Heart Rate',
    minSafe: 60,
    maxSafe: 100,
    minDisplay: 40,
    maxDisplay: 180,
    history: initHistory(75),
  },
  [SensorType.SOUND]: {
    id: SensorType.SOUND,
    value: 45,
    unit: 'dB',
    label: 'Ambience',
    minSafe: 0,
    maxSafe: 85,
    minDisplay: 0,
    maxDisplay: 120,
    history: initHistory(45),
  }
};

// Simulation ranges (min/max random values generated)
export const SIMULATION_RANGES = {
  [SensorType.TEMPERATURE]: { min: 35.0, max: 40.0 },
  [SensorType.PULSE]: { min: 50, max: 160 },
  [SensorType.SOUND]: { min: 20, max: 120 }
};