export enum SensorStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum SensorType {
  TEMPERATURE = 'TEMPERATURE',
  PULSE = 'PULSE',
  SOUND = 'SOUND'
}

export interface SensorData {
  id: SensorType;
  value: number;
  unit: string;
  label: string;
  minSafe: number;
  maxSafe: number;
  minDisplay: number;
  maxDisplay: number;
  history: number[];
}

export interface SystemStatus {
  isHealthy: boolean;
  message: string;
}