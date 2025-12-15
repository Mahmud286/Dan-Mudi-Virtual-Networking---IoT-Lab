import React, { useState, useEffect } from 'react';
import { NetworkCanvas } from './components/NetworkCanvas';
import { Terminal } from './components/Terminal';
import { ConfigurationModal } from './components/ConfigurationModal';
import { SharingModal } from './components/SharingModal';
import { PortConnectionModal } from './components/PortConnectionModal';
import { TutorChat } from './components/TutorChat';
import { HomePage } from './components/HomePage';
import { ProjectDashboard } from './components/ProjectDashboard';
import { CodeEditor } from './components/CodeEditor';
import { Logo } from './components/Logo';
import { Device, Link, DeviceType, CableType, NetworkInterface } from './types';
import { INITIAL_CHALLENGES, DEFAULT_ARDUINO_CODE } from './constants';
import { 
  Monitor, Router, Network, Cable, Play, Layout, Cpu, Wifi, 
  Thermometer, Lightbulb, Box, Laptop, Server, Shield, Cloud, 
  Smartphone, ToggleLeft, Wind, Droplets, Bell, Settings2, Eye,
  Radio, Sparkles, X, ArrowLeft, Code, Eye as EyeIcon, Save, Upload,
  Eraser, MousePointer2, Share2, Printer, ChevronDown
} from 'lucide-react';

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export default function App() {
  const [view, setView] = useState<'home' | 'dashboard' | 'lab'>('home');
  const [devices, setDevices] = useState<Device[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [configuringDeviceId, setConfiguringDeviceId] = useState<string | null>(null);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [pendingLink, setPendingLink] = useState<{sourceId: string, targetId: string} | null>(null);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);
  
  // Tool Mode: 'cursor' (Select/Move), 'connect' (Cable), 'erase' (Delete)
  const [toolMode, setToolMode] = useState<'cursor' | 'connect' | 'erase'>('cursor');
  const [selectedCableType, setSelectedCableType] = useState<CableType>(CableType.STRAIGHT);
  
  const [activeTab, setActiveTab] = useState<'net' | 'iot'>('net');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);

  // Mobile IoT View Mode: 'canvas' or 'editor'
  const [mobileIoTView, setMobileIoTView] = useState<'canvas' | 'editor'>('canvas');

  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  const configuringDevice = devices.find(d => d.id === configuringDeviceId);
  
  // Logic to determine if we should show the split-view code editor
  const isIoTProject = activeTab === 'iot';
  const selectedIoTDevice = selectedDevice && (
    selectedDevice.type === DeviceType.ARDUINO || 
    selectedDevice.type === DeviceType.ESP32 || 
    selectedDevice.type === DeviceType.RASPBERRY_PI
  );
  
  // If we have an IoT device selected, use that for the editor, otherwise find the first main controller
  const editorDevice = selectedIoTDevice ? selectedDevice : devices.find(d => d.type === DeviceType.ESP32 || d.type === DeviceType.ARDUINO);
  const showCodeEditor = isIoTProject && !!editorDevice;

  const handleStartLab = (initialDevices?: Device[], initialLinks?: Link[], mode: 'net' | 'iot' = 'net') => {
    setActiveTab(mode);
    setSimulationRunning(false);
    if (initialDevices && initialLinks) {
        setDevices(initialDevices);
        setLinks(initialLinks);
        // Select the main board automatically to show code
        const mainBoard = initialDevices.find(d => d.type === DeviceType.ESP32 || d.type === DeviceType.ARDUINO);
        if (mainBoard) {
            setSelectedDeviceId(mainBoard.id);
        }
    } else {
        // Default empty lab
        setDevices([]);
        setLinks([]);
    }
    setView('lab');
  };

  const handleAddDevice = (type: DeviceType, config?: { name: string, interfaces?: NetworkInterface[] }) => {
    // Explicit IoT check based on enum naming convention or list
    const isIoTDevice = [
        DeviceType.ARDUINO, DeviceType.ESP32, DeviceType.RASPBERRY_PI, DeviceType.GSM_MODULE,
        DeviceType.SENSOR_TEMP, DeviceType.SENSOR_MOISTURE, DeviceType.SENSOR_MOTION, DeviceType.SENSOR_GAS, DeviceType.SENSOR_WATER,
        DeviceType.ACTUATOR_LED, DeviceType.ACTUATOR_MOTOR, DeviceType.ACTUATOR_BUZZER, DeviceType.ACTUATOR_SERVO, DeviceType.RELAY
    ].includes(type);

    const defaultInterfaces: NetworkInterface[] = type === DeviceType.SWITCH ? [] : [
      { id: generateId('if'), name: 'eth0', ip: '', subnet: '', gateway: '' }
    ];

    const newDevice: Device = {
      id: generateId(isIoTDevice ? 'iot' : 'dev'),
      type,
      name: config?.name || `${type}-${devices.filter(d => d.type === type).length + 1}`,
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      status: 'online',
      interfaces: config?.interfaces || defaultInterfaces,
      // IoT defaults
      color: type === DeviceType.ACTUATOR_LED ? '#ef4444' : undefined, // Default Red for LED
      code: (type === DeviceType.ARDUINO || type === DeviceType.ESP32 || type === DeviceType.RASPBERRY_PI) ? DEFAULT_ARDUINO_CODE : undefined,
      sensorValue: type.startsWith('SENSOR') ? 0 : undefined,
      actuatorState: type.startsWith('ACTUATOR') ? false : undefined
    };
    setDevices([...devices, newDevice]);
    setSelectedDeviceId(newDevice.id);
  };

  const handleAddSwitch = (ports: number) => {
    const interfaces: NetworkInterface[] = [];
    for (let i = 1; i <= ports; i++) {
        interfaces.push({
            id: generateId('if'),
            name: `FastEthernet0/${i}`,
            ip: '',
            subnet: '',
            gateway: ''
        });
    }
    handleAddDevice(DeviceType.SWITCH, { 
        name: `Switch-${ports}Port`, 
        interfaces 
    });
    setShowSwitchMenu(false);
  };

  const handleUpdateDevice = (updated: Device) => {
    setDevices(devices.map(d => d.id === updated.id ? updated : d));
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
    setLinks(links.filter(l => l.sourceId !== id && l.targetId !== id));
    if (selectedDeviceId === id) setSelectedDeviceId(undefined);
    if (configuringDeviceId === id) setConfiguringDeviceId(null);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    // Also clear the interface connections
    setDevices(prev => prev.map(d => ({
       ...d,
       interfaces: d.interfaces.map(iface => {
          if (iface.connectedToId) { // Simplified check, ideally check link ID match
              // Since we don't store link ID in interface currently, we might clear if we knew the peer.
              // For robustness, in a real app, links should be cross-referenced properly.
              // Here we just remove the visual link. 
              // To properly disconnect interface:
              // We need to find which devices were connected by this link.
              const link = links.find(l => l.id === id);
              if (link && (d.id === link.sourceId || d.id === link.targetId)) {
                   return { ...iface, connectedToId: undefined };
              }
          }
          return iface;
       })
    })));
  };

  const handleClearCanvas = () => {
      if (window.confirm("Are you sure you want to clear the entire workspace?")) {
          setDevices([]);
          setLinks([]);
      }
  };

  const handleMoveDevice = (id: string, x: number, y: number) => {
    setDevices(devices.map(d => d.id === id ? { ...d, x, y } : d));
  };

  const handleConnectRequest = (sourceId: string, targetId: string) => {
    // Prevent self connection
    if (sourceId === targetId) return;

    const exists = links.some(l => 
      (l.sourceId === sourceId && l.targetId === targetId) || 
      (l.sourceId === targetId && l.targetId === sourceId)
    );
    
    if (!exists) {
      setPendingLink({ sourceId, targetId });
    }
  };

  const handleConfirmConnection = (sourceIfId: string, targetIfId: string) => {
    if (!pendingLink) return;

    const { sourceId, targetId } = pendingLink;

    // Create the visual link
    const newLink: Link = { 
        id: generateId('link'), 
        sourceId, 
        targetId, 
        type: selectedCableType
    };
    setLinks([...links, newLink]);

    // Update devices to reflect connected interfaces
    setDevices(prevDevices => prevDevices.map(d => {
        if (d.id === sourceId) {
            return {
                ...d,
                interfaces: d.interfaces.map(iface => 
                    iface.id === sourceIfId ? { ...iface, connectedToId: targetId } : iface
                )
            };
        }
        if (d.id === targetId) {
            return {
                ...d,
                interfaces: d.interfaces.map(iface => 
                    iface.id === targetIfId ? { ...iface, connectedToId: sourceId } : iface
                )
            };
        }
        return d;
    }));

    setPendingLink(null);
  };

  const toggleSimulation = () => {
    setSimulationRunning(!simulationRunning);
  };
  
  useEffect(() => {
    if (!simulationRunning) return;
    const interval = setInterval(() => {
        setDevices(currentDevices => 
            currentDevices.map(d => {
                if (d.type.startsWith('SENSOR')) {
                    const noise = Math.floor(Math.random() * 3) - 1; 
                    const current = d.sensorValue ?? 0;
                    return { ...d, sensorValue: Math.max(0, Math.min(100, current + noise)) };
                }
                return d;
            })
        );
    }, 1000);
    return () => clearInterval(interval);
  }, [simulationRunning]);

  const handleSaveProject = () => {
    const projectData = {
        version: '2.0',
        timestamp: new Date().toISOString(),
        type: 'danmudi-lab-project',
        activeTab,
        devices,
        links
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danmudi-project-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            if (json.devices && Array.isArray(json.devices)) {
                setDevices(json.devices);
                setLinks(json.links || []);
                if (json.activeTab) setActiveTab(json.activeTab);
                setSimulationRunning(false);
            } else {
                alert("Invalid project file structure.");
            }
        } catch (error) {
            console.error("Error loading file:", error);
            alert("Failed to parse project file.");
        }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const getNetworkContext = () => {
    const deviceList = devices.map(d => {
      if (d.code) return `${d.name} (${d.type}) [Code]`;
      if (d.type.startsWith('SENSOR')) return `${d.name} (${d.type}) [Value: ${d.sensorValue}]`;
      const config = d.interfaces.map(i => `${i.name}: ${i.ip}`).join(', ');
      return `${d.name} (${d.type}) [${config}]`;
    }).join('\n');
    return `Topology Devices:\n${deviceList}\nTotal Links: ${links.length}`;
  };

  if (view === 'home') {
    return <HomePage onStart={() => setView('dashboard')} />;
  }

  if (view === 'dashboard') {
    return <ProjectDashboard onSelectTemplate={handleStartLab} onBack={() => setView('home')} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <header className="h-14 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 z-30 shadow-sm">
        <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer group" onClick={() => setView('dashboard')}>
          <div className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
            <span className="text-sm font-medium sm:hidden">Back</span>
          </div>
        </div>
        
        {/* Main Toolbar */}
        <div className="flex flex-1 items-center justify-center space-x-2 overflow-x-auto px-2 lg:px-4 hide-scrollbar">
           
           {/* Tab Switcher */}
           <div className="flex bg-slate-950 rounded p-1 mr-2 border border-slate-800 shrink-0">
              <button 
                onClick={() => setActiveTab('net')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${activeTab === 'net' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                NET
              </button>
              <button 
                onClick={() => setActiveTab('iot')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${activeTab === 'iot' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                IoT
              </button>
           </div>
           
           {/* Mobile IoT View Toggle */}
           {activeTab === 'iot' && (
              <div className="md:hidden flex bg-slate-800 p-1 rounded-lg border border-slate-700 mr-2 shrink-0">
                  <button onClick={() => setMobileIoTView('editor')} className={`p-1.5 rounded transition-colors ${mobileIoTView === 'editor' ? 'bg-slate-600 text-white' : 'text-slate-400'}`} title="Code Editor">
                    <Code size={16} />
                  </button>
                  <button onClick={() => setMobileIoTView('canvas')} className={`p-1.5 rounded transition-colors ${mobileIoTView === 'canvas' ? 'bg-slate-600 text-white' : 'text-slate-400'}`} title="Simulation Canvas">
                    <EyeIcon size={16} />
                  </button>
              </div>
           )}

           <div className="flex items-center bg-slate-800/50 p-1 rounded-lg border border-slate-700 space-x-1 shrink-0 z-20 overflow-visible">
             {activeTab === 'net' ? (
               <>
                 <button onClick={() => handleAddDevice(DeviceType.PC)} className="btn-tool" title="PC"><Monitor size={18} /></button>
                 <button onClick={() => handleAddDevice(DeviceType.LAPTOP)} className="btn-tool" title="Laptop"><Laptop size={18} /></button>
                 <button onClick={() => handleAddDevice(DeviceType.ROUTER)} className="btn-tool" title="Router"><Router size={18} /></button>
                 
                 {/* Switch Dropdown */}
                 <div className="relative">
                    <button onClick={() => setShowSwitchMenu(!showSwitchMenu)} className="btn-tool flex items-center gap-0.5" title="Switches">
                       <Network size={18} />
                       <ChevronDown size={10} />
                    </button>
                    {showSwitchMenu && (
                        <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowSwitchMenu(false)}></div>
                        <div className="absolute top-full left-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-40 overflow-hidden flex flex-col py-1">
                             <button onClick={() => handleAddSwitch(8)} className="px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">8-Port Switch</button>
                             <button onClick={() => handleAddSwitch(16)} className="px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">16-Port Switch</button>
                             <button onClick={() => handleAddSwitch(24)} className="px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">24-Port Switch</button>
                             <button onClick={() => handleAddSwitch(48)} className="px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">48-Port Switch</button>
                        </div>
                        </>
                    )}
                 </div>

                 <button onClick={() => handleAddDevice(DeviceType.PRINTER)} className="btn-tool" title="Printer"><Printer size={18} /></button>
               </>
             ) : (
               <>
                 <button onClick={() => handleAddDevice(DeviceType.ARDUINO)} className="btn-tool text-teal-300" title="Arduino"><Cpu size={18} /></button>
                 <button onClick={() => handleAddDevice(DeviceType.ESP32)} className="btn-tool text-teal-300" title="ESP32"><Wifi size={18} /></button>
                 <button onClick={() => handleAddDevice(DeviceType.SENSOR_TEMP)} className="btn-tool text-amber-400" title="Temp Sensor"><Thermometer size={18} /></button>
                 <button onClick={() => handleAddDevice(DeviceType.ACTUATOR_LED)} className="btn-tool text-yellow-200" title="LED"><Lightbulb size={18} /></button>
               </>
             )}
             <div className="hidden lg:flex space-x-1">
                 {activeTab === 'net' ? (
                   <>
                     <button onClick={() => handleAddDevice(DeviceType.SERVER)} className="btn-tool" title="Server"><Server size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.ACCESS_POINT)} className="btn-tool" title="Access Point"><Radio size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.FIREWALL)} className="btn-tool" title="Firewall"><Shield size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.CLOUD)} className="btn-tool" title="Cloud"><Cloud size={18} /></button>
                   </>
                 ) : (
                   <>
                     <button onClick={() => handleAddDevice(DeviceType.RASPBERRY_PI)} className="btn-tool text-teal-300" title="Raspberry Pi"><Box size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.GSM_MODULE)} className="btn-tool text-teal-300" title="GSM"><Smartphone size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.SENSOR_GAS)} className="btn-tool text-amber-400" title="Gas Sensor"><Wind size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.SENSOR_MOTION)} className="btn-tool text-amber-400" title="Motion Sensor"><Eye size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.RELAY)} className="btn-tool text-emerald-300" title="Relay"><ToggleLeft size={18} /></button>
                     <button onClick={() => handleAddDevice(DeviceType.ACTUATOR_SERVO)} className="btn-tool text-emerald-300" title="Servo"><Settings2 size={18} /></button>
                   </>
                 )}
             </div>
           </div>

           {/* Tool Modes */}
           <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 shrink-0 ml-2 md:ml-4 gap-1">
             <button 
               onClick={() => setToolMode('cursor')}
               className={`p-1.5 rounded transition-colors ${toolMode === 'cursor' ? 'bg-slate-600 text-white shadow' : 'hover:bg-slate-700 text-slate-300'}`} 
               title="Select / Move"
             >
               <MousePointer2 size={18} />
             </button>
             <button 
               onClick={() => setToolMode('connect')}
               className={`p-1.5 rounded transition-colors ${toolMode === 'connect' ? 'bg-blue-600 text-white shadow' : 'hover:bg-slate-700 text-slate-300'}`} 
               title="Connection Mode"
             >
               <Cable size={18} />
             </button>
             <button 
               onClick={() => setToolMode('erase')}
               className={`p-1.5 rounded transition-colors ${toolMode === 'erase' ? 'bg-red-600 text-white shadow' : 'hover:bg-slate-700 text-slate-300'}`} 
               title="Eraser Tool"
             >
               <Eraser size={18} />
             </button>
             
             <div className="w-px h-6 bg-slate-700 mx-1"></div>

             <select 
               value={selectedCableType}
               onChange={(e) => {
                 setSelectedCableType(e.target.value as CableType);
                 setToolMode('connect');
               }}
               className={`bg-slate-900 border text-xs h-8 rounded px-2 outline-none cursor-pointer font-mono max-w-[80px] md:max-w-none ${toolMode === 'connect' ? 'border-blue-500 text-white' : 'border-slate-600 text-slate-400'}`}
             >
               <option value={CableType.STRAIGHT}>Straight</option>
               <option value={CableType.CROSSOVER}>Cross</option>
               <option value={CableType.FIBER}>Fiber</option>
               <option value={CableType.GPIO}>GPIO</option>
             </select>
           </div>
        </div>

        <div className="flex items-center space-x-2">
            
            {/* Save / Load Controls */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 mr-1 sm:mr-2">
                <label className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer" title="Load Project">
                    <Upload size={18} />
                    <input type="file" accept=".json" onChange={handleLoadProject} className="hidden" />
                </label>
                <button onClick={handleSaveProject} className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors" title="Save Project">
                    <Save size={18} />
                </button>
                <div className="w-px h-5 bg-slate-700 mx-1"></div>
                <button 
                    onClick={() => setShowSharingModal(true)}
                    className="p-1.5 hover:bg-indigo-600 hover:text-white rounded text-indigo-400 transition-colors"
                    title="File & Message Sharing"
                >
                    <Share2 size={18} />
                </button>
            </div>

            <button 
                className="lg:hidden p-2 text-purple-400 hover:bg-slate-800 rounded-lg"
                onClick={() => setShowMobileSidebar(true)}
            >
                <Sparkles size={20} />
            </button>
            <div className="flex items-center shrink-0 text-xs text-slate-500 hidden xl:flex">
                <span className="mr-2 border border-slate-700 px-2 py-1 rounded bg-slate-800">Double-click device to configure</span>
            </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-row min-w-0 relative">
          
          {showCodeEditor && editorDevice && (
              <div className={`
                ${mobileIoTView === 'editor' ? 'w-full block' : 'hidden'} 
                md:block md:w-auto h-full
              `}>
                  <CodeEditor 
                    device={editorDevice}
                    onChange={(newCode) => {
                       const updated = { ...editorDevice, code: newCode };
                       handleUpdateDevice(updated);
                    }}
                    onRun={toggleSimulation}
                    isRunning={simulationRunning}
                  />
              </div>
          )}

          <div className={`
             flex-1 flex flex-col min-w-0 relative
             ${showCodeEditor && mobileIoTView === 'editor' ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="flex-1 relative bg-slate-900/50">
                <NetworkCanvas 
                  devices={devices}
                  links={links}
                  onMoveDevice={handleMoveDevice}
                  onSelectDevice={(d) => setSelectedDeviceId(d.id)}
                  onDeviceDoubleClick={(d) => setConfiguringDeviceId(d.id)}
                  onConnect={handleConnectRequest}
                  onDeleteDevice={handleDeleteDevice}
                  onDeleteLink={handleDeleteLink}
                  onClearCanvas={handleClearCanvas}
                  onAddDevice={handleAddDevice}
                  toolMode={toolMode}
                  selectedCableType={selectedCableType}
                  selectedDeviceId={selectedDeviceId}
                  isSimulationRunning={simulationRunning}
                  onToggleSimulation={toggleSimulation}
                />
            </div>
            <div className="shrink-0 z-10">
                <Terminal 
                device={selectedDevice}
                allDevices={devices}
                links={links}
                />
            </div>
          </div>
        </div>

        <div className={`
            fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 border-l border-slate-700 shadow-2xl transition-transform duration-300 ease-in-out
            ${showMobileSidebar ? 'translate-x-0' : 'translate-x-full'}
            lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto lg:block
            ${showCodeEditor ? 'hidden xl:block' : ''} 
        `}>
           <div className="lg:hidden absolute top-3 right-3 z-10">
               <button onClick={() => setShowMobileSidebar(false)} className="p-1 bg-slate-800 rounded-full text-slate-400 hover:text-white"><X size={16} /></button>
           </div>
           <TutorChat context={getNetworkContext()} />
        </div>
        
        {showMobileSidebar && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setShowMobileSidebar(false)} />
        )}
      </div>

      {configuringDevice && (
        <ConfigurationModal 
          device={configuringDevice}
          onUpdateDevice={handleUpdateDevice}
          onDeleteDevice={handleDeleteDevice}
          onClose={() => setConfiguringDeviceId(null)}
        />
      )}

      {showSharingModal && (
        <SharingModal 
          devices={devices} 
          onClose={() => setShowSharingModal(false)} 
        />
      )}
      
      {pendingLink && (() => {
          const source = devices.find(d => d.id === pendingLink.sourceId);
          const target = devices.find(d => d.id === pendingLink.targetId);
          if (source && target) {
              return (
                <PortConnectionModal
                    sourceDevice={source}
                    targetDevice={target}
                    onConnect={handleConfirmConnection}
                    onClose={() => setPendingLink(null)}
                />
              );
          }
          return null;
      })()}

      <style>{`
        .btn-tool {
          @apply p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}