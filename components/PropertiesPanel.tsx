import React from 'react';
import { Device, DeviceType } from '../types';
import { Settings, Save, Trash2, Code, Sliders } from 'lucide-react';

interface PropertiesPanelProps {
  device: Device;
  onUpdateDevice: (updatedDevice: Device) => void;
  onDeleteDevice: (id: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ device, onUpdateDevice, onDeleteDevice }) => {
  const isIoTController = device.type === DeviceType.ARDUINO || device.type === DeviceType.ESP32;
  const isSensor = device.type.startsWith('SENSOR');
  const isNetworkDevice = [DeviceType.PC, DeviceType.ROUTER, DeviceType.SERVER].includes(device.type as DeviceType);

  const handleInterfaceChange = (index: number, field: string, value: string) => {
    const newInterfaces = [...device.interfaces];
    newInterfaces[index] = { ...newInterfaces[index], [field]: value };
    onUpdateDevice({ ...device, interfaces: newInterfaces });
  };

  const handleNameChange = (name: string) => {
    onUpdateDevice({ ...device, name });
  };

  const handleCodeChange = (code: string) => {
    onUpdateDevice({ ...device, code });
  };

  const handleSensorValueChange = (val: string) => {
    onUpdateDevice({ ...device, sensorValue: parseInt(val) });
  };

  return (
    <div className="h-full bg-slate-900 border-l border-slate-700 flex flex-col w-80">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
        <h2 className="font-semibold text-slate-100 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Configuration
        </h2>
        <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">{device.type}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Common: Name */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Device Name</label>
          <input
            type="text"
            value={device.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* SECTION: NETWORK CONFIG */}
        {isNetworkDevice && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interfaces</label>
            </div>
            
            {device.interfaces.map((iface, idx) => (
              <div key={iface.id} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 space-y-3">
                <div className="text-xs text-blue-400 font-mono mb-2">{iface.name}</div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase">IP Address</label>
                  <input
                    type="text"
                    value={iface.ip}
                    onChange={(e) => handleInterfaceChange(idx, 'ip', e.target.value)}
                    placeholder="e.g. 192.168.1.10"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-100 font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase">Subnet Mask</label>
                  <input
                    type="text"
                    value={iface.subnet}
                    onChange={(e) => handleInterfaceChange(idx, 'subnet', e.target.value)}
                    placeholder="e.g. 255.255.255.0"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-100 font-mono focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase">Default Gateway</label>
                  <input
                    type="text"
                    value={iface.gateway}
                    onChange={(e) => handleInterfaceChange(idx, 'gateway', e.target.value)}
                    placeholder="e.g. 192.168.1.1"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-100 font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION: IOT CODE EDITOR */}
        {isIoTController && (
          <div className="space-y-3 flex-1 flex flex-col">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Code className="w-3 h-3 mr-1" /> Embedded Code
            </label>
            <div className="relative flex-1">
              <textarea
                value={device.code || ''}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-64 bg-slate-950 border border-slate-700 rounded p-3 text-xs font-mono text-green-400 focus:ring-1 focus:ring-green-500 outline-none resize-y"
                spellCheck={false}
              />
              <div className="text-[10px] text-slate-500 mt-1">Supports pseudo C++ / Arduino syntax</div>
            </div>
          </div>
        )}

        {/* SECTION: SENSOR ENVIRONMENT */}
        {isSensor && (
          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Sliders className="w-3 h-3 mr-1" /> Environment Simulation
            </label>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-300">Current Reading</span>
                <span className="font-mono font-bold text-blue-400">{device.sensorValue ?? 0}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={device.sensorValue ?? 0}
                onChange={(e) => handleSensorValueChange(e.target.value)}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Min (0)</span>
                <span>Max (100)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => onDeleteDevice(device.id)}
          className="w-full flex items-center justify-center space-x-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded border border-red-900 transition-colors text-sm"
        >
          <Trash2 size={14} />
          <span>Delete Device</span>
        </button>
      </div>
    </div>
  );
};