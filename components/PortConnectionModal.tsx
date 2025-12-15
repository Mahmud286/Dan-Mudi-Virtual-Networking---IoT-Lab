import React, { useState } from 'react';
import { Device, NetworkInterface } from '../types';
import { X, Cable, EthernetPort } from 'lucide-react';

interface PortConnectionModalProps {
  sourceDevice: Device;
  targetDevice: Device;
  onConnect: (sourceIfId: string, targetIfId: string) => void;
  onClose: () => void;
}

export const PortConnectionModal: React.FC<PortConnectionModalProps> = ({ 
  sourceDevice, 
  targetDevice, 
  onConnect, 
  onClose 
}) => {
  const [selectedSourceIf, setSelectedSourceIf] = useState<string | null>(null);
  const [selectedTargetIf, setSelectedTargetIf] = useState<string | null>(null);

  // Filter for available (unconnected) interfaces
  // We allow selecting the currently selected one to toggle it
  const isInterfaceAvailable = (iface: NetworkInterface) => !iface.connectedToId;

  const handleConnect = () => {
    if (selectedSourceIf && selectedTargetIf) {
      onConnect(selectedSourceIf, selectedTargetIf);
    }
  };

  const renderPortGrid = (device: Device, selectedId: string | null, onSelect: (id: string) => void) => {
    return (
      <div className="grid grid-cols-4 gap-2 mt-4">
        {device.interfaces.map((iface) => {
          const isConnected = !!iface.connectedToId;
          const isSelected = selectedId === iface.id;
          
          return (
            <button
              key={iface.id}
              onClick={() => !isConnected && onSelect(iface.id)}
              disabled={isConnected}
              className={`
                relative flex flex-col items-center justify-center p-2 rounded border transition-all text-xs font-mono
                ${isConnected 
                  ? 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500' 
                    : 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-slate-300'
                }
              `}
              title={isConnected ? `Connected to device ${iface.connectedToId}` : iface.name}
            >
              {/* Port Visual (Pod) */}
              <div className={`w-8 h-6 mb-1 rounded-sm border-2 flex items-center justify-center ${isConnected ? 'bg-emerald-900/50 border-emerald-700' : 'bg-black/40 border-slate-500'}`}>
                 <div className="w-6 h-3 bg-black/50 rounded-[1px] shadow-inner"></div>
              </div>
              
              {/* Status LED */}
              <div className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
              
              <span className="truncate w-full text-center text-[10px]">{iface.name.replace('FastEthernet', 'Fa').replace('GigabitEthernet', 'Gi')}</span>
            </button>
          );
        })}
        {device.interfaces.length === 0 && (
          <div className="col-span-4 text-center py-4 text-slate-500 italic text-xs">No ports available</div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Cable size={18} />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-base">Select Ports</h2>
              <p className="text-xs text-slate-400">Choose interface pods to connect cable</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row p-6 gap-8 bg-[#1a1a1a]">
          
          {/* Source Device */}
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2 text-blue-400 font-semibold border-b border-slate-700 pb-2">
                <span className="text-xs bg-blue-900/30 px-2 py-0.5 rounded border border-blue-800">SOURCE</span>
                {sourceDevice.name}
             </div>
             <div className="bg-[#111] p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto">
                {renderPortGrid(sourceDevice, selectedSourceIf, setSelectedSourceIf)}
             </div>
          </div>

          {/* Connection Visual */}
          <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
              <Cable size={32} />
              <div className="h-full w-px bg-slate-800 my-2"></div>
          </div>

          {/* Target Device */}
          <div className="flex-1">
             <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold border-b border-slate-700 pb-2">
                <span className="text-xs bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-800">DESTINATION</span>
                {targetDevice.name}
             </div>
             <div className="bg-[#111] p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto">
                {renderPortGrid(targetDevice, selectedTargetIf, setSelectedTargetIf)}
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-4 py-2 rounded text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
           >
             Cancel
           </button>
           <button 
             onClick={handleConnect}
             disabled={!selectedSourceIf || !selectedTargetIf}
             className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
           >
             Connect Cable
           </button>
        </div>
      </div>
    </div>
  );
};
