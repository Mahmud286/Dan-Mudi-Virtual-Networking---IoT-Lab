export enum DeviceType {
  PC = 'PC',
  LAPTOP = 'LAPTOP',
  SERVER = 'SERVER',
  ROUTER = 'ROUTER',
  SWITCH = 'SWITCH',
  FIREWALL = 'FIREWALL',
  ACCESS_POINT = 'ACCESS_POINT',
  CLOUD = 'CLOUD',
  
  // IoT Types
  ARDUINO = 'ARDUINO',
  ESP32 = 'ESP32',
  RASPBERRY_PI = 'RASPBERRY_PI',
  GSM_MODULE = 'GSM_MODULE',
  
  SENSOR_TEMP = 'SENSOR_TEMP',
  SENSOR_MOISTURE = 'SENSOR_MOISTURE',
  SENSOR_GAS = 'SENSOR_GAS',
  SENSOR_WATER = 'SENSOR_WATER',
  SENSOR_MOTION = 'SENSOR_MOTION',
  
  ACTUATOR_LED = 'ACTUATOR_LED',
  ACTUATOR_MOTOR = 'ACTUATOR_MOTOR',
  RELAY = 'RELAY',
  ACTUATOR_BUZZER = 'ACTUATOR_BUZZER',
  ACTUATOR_SERVO = 'ACTUATOR_SERVO'
}

export enum CableType {
  STRAIGHT = 'STRAIGHT',
  CROSSOVER = 'CROSSOVER',
  FIBER = 'FIBER',
  SERIAL = 'SERIAL',
  GPIO = 'GPIO',
  USB = 'USB'
}

export interface NetworkInterface {
  id: string;
  name: string;
  ip: string;
  subnet: string;
  gateway: string;
  connectedToId?: string;
}

export interface Device {
  id: string;
  type: DeviceType;
  name: string;
  x: number;
  y: number;
  interfaces: NetworkInterface[];
  status: 'online' | 'offline' | 'booting';
  color?: string; // For LEDs (Hex code)
  // IoT Specific Properties
  code?: string; // C++ / Arduino code
  sensorValue?: number; // e.g. 25 (degrees), 1 (motion detected)
  actuatorState?: boolean; // On/Off
}

export interface Link {
  id: string;
  sourceId: string;
  targetId: string;
  type: CableType;
}

export interface LogEntry {
  timestamp: number;
  message: string;
  type: 'info' | 'error' | 'success' | 'command';
}

export interface TerminalMessage {
  role: 'user' | 'system';
  content: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  initialTopology: {
    devices: Device[];
    links: Link[];
  };
  goal: string;
}