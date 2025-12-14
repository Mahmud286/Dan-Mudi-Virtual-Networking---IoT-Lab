import React, { useState } from 'react';
import { Device, DeviceType } from '../types';
import { X, Settings, Network, Code, Sliders, Save, Trash2, Cpu } from 'lucide-react';

interface ConfigurationModalProps {
  device: Device;
  onClose: () => void;
  onUpdateDevice: (updatedDevice: Device) => void;
  onDeleteDevice: (id: string) => void;
}

type Tab = 'settings' | 'network' | 'code' | 'io';

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({ 
  device, 
  onClose, 
  onUpdateDevice,
  onDeleteDevice 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  const isIoTController = device.type === DeviceType.ARDUINO || device.type === DeviceType.ESP32 || device.type === DeviceType.RASPBERRY_PI;
  const isNetworkDevice = [DeviceType.PC, DeviceType.LAPTOP, DeviceType.SERVER, DeviceType.ROUTER].includes(device.type as DeviceType);
  const isSensorOrActuator = device.type.startsWith('SENSOR') || device.type.startsWith('ACTUATOR') || device.type === DeviceType.RELAY;

  const handleNameChange = (name: string) => {
    onUpdateDevice({ ...device, name });
  };

  const handleInterfaceChange = (index: number, field: string, value: string) => {
    const newInterfaces = [...device.interfaces];
    newInterfaces[index] = { ...newInterfaces[index], [field]: value };
    onUpdateDevice({ ...device, interfaces: newInterfaces });
  };

  const handleCodeChange = (code: string) => {
    onUpdateDevice({ ...device, code });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-0 md:border border-slate-700 w-full h-full md:max-w-4xl md:h-[80vh] md:rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        
        {/* Header */}
        <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Settings size={18} />
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-slate-100 text-lg leading-tight truncate">{device.name}</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{device.type} | {device.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-48 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 flex flex-row md:flex-col p-2 gap-1 shrink-0 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
              <Settings size={16} /> General
            </button>
            
            {isNetworkDevice && (
              <button 
                onClick={() => setActiveTab('network')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'network' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Network size={16} /> Interfaces
              </button>
            )}

            {isIoTController && (
              <button 
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'code' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Code size={16} /> Programming
              </button>
            )}

            {(isSensorOrActuator || isIoTController) && (
               <button 
                onClick={() => setActiveTab('io')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'io' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
              >
                <Sliders size={16} /> I/O Config
              </button>
            )}

            <div className="flex-1 hidden md:block"></div>
            <button 
              onClick={() => { onDeleteDevice(device.id); onClose(); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors mt-auto md:w-full whitespace-nowrap"
            >
              <Trash2 size={16} /> <span className="md:inline">Delete</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-slate-900 p-4 md:p-6 overflow-y-auto">
            
            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="text-xl font-light text-white mb-6 border-b border-slate-700 pb-2">General Settings</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Display Name</label>
                  <input
                    type="text"
                    value={device.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500">The name displayed on the topology workspace.</p>
                </div>

                {device.type === DeviceType.ACTUATOR_LED && (
                   <div className="space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                     <label className="text-sm font-medium text-slate-300">LED Color Configuration</label>
                     <div className="flex gap-3 flex-wrap">
                       {['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#ffffff'].map(c => (
                         <button
                           key={c}
                           onClick={() => onUpdateDevice({...device, color: c})}
                           className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${device.color === c ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-slate-700'}`}
                           style={{ backgroundColor: c }}
                           title={c}
                         >
                            {device.color === c && <div className="w-3 h-3 bg-black/50 rounded-full" />}
                         </button>
                       ))}
                     </div>
                     <p className="text-xs text-slate-500">Select the emitted color for this LED component.</p>
                   </div>
                )}

                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">Device Model</label>
                   <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed">
                     {device.type}
                   </div>
                </div>

                <div className="pt-4">
                  <div className="bg-blue-900/10 border border-blue-900/30 rounded-lg p-4">
                     <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
                       <Cpu size={16} /> Status
                     </div>
                     <div className="text-sm text-blue-300">
                        Device is online and operating normally.
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: NETWORK */}
            {activeTab === 'network' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h3 className="text-xl font-light text-white mb-6 border-b border-slate-700 pb-2">Network Configuration</h3>
                 
                 <div className="grid gap-6">
                   {device.interfaces.map((iface, idx) => (
                     <div key={iface.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm">
                       <div className="flex items-center justify-between mb-4">
                         <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-900/50">{iface.name}</span>
                         <span className="text-xs text-slate-500 uppercase tracking-wider">FastEthernet</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-slate-400 uppercase">IPv4 Address</label>
                           <input
                             type="text"
                             value={iface.ip}
                             onChange={(e) => handleInterfaceChange(idx, 'ip', e.target.value)}
                             placeholder="0.0.0.0"
                             className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 font-mono text-sm text-slate-100 focus:border-blue-500 outline-none"
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-slate-400 uppercase">Subnet Mask</label>
                           <input
                             type="text"
                             value={iface.subnet}
                             onChange={(e) => handleInterfaceChange(idx, 'subnet', e.target.value)}
                             placeholder="255.255.255.0"
                             className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 font-mono text-sm text-slate-100 focus:border-blue-500 outline-none"
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-xs font-semibold text-slate-400 uppercase">Default Gateway</label>
                           <input
                             type="text"
                             value={iface.gateway}
                             onChange={(e) => handleInterfaceChange(idx, 'gateway', e.target.value)}
                             placeholder="0.0.0.0"
                             className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 font-mono text-sm text-slate-100 focus:border-blue-500 outline-none"
                           />
                         </div>
                       </div>
                     </div>
                   ))}
                   
                   {device.interfaces.length === 0 && (
                      <div className="text-center py-10 text-slate-500 italic">
                        No configurable interfaces on this device.
                      </div>
                   )}
                 </div>
               </div>
            )}

            {/* TAB: PROGRAMMING */}
            {activeTab === 'code' && (
              <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-end mb-2">
                   <h3 className="text-xl font-light text-white">Source Code</h3>
                   <span className="text-xs text-slate-500">main.cpp</span>
                </div>
                <div className="flex-1 relative border border-slate-700 rounded-lg overflow-hidden bg-slate-950 min-h-[300px]">
                   <textarea
                    value={device.code || ''}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-slate-950 p-4 font-mono text-sm text-emerald-400 resize-none outline-none leading-relaxed"
                    spellCheck={false}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-500 flex justify-between">
                  <span>Supported Language: C++ (Arduino Style)</span>
                  <span>Lines: {(device.code?.match(/\n/g) || []).length + 1}</span>
                </div>
              </div>
            )}

            {/* TAB: I/O */}
            {activeTab === 'io' && (
               <div className="space-y-6 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                 <h3 className="text-xl font-light text-white mb-6 border-b border-slate-700 pb-2">Physical Attributes & I/O</h3>
                 
                 {isSensorOrActuator && (
                   <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <label className="font-medium text-slate-200">Sensor Value / State</label>
                        <span className="font-mono text-xl font-bold text-blue-400">{device.sensorValue ?? 0}</span>
                      </div>
                      
                      <input 
                        type="range" 
                        min="0" 
                        max="1023" 
                        value={device.sensorValue ?? 0}
                        onChange={(e) => onUpdateDevice({ ...device, sensorValue: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-2">
                        <span>Min (0)</span>
                        <span>Analog Max (1023)</span>
                      </div>
                      
                      <p className="mt-4 text-sm text-slate-400 bg-slate-900 p-3 rounded border border-slate-800">
                        Adjust this slider to simulate changes in the physical environment (Temperature, Light, Motion distance, etc.) which can be read by the microcontroller.
                      </p>
                   </div>
                 )}

                 {isIoTController && (
                   <div className="text-slate-400 italic">
                     Select specific pins to configure voltage levels (Not implemented in this version). Use the Code tab to interact with GPIO.
                   </div>
                 )}
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};