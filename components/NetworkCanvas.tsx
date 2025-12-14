import React, { useRef, useState } from 'react';
import { Device, Link as NetworkLink, DeviceType, CableType } from '../types';
import { CABLE_STYLES } from '../constants';
import { 
  Monitor, Router, Server, Network, Laptop, X, Cpu, Wifi, 
  Thermometer, Droplets, Eye, Lightbulb, Fan, Shield, Cloud, 
  Radio, Smartphone, ToggleLeft, Wind, Bell, Settings2, Box
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
}

const DeviceIconComponent = ({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) => {
  switch (type) {
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
    case DeviceType.ESP32: return <Wifi className={className} style={style} />;
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
  if (isSelected) return 'bg-blue-600 ring-2 ring-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]';
  
  if (type.startsWith('SENSOR')) return 'bg-amber-800 hover:bg-amber-700 border-amber-600';
  if (type.startsWith('ACTUATOR')) return 'bg-emerald-800 hover:bg-emerald-700 border-emerald-600';
  if (type === DeviceType.ARDUINO || type === DeviceType.ESP32 || type === DeviceType.RASPBERRY_PI) return 'bg-teal-900 hover:bg-teal-800 border-teal-700';
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
  selectedDeviceId
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempConnection, setTempConnection] = useState<{ sourceId: string; endX: number; endY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, device: Device) => {
    e.stopPropagation();
    
    // Connection Mode: Start dragging a cable
    if (connectingMode) {
      setTempConnection({
        sourceId: device.id,
        endX: device.x + 32, // Start at center
        endY: device.y + 32
      });
    } else {
      // Normal Mode: Move device
      setDraggingId(device.id);
      setDragOffset({
        x: e.clientX - device.x,
        y: e.clientY - device.y
      });
      onSelectDevice(device);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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
        onMoveDevice(draggingId, mouseX - dragOffset.x, mouseY - dragOffset.y);
      }
    }
  };

  const handleMouseUpDevice = (e: React.MouseEvent, targetDevice: Device) => {
    e.stopPropagation();
    if (tempConnection && tempConnection.sourceId !== targetDevice.id) {
      onConnect(tempConnection.sourceId, targetDevice.id);
    }
    setTempConnection(null);
    setDraggingId(null);
  };

  const handleMouseUpCanvas = () => {
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
    return { x: d.x + 32, y: d.y + 32 }; 
  };

  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full bg-slate-900 overflow-hidden ${connectingMode ? 'cursor-crosshair' : 'cursor-default'}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpCanvas}
      style={{
        backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
        backgroundSize: '20px 20px'
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
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#0f172a" strokeWidth={style.width + 2} />
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
        
        // Custom style for LEDs with specific colors
        let customStyle: React.CSSProperties = {};
        if (device.color && device.type === DeviceType.ACTUATOR_LED && !isSelected) {
          // Override class styles with inline styles for custom LED colors
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
            className={`absolute flex flex-col items-center group w-16 h-16 select-none z-10`}
            style={{ 
              left: device.x, 
              top: device.y,
              transition: draggingId === device.id ? 'none' : 'box-shadow 0.2s'
            }}
            onMouseDown={(e) => handleMouseDown(e, device)}
            onMouseUp={(e) => handleMouseUpDevice(e, device)}
            onDoubleClick={(e) => handleDoubleClick(e, device)}
          >
            {/* Main Node Icon */}
            <div 
              className={`
                w-16 h-16 rounded-lg flex items-center justify-center transition-colors border shadow-lg
                ${colorClass}
              `}
              style={customStyle}
            >
              <DeviceIconComponent 
                type={device.type} 
                className={`w-8 h-8 ${!device.color ? 'text-slate-100' : ''}`} 
                style={device.color ? { color: device.color } : {}}
              />
            </div>

            {/* Label */}
            <div className="mt-2 px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-200 whitespace-nowrap border border-slate-700 pointer-events-none">
              {device.name}
            </div>

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
              onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
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
  );
};