import React, { useRef, useState, useEffect } from 'react';
import { Device, Link as NetworkLink, DeviceType, CableType } from '../types';
import { CABLE_STYLES, DEVICE_ICONS } from '../constants';
import { 
  Monitor, Router, Server, Network, Laptop, X, Cpu, Wifi, 
  Thermometer, Droplets, Eye, Lightbulb, Fan, Shield, Cloud, 
  Radio, Smartphone, ToggleLeft, Wind, Bell, Settings2, Box,
  Play, Pause, Plus, MoreVertical, Trash2, Printer
} from 'lucide-react';

interface NetworkCanvasProps {
  devices: Device[];
  links: NetworkLink[];
  onMoveDevice: (id: string, x: number, y: number) => void;
  onSelectDevice: (device: Device) => void;
  onDeviceDoubleClick: (device: Device) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onDeleteDevice: (id: string) => void;
  onDeleteLink: (id: string) => void;
  onClearCanvas: () => void;
  onAddDevice: (type: DeviceType) => void;
  toolMode: 'cursor' | 'connect' | 'erase';
  selectedCableType: CableType;
  selectedDeviceId?: string;
  isSimulationRunning?: boolean;
  onToggleSimulation?: () => void;
}

// --- Cisco Packet Tracer Style SVG Components ---

const CiscoRouter = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} filter="drop-shadow(3px 3px 2px rgba(0,0,0,0.3))">
    <circle cx="50" cy="50" r="48" fill="#005e9c" stroke="#333" strokeWidth="1" />
    <g transform="translate(50,50)">
        <path d="M -20 0 L 20 0" stroke="white" strokeWidth="4" />
        <path d="M 0 -20 L 0 20" stroke="white" strokeWidth="4" />
        
        <path d="M 20 0 L 10 -8 M 20 0 L 10 8" stroke="white" strokeWidth="3" fill="none" />
        <path d="M -20 0 L -10 -8 M -20 0 L -10 8" stroke="white" strokeWidth="3" fill="none" />
        <path d="M 0 20 L -8 10 M 0 20 L 8 10" stroke="white" strokeWidth="3" fill="none" />
        <path d="M 0 -20 L -8 -10 M 0 -20 L 8 -10" stroke="white" strokeWidth="3" fill="none" />
    </g>
    <defs>
        <radialGradient id="routerGrad" cx="30%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#routerGrad)" />
  </svg>
);

const CiscoSwitch = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 60" className={className} style={style} filter="drop-shadow(3px 3px 2px rgba(0,0,0,0.3))">
    <rect x="2" y="2" width="96" height="56" fill="#005e9c" stroke="#333" strokeWidth="1" rx="4" />
    <g transform="translate(50,30)">
        <path d="M -25 -8 L 25 -8" stroke="white" strokeWidth="3" />
        <path d="M 25 -8 L 18 -14 M 25 -8 L 18 -2" stroke="white" strokeWidth="3" fill="none" />
        
        <path d="M 25 8 L -25 8" stroke="white" strokeWidth="3" />
        <path d="M -25 8 L -18 2 M -25 8 L -18 14" stroke="white" strokeWidth="3" fill="none" />
    </g>
    <rect x="2" y="2" width="96" height="56" fill="url(#routerGrad)" rx="4"/>
  </svg>
);

const CiscoPC = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 100" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <rect x="10" y="10" width="80" height="60" rx="4" fill="#e8e4c9" stroke="#555" strokeWidth="1"/>
        <rect x="15" y="15" width="70" height="50" fill="#222" />
        <rect x="40" y="70" width="20" height="15" fill="#e8e4c9" stroke="#555" strokeWidth="1"/>
        <path d="M 30 85 L 70 85 L 75 95 L 25 95 Z" fill="#e8e4c9" stroke="#555" strokeWidth="1"/>
        <rect x="80" y="40" width="18" height="55" rx="1" fill="#e8e4c9" stroke="#555" strokeWidth="1" />
        <line x1="85" y1="50" x2="93" y2="50" stroke="#aaa" strokeWidth="2" />
    </svg>
);

const CiscoLaptop = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 80" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <path d="M 15 10 L 85 10 L 85 55 L 15 55 Z" fill="#e8e4c9" stroke="#555" strokeWidth="1" />
        <rect x="20" y="15" width="60" height="35" fill="#222" />
        <path d="M 5 55 L 95 55 L 90 75 L 10 75 Z" fill="#d0ccb0" stroke="#555" strokeWidth="1" />
        <rect x="40" y="65" width="20" height="8" fill="#aaa" rx="1" />
    </svg>
);

const CiscoServer = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 60 100" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <rect x="5" y="5" width="50" height="90" rx="2" fill="#005e9c" stroke="#333" strokeWidth="1" />
        {[20, 35, 50, 65, 80].map(y => (
            <line key={y} x1="10" y1={y} x2="50" y2={y} stroke="#88b5dd" strokeWidth="2" />
        ))}
        <circle cx="45" cy="12" r="2" fill="#0f0" />
        <circle cx="38" cy="12" r="2" fill="#0f0" />
    </svg>
);

const CiscoPrinter = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 100" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <path d="M 20 40 L 80 40 L 80 80 L 20 80 Z" fill="#e8e4c9" stroke="#555" strokeWidth="1" />
        <path d="M 25 40 L 25 20 L 75 20 L 75 40" fill="white" stroke="#ccc" strokeWidth="1" />
        <rect x="30" y="50" width="40" height="20" fill="#ccc" />
        <line x1="35" y1="60" x2="65" y2="60" stroke="#999" strokeWidth="1"/>
    </svg>
);

const CiscoFirewall = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 60" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <rect x="5" y="10" width="90" height="40" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
        <path d="M 5 20 L 95 20 M 5 30 L 95 30 M 5 40 L 95 40" stroke="#fca5a5" strokeWidth="1" />
        <path d="M 30 10 L 30 20 M 60 10 L 60 20 M 80 10 L 80 20" stroke="#fca5a5" strokeWidth="1" />
        <path d="M 15 20 L 15 30 M 45 20 L 45 30 M 75 20 L 75 30" stroke="#fca5a5" strokeWidth="1" />
        <path d="M 30 30 L 30 40 M 60 30 L 60 40" stroke="#fca5a5" strokeWidth="1" />
        <defs>
             <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
             </linearGradient>
        </defs>
        <rect x="5" y="10" width="90" height="40" fill="url(#wallGrad)" />
    </svg>
);

const CiscoCloud = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 70" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <path d="M 25 45 Q 10 45 10 30 Q 10 15 30 15 Q 40 0 60 10 Q 80 0 90 20 Q 100 30 90 50 Q 80 65 60 60 Q 40 70 25 45 Z" fill="white" stroke="#bbb" strokeWidth="1" />
    </svg>
);

const CiscoAccessPoint = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 80 80" className={className} style={style} filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.3))">
        <rect x="20" y="40" width="40" height="30" fill="#005e9c" stroke="#333" strokeWidth="1" />
        <line x1="40" y1="40" x2="40" y2="20" stroke="#333" strokeWidth="2" />
        <path d="M 30 20 Q 40 10 50 20" stroke="#333" strokeWidth="2" fill="none" />
        <path d="M 25 15 Q 40 0 55 15" stroke="#333" strokeWidth="2" fill="none" />
    </svg>
);

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
    // Custom Packet Tracer Style
    case DeviceType.ESP32: return <ESP32Board className={className} style={style} />;
    case DeviceType.ROUTER: return <CiscoRouter className={className} style={style} />;
    case DeviceType.SWITCH: return <CiscoSwitch className={className} style={style} />;
    case DeviceType.PC: return <CiscoPC className={className} style={style} />;
    case DeviceType.LAPTOP: return <CiscoLaptop className={className} style={style} />;
    case DeviceType.SERVER: return <CiscoServer className={className} style={style} />;
    case DeviceType.PRINTER: return <CiscoPrinter className={className} style={style} />;
    case DeviceType.FIREWALL: return <CiscoFirewall className={className} style={style} />;
    case DeviceType.ACCESS_POINT: return <CiscoAccessPoint className={className} style={style} />;
    case DeviceType.CLOUD: return <CiscoCloud className={className} style={style} />;

    // IoT Controllers
    case DeviceType.ARDUINO: return <Cpu className={className} style={style} />;
    case DeviceType.RASPBERRY_PI: return <Box className={className} style={style} />;
    case DeviceType.GSM_MODULE: return <Smartphone className={className} style={style} />;
    
    // Sensors & Actuators
    case DeviceType.SENSOR_TEMP: return <Thermometer className={className} style={style} />;
    case DeviceType.SENSOR_MOISTURE: return <Droplets className={className} style={style} />;
    case DeviceType.SENSOR_MOTION: return <Eye className={className} style={style} />;
    case DeviceType.SENSOR_GAS: return <Wind className={className} style={style} />;
    case DeviceType.SENSOR_WATER: return <Droplets className={className} style={style} />; 
    case DeviceType.ACTUATOR_LED: return <Lightbulb className={className} style={style} />;
    case DeviceType.ACTUATOR_MOTOR: return <Fan className={className} style={style} />;
    case DeviceType.RELAY: return <ToggleLeft className={className} style={style} />;
    case DeviceType.ACTUATOR_BUZZER: return <Bell className={className} style={style} />;
    case DeviceType.ACTUATOR_SERVO: return <Settings2 className={className} style={style} />;
    
    default: return <Box className={className} style={style} />;
  }
};

const getDeviceColor = (type: string, isSelected: boolean) => {
  // Types that have custom SVGs (no background box)
  const isCustomRender = [
      DeviceType.ESP32,
      DeviceType.ROUTER, DeviceType.SWITCH, DeviceType.PC, DeviceType.LAPTOP,
      DeviceType.SERVER, DeviceType.PRINTER, DeviceType.FIREWALL, 
      DeviceType.CLOUD, DeviceType.ACCESS_POINT
  ].includes(type as DeviceType);

  if (isCustomRender) {
      if (isSelected) return 'bg-transparent ring-2 ring-blue-500 rounded-lg'; 
      return 'bg-transparent border-none shadow-none';
  }

  // Standard Lucide Icon containers
  if (isSelected) return 'bg-blue-600 ring-2 ring-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]';
  
  if (type.startsWith('SENSOR')) return 'bg-amber-800 hover:bg-amber-700 border-amber-600';
  if (type.startsWith('ACTUATOR')) return 'bg-emerald-800 hover:bg-emerald-700 border-emerald-600';
  if (type === DeviceType.ARDUINO || type === DeviceType.RASPBERRY_PI) return 'bg-teal-900 hover:bg-teal-800 border-teal-700';
  
  return 'bg-slate-800 hover:bg-slate-700 border-slate-600'; // Default
};

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  devices,
  links,
  onMoveDevice,
  onSelectDevice,
  onDeviceDoubleClick,
  onConnect,
  onDeleteDevice,
  onDeleteLink,
  onClearCanvas,
  onAddDevice,
  toolMode,
  selectedCableType,
  selectedDeviceId,
  isSimulationRunning = false,
  onToggleSimulation
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempConnection, setTempConnection] = useState<{ sourceId: string; endX: number; endY: number } | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
        setShowAddMenu(false);
        setShowOptionsMenu(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Use Pointer Events for unified Mouse/Touch handling
  const handlePointerDown = (e: React.PointerEvent, device: Device) => {
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);

    // ERASER TOOL LOGIC
    if (toolMode === 'erase') {
        onDeleteDevice(device.id);
        return;
    }

    if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // CONNECT TOOL LOGIC
        if (toolMode === 'connect') {
            setTempConnection({
                sourceId: device.id,
                endX: device.x + (device.type === DeviceType.ESP32 ? 60 : 32),
                endY: device.y + (device.type === DeviceType.ESP32 ? 100 : 32)
            });
        } else {
            // MOVE TOOL LOGIC
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
    // Packet Tracer devices center adjustment
    const isNetwork = [DeviceType.ROUTER, DeviceType.SWITCH, DeviceType.PC, DeviceType.LAPTOP, DeviceType.SERVER, DeviceType.PRINTER, DeviceType.FIREWALL, DeviceType.CLOUD, DeviceType.ACCESS_POINT].includes(d.type as DeviceType);
    if (isNetwork) return { x: d.x + 40, y: d.y + 40 }; // Center of 80x80 box
    
    return { x: d.x + 32, y: d.y + 32 }; 
  };

  const quickAddOptions = [
      { type: DeviceType.ESP32, label: 'ESP32', icon: <Wifi size={14} /> },
      { type: DeviceType.ARDUINO, label: 'Arduino', icon: <Cpu size={14} /> },
      { type: DeviceType.ACTUATOR_LED, label: 'LED', icon: <Lightbulb size={14} /> },
      { type: DeviceType.SENSOR_TEMP, label: 'DHT Sensor', icon: <Thermometer size={14} /> },
      { type: DeviceType.PC, label: 'PC', icon: <Monitor size={14} /> },
      { type: DeviceType.SWITCH, label: 'Switch', icon: <Network size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full bg-[#252526]">
       {/* Simulation Controls Toolbar */}
       <div className="h-10 bg-[#333333] border-b border-black/20 flex items-center px-4 justify-between shrink-0 relative z-20">
          
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
            
            {/* Add Component Menu */}
            <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowAddMenu(!showAddMenu); setShowOptionsMenu(false); }}
                    className="w-8 h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg transition-colors" 
                    title="Quick Add Component"
                >
                    <Plus size={18} />
                </button>
                {showAddMenu && (
                    <div className="absolute right-0 top-10 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-48 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-900/50">Quick Add</div>
                        {quickAddOptions.map((opt, i) => (
                            <button 
                                key={i}
                                onClick={() => onAddDevice(opt.type)}
                                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-blue-600 hover:text-white flex items-center gap-2"
                            >
                                {opt.icon}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Options Menu */}
            <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(!showOptionsMenu); setShowAddMenu(false); }}
                    className="w-8 h-8 hover:bg-white/10 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-colors"
                >
                    <MoreVertical size={18} />
                </button>
                {showOptionsMenu && (
                    <div className="absolute right-0 top-10 bg-slate-800 border border-slate-700 rounded-lg shadow-xl w-40 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                        <button 
                            onClick={onClearCanvas}
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/50 flex items-center gap-2"
                        >
                            <Trash2 size={14} />
                            Clear Canvas
                        </button>
                    </div>
                )}
            </div>
          </div>
       </div>

       {/* Canvas */}
       <div 
        ref={canvasRef}
        className={`relative flex-1 bg-[#1e1e1e] overflow-hidden ${toolMode === 'connect' ? 'cursor-crosshair' : toolMode === 'erase' ? 'cursor-not-allowed' : 'cursor-default'}`}
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
            const isEraseMode = toolMode === 'erase';
            
            return (
                <g 
                    key={link.id}
                    onPointerDown={(e) => {
                        if (isEraseMode) {
                            e.stopPropagation();
                            onDeleteLink(link.id);
                        }
                    }}
                    style={{ 
                        pointerEvents: isEraseMode ? 'all' : 'none', // Capture clicks ONLY when erasing
                        cursor: isEraseMode ? 'pointer' : 'default' 
                    }}
                    className={isEraseMode ? "hover:opacity-50" : ""}
                >
                {/* Hit area - invisible wider stroke for easier clicking */}
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="transparent" strokeWidth="20" />
                
                {/* Visual Lines */}
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#000" strokeWidth={style.width + 3} strokeOpacity="0.5" />
                <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={isEraseMode ? "#ef4444" : style.color} // Turn red when erasing to indicate target
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
            const isNetwork = [DeviceType.ROUTER, DeviceType.SWITCH, DeviceType.PC, DeviceType.LAPTOP, DeviceType.SERVER, DeviceType.PRINTER, DeviceType.FIREWALL, DeviceType.CLOUD, DeviceType.ACCESS_POINT].includes(device.type as DeviceType);
            
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
                className={`absolute flex flex-col items-center group select-none z-10 ${isESP32 ? 'w-[120px] h-[200px]' : (isNetwork ? 'w-20 h-20' : 'w-16 h-16')} ${toolMode === 'erase' ? 'hover:opacity-50 hover:scale-95' : ''}`}
                style={{ 
                left: device.x, 
                top: device.y,
                transition: draggingId === device.id ? 'none' : 'box-shadow 0.2s, transform 0.1s',
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
                    ${toolMode === 'erase' ? 'ring-2 ring-red-500 cursor-not-allowed' : ''}
                `}
                style={customStyle}
                >
                <DeviceIconComponent 
                    type={device.type} 
                    className={`${isESP32 ? 'w-full h-full drop-shadow-2xl' : 'w-full h-full'} ${!device.color && !isESP32 && !isNetwork ? 'text-slate-100' : ''}`} 
                    style={device.color ? { color: device.color } : {}}
                />
                </div>

                {/* Label */}
                {!isESP32 && (
                    <div className="mt-1 px-2 py-0.5 bg-slate-800/80 rounded text-[10px] text-slate-200 whitespace-nowrap border border-slate-700 pointer-events-none shadow-md">
                    {device.name}
                    </div>
                )}

                {/* Sensor Value Indicator */}
                {device.type.includes('SENSOR') && (
                <div className="absolute -top-2 right-0 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-blue-400 shadow-sm">
                    {device.sensorValue ?? 0}
                </div>
                )}
                
                {/* Quick Delete Hover (Only in Cursor Mode) */}
                {toolMode === 'cursor' && (
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
                )}
            </div>
            );
        })}

        {toolMode === 'connect' && !tempConnection && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white px-4 py-2 rounded-full text-xs font-medium border border-blue-500 pointer-events-none shadow-lg animate-fade-in z-30">
            Drag from one device to another to connect
            </div>
        )}
        
        {toolMode === 'erase' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-4 py-2 rounded-full text-xs font-medium border border-red-500 pointer-events-none shadow-lg animate-fade-in z-30">
            Click on any device or cable to remove it
            </div>
        )}
        </div>
    </div>
  );
};