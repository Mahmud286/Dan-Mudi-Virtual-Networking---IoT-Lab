import { CableType } from "./types";

export const GEMINI_MODEL_FLASH = 'gemini-2.5-flash';
export const GEMINI_MODEL_PRO = 'gemini-3-pro-preview';

export const DEFAULT_SUBNET = '255.255.255.0';
export const DEFAULT_GATEWAY = '0.0.0.0';

export const CABLE_STYLES: Record<CableType, { color: string, width: number, dash?: string }> = {
  [CableType.STRAIGHT]: { color: '#000000', width: 2 }, // Solid Black
  [CableType.CROSSOVER]: { color: '#000000', width: 2, dash: '5,5' }, // Dashed Black
  [CableType.FIBER]: { color: '#ea580c', width: 2 }, // Orange
  [CableType.SERIAL]: { color: '#2563eb', width: 2 }, // Blue
  [CableType.GPIO]: { color: '#16a34a', width: 1 }, // Green (thin)
  [CableType.USB]: { color: '#64748b', width: 2 } // Grey
};

// Only used for lookup, rendering handled in NetworkCanvas
export const DEVICE_ICONS: Record<string, string> = {
  PC: 'Monitor',
  ROUTER: 'Router',
  SWITCH: 'Network',
  SERVER: 'Server',
  ARDUINO: 'Cpu',
  ESP32: 'Wifi',
  SENSOR_TEMP: 'Thermometer',
  SENSOR_MOISTURE: 'Droplets',
  SENSOR_MOTION: 'Eye',
  ACTUATOR_LED: 'Lightbulb',
  ACTUATOR_MOTOR: 'Fan'
};

export const DEFAULT_ARDUINO_CODE = `void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  Serial.println("System Running...");
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`;

export const INITIAL_CHALLENGES = [
  {
    id: 'ping-basics',
    title: 'Ping Basics',
    description: 'Two PCs are connected to a Switch. Configure them with IP addresses in the same subnet and successfully ping between them.',
    difficulty: 'Beginner',
    goal: 'Ensure PC1 (192.168.1.10) can ping PC2 (192.168.1.11)',
    initialTopology: {
      devices: [
        { id: 'dev-1', type: 'PC', name: 'PC1', x: 100, y: 150, status: 'online', interfaces: [{ id: 'if-1', name: 'eth0', ip: '', subnet: '', gateway: '' }] },
        { id: 'dev-2', type: 'PC', name: 'PC2', x: 500, y: 150, status: 'online', interfaces: [{ id: 'if-2', name: 'eth0', ip: '', subnet: '', gateway: '' }] },
        { id: 'dev-3', type: 'SWITCH', name: 'Switch1', x: 300, y: 300, status: 'online', interfaces: [] }
      ],
      links: [
        { id: 'link-1', sourceId: 'dev-1', targetId: 'dev-3', type: CableType.STRAIGHT },
        { id: 'link-2', sourceId: 'dev-2', targetId: 'dev-3', type: CableType.STRAIGHT }
      ]
    }
  }
];