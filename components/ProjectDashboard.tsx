import React, { useState, useRef } from 'react';
import { Plus, Search, Cpu, Wifi, Box, Zap, Layout, Monitor, CircuitBoard, MoreVertical, Router, ArrowRight, Server, Shield, Cloud, Activity, X, FileText, Lock } from 'lucide-react';
import { Device, Link, DeviceType, CableType } from '../types';
import { DEFAULT_ARDUINO_CODE } from '../constants';

interface ProjectDashboardProps {
  onSelectTemplate: (devices: Device[], links: Link[], mode: 'net' | 'iot') => void;
  onBack: () => void;
}

// Helper to generate board visual
const BoardPreview: React.FC<{ type: 'arduino' | 'esp32' | 'pico' | 'network' }> = ({ type }) => {
  const colors = {
    arduino: 'bg-sky-600',
    esp32: 'bg-slate-900 border-slate-700',
    pico: 'bg-emerald-700',
    network: 'bg-indigo-900 border-indigo-700'
  };

  const textColors = {
    arduino: 'text-white',
    esp32: 'text-slate-400',
    pico: 'text-white',
    network: 'text-indigo-200'
  };

  return (
    <div className={`w-24 h-16 rounded mx-auto mb-3 relative shadow-lg ${colors[type]} flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform`}>
      {type === 'network' ? (
        <>
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-white/30 animate-pulse"></div>
            <div className="absolute top-2 right-8 w-2 h-2 rounded-full bg-white/30"></div>
            <div className="absolute bottom-4 left-6 w-2 h-2 rounded-full bg-white/30"></div>
             {/* Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
                <line x1="30" y1="20" x2="50" y2="40" stroke="white" strokeWidth="1" />
                <line x1="70" y1="20" x2="50" y2="40" stroke="white" strokeWidth="1" />
            </svg>
            <Router size={24} className="text-white relative z-10" />
        </>
      ) : (
        <>
             {/* Simulation of pins */}
            <div className="absolute top-0 left-2 right-2 h-1 bg-black/20 flex gap-1 justify-center">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-yellow-500/50 rounded-full" />)}
            </div>
            <div className="absolute bottom-0 left-2 right-2 h-1 bg-black/20 flex gap-1 justify-center">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-yellow-500/50 rounded-full" />)}
            </div>
            
            {/* Chip */}
            <div className="w-8 h-8 bg-black/80 rounded flex items-center justify-center">
                {type === 'esp32' ? <Wifi size={16} className="text-slate-500" /> : <Cpu size={16} className="text-slate-500" />}
            </div>
        </>
      )}
      
      {/* Label */}
      <span className={`absolute bottom-1 right-2 text-[8px] font-bold ${textColors[type]}`}>
        {type.toUpperCase()}
      </span>
    </div>
  );
};

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ onSelectTemplate, onBack }) => {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  const handleStartScratch = (type: DeviceType | 'NET') => {
    if (type === 'NET') {
         onSelectTemplate([], [], 'net');
         return;
    }

    const newDevice: Device = {
        id: 'dev-1',
        type: type as DeviceType,
        name: 'My Board',
        x: 400,
        y: 300,
        status: 'online',
        interfaces: [],
        code: DEFAULT_ARDUINO_CODE
    };
    onSelectTemplate([newDevice], [], 'iot');
  };

  const handleExplore = () => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const allTemplates = [
    {
      title: 'Arduino Blink',
      description: 'Basic LED example',
      icon: <Cpu size={40} className="text-sky-500" />,
      mode: 'iot',
      devices: [
        { id: 'dev-1', type: DeviceType.ARDUINO, name: 'Arduino Uno', x: 200, y: 200, status: 'online', interfaces: [], code: DEFAULT_ARDUINO_CODE },
        { id: 'dev-2', type: DeviceType.ACTUATOR_LED, name: 'LED1', x: 400, y: 200, status: 'online', interfaces: [], color: '#ef4444' }
      ],
      links: [
        { id: 'link-1', sourceId: 'dev-1', targetId: 'dev-2', type: CableType.GPIO }
      ]
    },
    {
      title: 'ESP32 WiFi Scan',
      description: 'Scan nearby networks',
      icon: <Wifi size={40} className="text-slate-400" />,
      mode: 'iot',
      devices: [
        { 
            id: 'dev-1', type: DeviceType.ESP32, name: 'ESP32', x: 300, y: 200, status: 'online', interfaces: [], 
            code: `void setup() {\n  Serial.begin(115200);\n  Serial.println("Scanning WiFi...");\n}\n\nvoid loop() {\n  Serial.println("Found: DanMudi_Lab_5G");\n  delay(5000);\n}` 
        }
      ],
      links: []
    },
    {
      title: 'Sensor Monitor',
      description: 'Temp & Motion',
      icon: <Layout size={40} className="text-emerald-500" />,
      mode: 'iot',
      devices: [
         { id: 'dev-1', type: DeviceType.ESP32, name: 'ESP32 Controller', x: 200, y: 200, status: 'online', interfaces: [], code: DEFAULT_ARDUINO_CODE },
         { id: 'dev-2', type: DeviceType.SENSOR_TEMP, name: 'DHT22', x: 450, y: 150, status: 'online', interfaces: [], sensorValue: 24 },
         { id: 'dev-3', type: DeviceType.SENSOR_MOTION, name: 'PIR', x: 450, y: 280, status: 'online', interfaces: [], sensorValue: 0 }
      ],
      links: [
        { id: 'l1', sourceId: 'dev-1', targetId: 'dev-2', type: CableType.GPIO },
        { id: 'l2', sourceId: 'dev-1', targetId: 'dev-3', type: CableType.GPIO }
      ]
    },
    {
      title: 'Small Office Net',
      description: 'Router + 2 PCs',
      icon: <Monitor size={40} className="text-blue-500" />,
      mode: 'net',
      devices: [
        { id: 'd1', type: DeviceType.ROUTER, name: 'Gateway', x: 300, y: 100, status: 'online', interfaces: [{id:'i1', name:'fa0/0', ip:'192.168.1.1', subnet:'255.255.255.0', gateway:''}] },
        { id: 'd2', type: DeviceType.SWITCH, name: 'Switch', x: 300, y: 250, status: 'online', interfaces: [] },
        { id: 'd3', type: DeviceType.PC, name: 'Admin PC', x: 150, y: 400, status: 'online', interfaces: [{id:'i2', name:'eth0', ip:'192.168.1.10', subnet:'255.255.255.0', gateway:'192.168.1.1'}] },
        { id: 'd4', type: DeviceType.PC, name: 'Guest PC', x: 450, y: 400, status: 'online', interfaces: [{id:'i3', name:'eth0', ip:'192.168.1.11', subnet:'255.255.255.0', gateway:'192.168.1.1'}] }
      ],
      links: [
        { id: 'l1', sourceId: 'd1', targetId: 'd2', type: CableType.STRAIGHT },
        { id: 'l2', sourceId: 'd2', targetId: 'd3', type: CableType.STRAIGHT },
        { id: 'l3', sourceId: 'd2', targetId: 'd4', type: CableType.STRAIGHT }
      ]
    },
    {
      title: 'Traffic Light Sim',
      description: 'Red, Yellow, Green logic',
      icon: <Zap size={40} className="text-yellow-500" />,
      mode: 'iot',
      devices: [
        { id: 't1', type: DeviceType.ARDUINO, name: 'Controller', x: 200, y: 200, status: 'online', interfaces: [], code: DEFAULT_ARDUINO_CODE },
        { id: 't2', type: DeviceType.ACTUATOR_LED, name: 'Red', x: 400, y: 150, status: 'online', interfaces: [], color: '#ef4444' },
        { id: 't3', type: DeviceType.ACTUATOR_LED, name: 'Yellow', x: 400, y: 220, status: 'online', interfaces: [], color: '#eab308' },
        { id: 't4', type: DeviceType.ACTUATOR_LED, name: 'Green', x: 400, y: 290, status: 'online', interfaces: [], color: '#22c55e' }
      ],
      links: [
        { id: 'l1', sourceId: 't1', targetId: 't2', type: CableType.GPIO },
        { id: 'l2', sourceId: 't1', targetId: 't3', type: CableType.GPIO },
        { id: 'l3', sourceId: 't1', targetId: 't4', type: CableType.GPIO }
      ]
    },
    {
      title: 'Enterprise Topology',
      description: 'Gateway + Server + DMZ',
      icon: <Server size={40} className="text-purple-500" />,
      mode: 'net',
      devices: [
        { id: 'e1', type: DeviceType.ROUTER, name: 'Core Router', x: 300, y: 100, status: 'online', interfaces: [] },
        { id: 'e2', type: DeviceType.FIREWALL, name: 'Firewall', x: 300, y: 200, status: 'online', interfaces: [] },
        { id: 'e3', type: DeviceType.SWITCH, name: 'DMZ Switch', x: 150, y: 300, status: 'online', interfaces: [] },
        { id: 'e4', type: DeviceType.SWITCH, name: 'LAN Switch', x: 450, y: 300, status: 'online', interfaces: [] },
        { id: 'e5', type: DeviceType.SERVER, name: 'Web Server', x: 150, y: 400, status: 'online', interfaces: [] },
        { id: 'e6', type: DeviceType.PC, name: 'Workstation', x: 450, y: 400, status: 'online', interfaces: [] }
      ],
      links: [
         { id: 'l1', sourceId: 'e1', targetId: 'e2', type: CableType.STRAIGHT },
         { id: 'l2', sourceId: 'e2', targetId: 'e3', type: CableType.STRAIGHT },
         { id: 'l3', sourceId: 'e2', targetId: 'e4', type: CableType.STRAIGHT },
         { id: 'l4', sourceId: 'e3', targetId: 'e5', type: CableType.STRAIGHT },
         { id: 'l5', sourceId: 'e4', targetId: 'e6', type: CableType.STRAIGHT },
      ]
    },
    {
      title: 'IoT Weather Station',
      description: 'WiFi + Temp + Cloud',
      icon: <Cloud size={40} className="text-cyan-500" />,
      mode: 'iot',
      devices: [
         { id: 'w1', type: DeviceType.ESP32, name: 'Weather Node', x: 200, y: 200, status: 'online', interfaces: [] },
         { id: 'w2', type: DeviceType.SENSOR_TEMP, name: 'Env Sensor', x: 400, y: 200, status: 'online', interfaces: [] },
         { id: 'w3', type: DeviceType.CLOUD, name: 'IoT Cloud', x: 100, y: 100, status: 'online', interfaces: [] }
      ],
      links: [
        { id: 'l1', sourceId: 'w1', targetId: 'w2', type: CableType.GPIO },
        { id: 'l2', sourceId: 'w1', targetId: 'w3', type: CableType.FIBER }
      ]
    },
    {
      title: 'Servo Control',
      description: 'Motor PWM logic',
      icon: <Box size={40} className="text-orange-400" />,
      mode: 'iot',
      devices: [
         { id: 's1', type: DeviceType.ARDUINO, name: 'Uno', x: 200, y: 200, status: 'online', interfaces: [] },
         { id: 's2', type: DeviceType.ACTUATOR_SERVO, name: 'Servo X', x: 400, y: 150, status: 'online', interfaces: [] },
         { id: 's3', type: DeviceType.ACTUATOR_SERVO, name: 'Servo Y', x: 400, y: 250, status: 'online', interfaces: [] }
      ],
      links: [
        { id: 'l1', sourceId: 's1', targetId: 's2', type: CableType.GPIO },
        { id: 'l2', sourceId: 's1', targetId: 's3', type: CableType.GPIO }
      ]
    }
  ];

  const featuredProjects = [
      { id: 'p1', title: 'Smart Home Hub V2', author: '@david_villasenor', type: 'Community', icon: <Layout size={12}/>, mainIcon: <Wifi size={12}/> },
      { id: 'p2', title: 'ESP32 Micropython Weather', author: '@iot_master', type: 'Python', icon: <Zap size={32} className="text-emerald-500"/> },
      { id: 'p3', title: 'Audio FFT Visualizer', author: '@audio_wiz', type: 'C++', icon: <Activity size={32} className="text-purple-500"/> },
  ];

  // Search Logic
  const filteredTemplates = allTemplates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProjects = featuredProjects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If searching, show all matching. If not searching, respect the 'showAll' toggle.
  const displayedTemplates = searchQuery ? filteredTemplates : (showAll ? filteredTemplates : filteredTemplates.slice(0, 4));

  return (
    <div className="h-screen w-full bg-[#121212] text-slate-200 font-sans selection:bg-blue-500/30 overflow-y-auto overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-[#1a1a1a] px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={onBack}>
          <CircuitBoard className="text-blue-500 w-8 h-8" />
          <span className="font-bold text-lg md:text-xl tracking-tight text-white leading-none">
            Dan Mudi <span className="block md:inline font-normal text-slate-400 text-sm md:text-xl">Lab</span>
          </span>
        </div>
        
        <div className="flex-1 max-w-xl mx-4 md:mx-8 relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects (e.g. 'blink', 'network', 'router')..." 
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 text-slate-300 placeholder-slate-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-slate-400 hover:text-white">
                <Search size={20} />
            </button>
            <button 
                onClick={handleExplore}
                className="hidden sm:block px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
                Explore
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white border border-white/20 cursor-pointer hover:ring-2 ring-blue-400 transition-all">
                DM
            </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
        
        {/* Start from Scratch */}
        <div className="mb-12">
          <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
            Start from Scratch
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div 
              onClick={() => handleStartScratch('NET')}
              className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 md:p-6 hover:border-indigo-500/50 hover:bg-[#1f1f25] transition-all cursor-pointer group flex flex-col h-full"
            >
              <BoardPreview type="network" />
              <div className="text-center mt-auto pt-4">
                <div className="text-white font-medium text-sm md:text-base group-hover:text-indigo-400">Network Lab</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1">Design Topology</div>
              </div>
            </div>

            <div 
              onClick={() => handleStartScratch(DeviceType.ARDUINO)}
              className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 md:p-6 hover:border-blue-500/50 hover:bg-[#252525] transition-all cursor-pointer group flex flex-col h-full"
            >
              <BoardPreview type="arduino" />
              <div className="text-center mt-auto pt-4">
                <div className="text-white font-medium text-sm md:text-base group-hover:text-blue-400">Arduino Uno</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1">ATmega328P</div>
              </div>
            </div>

            <div 
               onClick={() => handleStartScratch(DeviceType.ESP32)}
               className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 md:p-6 hover:border-blue-500/50 hover:bg-[#252525] transition-all cursor-pointer group flex flex-col h-full"
            >
              <BoardPreview type="esp32" />
              <div className="text-center mt-auto pt-4">
                <div className="text-white font-medium text-sm md:text-base group-hover:text-blue-400">ESP32</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1">WiFi + Bluetooth</div>
              </div>
            </div>

            <div 
               onClick={() => handleStartScratch(DeviceType.RASPBERRY_PI)}
               className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 md:p-6 hover:border-blue-500/50 hover:bg-[#252525] transition-all cursor-pointer group flex flex-col h-full"
            >
              <BoardPreview type="pico" />
              <div className="text-center mt-auto pt-4">
                <div className="text-white font-medium text-sm md:text-base group-hover:text-blue-400">Pi Pico</div>
                <div className="text-[10px] md:text-xs text-slate-500 mt-1">RP2040</div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-medium text-white">Starter Templates</h2>
             {!searchQuery && (
                 <button 
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:gap-2 transition-all outline-none"
                 >
                    {showAll ? 'Show Less' : 'View all templates'} 
                    <ArrowRight size={14} className={`transition-transform duration-300 ${showAll ? '-rotate-90' : ''}`} />
                 </button>
             )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {displayedTemplates.length > 0 ? displayedTemplates.map((tpl, i) => (
              <div 
                key={i} 
                onClick={() => onSelectTemplate(tpl.devices, tpl.links, tpl.mode as 'net' | 'iot')}
                className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer flex flex-col"
              >
                <div className="h-40 bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden shrink-0" 
                     style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {tpl.icon}
                    </div>
                    <div className="absolute top-4 left-4 w-12 h-0.5 bg-red-500/40 rotate-12"></div>
                    <div className="absolute bottom-4 right-4 w-16 h-0.5 bg-blue-500/40 -rotate-6"></div>
                </div>

                <div className="p-4 bg-[#202020] border-t border-white/5 flex-1">
                  <h3 className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">{tpl.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{tpl.description}</p>
                </div>
              </div>
            )) : (
                <div className="col-span-full text-center py-12 text-slate-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50"/>
                    <p>No templates found matching "{searchQuery}"</p>
                </div>
            )}
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div ref={featuredRef} id="featured-section" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-medium text-white mb-6">Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {filteredProjects.map((proj) => (
                <div key={proj.id} className="group bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 hover:border-blue-500/40 transition-all cursor-pointer hover:shadow-lg">
                <div className="h-48 bg-[#0a0a0a] flex items-center justify-center relative">
                    <span className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded border ${proj.type === 'Python' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-800' : 'bg-blue-900/50 text-blue-300 border-blue-800'}`}>
                        {proj.type}
                    </span>
                    {proj.id === 'p1' && (
                        <div className="grid grid-cols-2 gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <div className="w-8 h-8 border border-slate-600 rounded bg-slate-800 flex items-center justify-center">{proj.mainIcon}</div>
                            <div className="w-8 h-8 border border-slate-600 rounded bg-slate-800 flex items-center justify-center">{proj.icon}</div>
                        </div>
                    )}
                    {proj.id === 'p2' && (
                        <div className="w-20 h-20 border-2 border-emerald-900/50 rounded-full flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                            {proj.icon}
                        </div>
                    )}
                    {proj.id === 'p3' && (
                        <div className="flex gap-1 items-end opacity-70 group-hover:opacity-100 transition-opacity">
                            <div className="w-3 h-8 bg-red-500/60 rounded-sm animate-pulse" style={{animationDuration: '0.8s'}}></div>
                            <div className="w-3 h-12 bg-green-500/60 rounded-sm animate-pulse" style={{animationDuration: '1.2s'}}></div>
                            <div className="w-3 h-6 bg-blue-500/60 rounded-sm animate-pulse" style={{animationDuration: '1s'}}></div>
                            <div className="w-3 h-10 bg-yellow-500/60 rounded-sm animate-pulse" style={{animationDuration: '0.9s'}}></div>
                        </div>
                    )}
                </div>
                <div className="p-3 bg-[#202020] border-t border-white/5">
                    <div className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{proj.title}</div>
                    <div className="text-xs text-slate-600 mt-1">by {proj.author}</div>
                </div>
                </div>
            ))}

            {filteredProjects.length === 0 && searchQuery && (
                 <div className="col-span-full text-center py-12 text-slate-500">
                    <p>No projects found.</p>
                </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-8 text-center text-slate-600 text-sm">
           <div className="mb-2">© Dan Mudi Digital Hub 2025</div>
           <div className="flex gap-4 justify-center text-xs">
              <button onClick={() => setLegalModal('privacy')} className="hover:text-slate-400 outline-none">Privacy</button>
              <button onClick={() => setLegalModal('terms')} className="hover:text-slate-400 outline-none">Terms</button>
              <a href="#" className="hover:text-slate-400">Discord</a>
           </div>
        </div>

      </div>

      {/* Legal Modal (Privacy / Terms) */}
      {legalModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setLegalModal(null)}>
              <div 
                className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl p-6 relative"
                onClick={e => e.stopPropagation()}
              >
                  <button 
                    onClick={() => setLegalModal(null)} 
                    className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
                  >
                      <X size={20} />
                  </button>

                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      {legalModal === 'privacy' ? <Lock size={20} className="text-emerald-400"/> : <FileText size={20} className="text-blue-400"/>}
                      {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                  </h2>
                  
                  <div className="text-slate-300 text-sm space-y-4 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                      {legalModal === 'privacy' ? (
                          <>
                            <p><strong>Last Updated: February 2025</strong></p>
                            <p>Your privacy is important to us. It is Dan Mudi Lab's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                            <p>1. <strong>Information Collection:</strong> We do not store personal data on our servers. All simulations run client-side in your browser.</p>
                            <p>2. <strong>AI Interactions:</strong> Conversations with the AI Tutor are processed by Google Gemini API but are not permanently stored by us.</p>
                            <p>3. <strong>Cookies:</strong> We use local storage to save your user preferences.</p>
                          </>
                      ) : (
                          <>
                             <p><strong>Last Updated: February 2025</strong></p>
                             <p>By accessing Dan Mudi Virtual Lab, you agree to be bound by these terms of service.</p>
                             <p>1. <strong>Usage License:</strong> Permission is granted to temporarily use the lab for personal, non-commercial transitory viewing only.</p>
                             <p>2. <strong>Disclaimer:</strong> The materials on Dan Mudi Lab are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
                             <p>3. <strong>Educational Use:</strong> This tool is a simulation. Real-world network behavior may vary.</p>
                          </>
                      )}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                      <button 
                        onClick={() => setLegalModal(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};