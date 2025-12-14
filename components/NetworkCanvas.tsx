import React, { useRef, useState } from 'react';
import { Device, Link as NetworkLink, DeviceType, CableType } from '../types';
import { CABLE_STYLES } from '../constants';
import { 
  Monitor, Router, Server, Network, Laptop, X, Cpu, Wifi, 
  Thermometer, Droplets, Eye, Lightbulb, Fan, Shield, Cloud, 
  Radio, Smartphone, ToggleLeft, Wind, Bell, Settings2, Box,
  Play, Pause, Plus, MoreVertical
} from 'lucide-react';

interface NetworkCanvasProps {
  devices: Device[];
  links: NetworkLink[];
  onMoveDevice: (id: string, x: number, y: number) => void;
  onSelectDevice: (device: Device) => void;
  onDeviceDoubleClick: (device: Device) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onDeleteDevice: (id: string) => void;
  connectingMode: boolean;
  selectedCableType: CableType;
  selectedDeviceId?: string;
  isSimulationRunning?: boolean;
  onToggleSimulation?: () => void;
}

// Realistic ESP32 SVG Component
const ESP32Board = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 160 300" className={className} style={style}>
    {/* PCB Board */}
    <rect x="0" y="0" width="160" height="300" rx="10" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
    
    {/* Mounting Holes */}
    <circle cx="10" cy="10" r="5" fill="#eab308" />
    <circle cx="150" cy="10" r="5" fill="#eab308" />
    <circle cx="10" cy="290" r="5" fill="#eab308" />
    <circle cx="150" cy="290" r="5" fill="#eab308" />

    {/* Metal Shield (WROOM) */}
    <rect x="30" y="40" width="100" height="80" rx="4" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
    <text x="80" y="75" textAnchor="middle" fill="#4b5563" fontFamily="sans-serif" fontSize="16" fontWeight="bold">ESP32</text>
    <path d="M 65 90 Q 80 100 95 90" stroke="#4b5563" strokeWidth="2" fill="none" />
    
    {/* Antenna area */}
    <rect x="30" y="20" width="100" height="20" fill="#1a1a1a" />
    <polyline points="40,30 50,30 50,25 60,25 60,30 70,30" stroke="#d4af37" strokeWidth="2" fill="none" />
    <polyline points="90,30 100,30 100,25 110,25 110,30 120,30" stroke="#d4af37" strokeWidth="2" fill="none" />

    {/* Pins Left */}
    {Array.from({length: 15}).map((_, i) => (
      <g key={`l-${i}`} transform={`translate(0, ${60 + i * 15})`}>
        <rect x="-5" y="0" width="10" height="10" fill="#fbbf24" rx="2" />
        <text x="12" y="9" fill="#94a3b8" fontSize="8" fontFamily="monospace">G{i}</text>
      </g>
    ))}

    {/* Pins Right */}
    {Array.from({length: 15}).map((_, i) => (
      <g key={`r-${i}`} transform={`translate(155, ${60 + i * 15})`}>
        <rect x="0" y="0" width="10" height="10" fill="#fbbf24" rx="2" />
        <text x="-15" y="9" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="end">P{i}</text>
      </g>
    ))}

    {/* USB Connector */}
    <rect x="50" y="270" width="60" height="30" fill="#d1d5db" rx="2" />
    <rect x="55" y="270" width="50" height="25" fill="#9ca3af" rx="1" />

    {/* Chips */}
    <rect x="60" y="160" width="40" height="40" fill="#374151" rx="2" />
    <rect x="40" y="130" width="20" height="10" fill="#374151" />
    <rect x="100" y="130" width="20" height="10" fill="#374151" />

    {/* Status LED */}
    <circle cx="130" cy="260" r="3" fill="#ef4444" opacity="0.8" />
    <text x="125" y="270" fill="#64748b" fontSize="6">PWR</text>
  </svg>
);

const DeviceIconComponent = ({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) => {
  switch (type) {
    case DeviceType.ESP32: return <ESP32Board className={className} style={style} />;
    
    // Network
    case DeviceType.PC: return <Monitor className={className} style={style} />;
    case DeviceType.LAPTOP: return <Laptop className={className} style={style} />;
    case DeviceType.SERVER: return <Server className={className} style={style} />;
    case DeviceType.ROUTER: return <Router className={className} style={style} />;
    case DeviceType.SWITCH: return <Network className={className} style={style} />;
    case DeviceType.FIREWALL: return <Shield className={className} style={style} />;
    case DeviceType.ACCESS_POINT: return <Radio className={className} style={style} />;
    case DeviceType.CLOUD: return <Cloud className={className} style={style} />;
    
    // IoT Controllers
    case DeviceType.ARDUINO: return <Cpu className={className} style={style} />;
    case DeviceType.RASPBERRY_PI: return <Box className={className} style={style} />;
    case DeviceType.GSM_MODULE: return <Smartphone className={className} style={style} />;
    
    // Sensors & Actuators
    case DeviceType.SENSOR_TEMP: return <Thermometer className={className} style={style} />;
    case DeviceType.SENSOR_MOISTURE: return <Droplets className={className} style={style} />;
    case DeviceType.SENSOR_MOTION: return <Eye className={className} style={style} />;
    case DeviceType.SENSOR_GAS: return <Wind className={className} style={style} />;
    case DeviceType.SENSOR_WATER: return <Droplets className={className} style={style} />; // Reuse droplets
    case DeviceType.ACTUATOR_LED: return <Lightbulb className={className} style={style} />;
    case DeviceType.ACTUATOR_MOTOR: return <Fan className={className} style={style} />;
    case DeviceType.RELAY: return <ToggleLeft className={className} style={style} />;
    case DeviceType.ACTUATOR_BUZZER: return <Bell className={className} style={style} />;
    case DeviceType.ACTUATOR_SERVO: return <Settings2 className={className} style={style} />;
    
    default: return <Box className={className} style={style} />;
  }
};

const getDeviceColor = (type: string, isSelected: boolean) => {
  if (type === DeviceType.ESP32) return 'bg-transparent shadow-none border-none'; // Custom rendering for ESP32

  if (isSelected) return 'bg-blue-600 ring-2 ring-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]';
  
  if (type.startsWith('SENSOR')) return 'bg-amber-800 hover:bg-amber-700 border-amber-600';
  if (type.startsWith('ACTUATOR')) return 'bg-emerald-800 hover:bg-emerald-700 border-emerald-600';
  if (type === DeviceType.ARDUINO || type === DeviceType.RASPBERRY_PI) return 'bg-teal-900 hover:bg-teal-800 border-teal-700';
  if (type === DeviceType.FIREWALL) return 'bg-red-900 hover:bg-red-800 border-red-700';
  if (type === DeviceType.CLOUD) return 'bg-sky-900 hover:bg-sky-800 border-sky-700';
  
  return 'bg-slate-800 hover:bg-slate-700 border-slate-600'; // Default Network
};

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  devices,
  links,
  onMoveDevice,
  onSelectDevice,
  onDeviceDoubleClick,
  onConnect,
  onDeleteDevice,
  connectingMode,
  selectedCableType,
  selectedDeviceId,
  isSimulationRunning = false,
  onToggleSimulation
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempConnection, setTempConnection] = useState<{ sourceId: string; endX: number; endY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Use Pointer Events for unified Mouse/Touch handling
  const handlePointerDown = (e: React.PointerEvent, device: Device) => {
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Connection Mode: Start dragging a cable
        if (connectingMode) {
            setTempConnection({
                sourceId: device.id,
                endX: device.x + (device.type === DeviceType.ESP32 ? 60 : 32),
                endY: device.y + (device.type === DeviceType.ESP32 ? 100 : 32)
            });
        } else {
            // Normal Mode: Move device - Calculate offset relative to canvas coordinate system
            setDraggingId(device.id);
            setDragOffset({
                x: mouseX - device.x,
                y: mouseY - device.y
            });
            onSelectDevice(device);
        }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (tempConnection) {
        setTempConnection({
          ...tempConnection,
          endX: mouseX,
          endY: mouseY
        });
      } else if (draggingId) {
        // Apply offset to maintain relative position
        onMoveDevice(draggingId, mouseX - dragOffset.x, mouseY - dragOffset.y);
      }
    }
  };

  const handlePointerUpDevice = (e: React.PointerEvent, targetDevice: Device) => {
    e.stopPropagation();
    if (tempConnection && tempConnection.sourceId !== targetDevice.id) {
      onConnect(tempConnection.sourceId, targetDevice.id);
    }
    setTempConnection(null);
    setDraggingId(null);
  };

  const handlePointerUpCanvas = () => {
    setTempConnection(null);
    setDraggingId(null);
  };

  const handleDoubleClick = (e: React.MouseEvent, device: Device) => {
    e.stopPropagation();
    onDeviceDoubleClick(device);
  };

  const getCenter = (id: string) => {
    const d = devices.find(dev => dev.id === id);
    if (!d) return { x: 0, y: 0 };
    if (d.type === DeviceType.ESP32) return { x: d.x + 60, y: d.y + 100 };
    return { x: d.x + 32, y: d.y + 32 }; 
  };

  return (
    <div className="flex flex-col h-full bg-[#252526]">
       {/* Simulation Controls Toolbar */}
       <div className="h-10 bg-[#333333] border-b border-black/20 flex items-center px-4 justify-between shrink-0">
          
          {/* Simulation Label Pill */}
          <div className="bg-[#444] px-3 py-1 rounded text-[#ccc] text-xs font-semibold shadow-sm border border-[#555]">
              Simulation
          </div>

          <div className="flex items-center gap-2">
            <button 
                onClick={onToggleSimulation}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${isSimulationRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-[#10b981] hover:bg-[#059669]'}`}
                title={isSimulationRunning ? "Stop Simulation" : "Start Simulation"}
            >
                {isSimulationRunning ? <Pause size={16} className="text-white fill-current" /> : <Play size={16} className="text-white fill-current ml-0.5" />}
            </button>
            <button className="w-8 h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-colors" title="Add Component">
                <Plus size={18} />
            </button>
            <button className="w-8 h-8 hover:bg-white/10 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-colors">
                <MoreVertical size={18} />
            </button>
          </div>
       </div>

       {/* Canvas */}
       <div 
        ref={canvasRef}
        className={`relative flex-1 bg-[#1e1e1e] overflow-hidden ${connectingMode ? 'cursor-crosshair' : 'cursor-default'}`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpCanvas}
        onPointerLeave={handlePointerUpCanvas}
        style={{
            backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            touchAction: 'none' // Important for touch dragging
        }}
        >
        {/* Existing Connections */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {links.map(link => {
            const start = getCenter(link.sourceId);
            const end = getCenter(link.targetId);
            const style = CABLE_STYLES[link.type] || CABLE_STYLES[CableType.STRAIGHT];
            
            return (
                <g key={link.id}>
                {/* Background stroke for easier visibility */}
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#000" strokeWidth={style.width + 3} strokeOpacity="0.5" />
                <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={style.color}
                    strokeWidth={style.width}
                    strokeDasharray={style.dash}
                />
                </g>
            );
            })}

            {/* Temporary Dragging Connection */}
            {tempConnection && (() => {
            const start = getCenter(tempConnection.sourceId);
            const style = CABLE_STYLES[selectedCableType];
            return (
                <line 
                x1={start.x} 
                y1={start.y} 
                x2={tempConnection.endX} 
                y2={tempConnection.endY} 
                stroke={style.color} 
                strokeWidth={style.width}
                strokeDasharray={style.dash}
                className="opacity-70"
                />
            );
            })()}
        </svg>

        {/* Devices */}
        {devices.map(device => {
            const isSelected = selectedDeviceId === device.id;
            let colorClass = getDeviceColor(device.type, isSelected);
            const isESP32 = device.type === DeviceType.ESP32;
            
            // Custom style for LEDs with specific colors
            let customStyle: React.CSSProperties = {};
            if (device.color && device.type === DeviceType.ACTUATOR_LED && !isSelected) {
            colorClass = ''; 
            customStyle = {
                backgroundColor: `${device.color}15`, // Low opacity fill
                borderColor: device.color,
                borderWidth: '1px',
                boxShadow: `0 0 10px ${device.color}40`,
                color: device.color
            };
            }

            return (
            <div
                key={device.id}
                className={`absolute flex flex-col items-center group select-none z-10 ${isESP32 ? 'w-[120px] h-[200px]' : 'w-16 h-16'}`}
                style={{ 
                left: device.x, 
                top: device.y,
                transition: draggingId === device.id ? 'none' : 'box-shadow 0.2s',
                touchAction: 'none'
                }}
                onPointerDown={(e) => handlePointerDown(e, device)}
                onPointerUp={(e) => handlePointerUpDevice(e, device)}
                onDoubleClick={(e) => handleDoubleClick(e, device)}
            >
                {/* Main Node Icon */}
                <div 
                className={`
                    w-full h-full rounded-lg flex items-center justify-center transition-colors
                    ${colorClass}
                `}
                style={customStyle}
                >
                <DeviceIconComponent 
                    type={device.type} 
                    className={`${isESP32 ? 'w-full h-full drop-shadow-2xl' : 'w-8 h-8'} ${!device.color && !isESP32 ? 'text-slate-100' : ''}`} 
                    style={device.color ? { color: device.color } : {}}
                />
                </div>

                {/* Label */}
                {!isESP32 && (
                    <div className="mt-2 px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-200 whitespace-nowrap border border-slate-700 pointer-events-none">
                    {device.name}
                    </div>
                )}

                {/* Sensor Value Indicator */}
                {device.type.includes('SENSOR') && (
                <div className="absolute -top-2 right-0 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-blue-400 shadow-sm">
                    {device.sensorValue ?? 0}
                </div>
                )}

                <button
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDevice(device.id);
                }}
                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
                onDoubleClick={(e) => e.stopPropagation()} // Prevent modal open on delete
                >
                <X size={12} className="text-white" />
                </button>
            </div>
            );
        })}

        {connectingMode && !tempConnection && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white px-4 py-2 rounded-full text-xs font-medium border border-blue-500 pointer-events-none shadow-lg animate-fade-in z-30">
            Drag from one device to another to connect
            </div>
        )}
        </div>
    </div>
  );
};