import React, { useState } from 'react';
import { Play, MoreVertical, Settings, Download, BookOpen, Check, Trash2, ChevronDown, FileJson, FileCode } from 'lucide-react';
import { Device, DeviceType } from '../types';

interface CodeEditorProps {
  device: Device;
  onChange: (code: string) => void;
  onRun: () => void;
  isRunning?: boolean;
}

const AVAILABLE_LIBRARIES = [
  { name: 'WiFi', header: '#include <WiFi.h>', description: 'Enable WiFi networking for ESP32', supported: [DeviceType.ESP32] },
  { name: 'Servo', header: '#include <Servo.h>', description: 'Control Servo motors', supported: [DeviceType.ARDUINO, DeviceType.ESP32] },
  { name: 'DHT Sensor Library', header: '#include <DHT.h>', description: 'Read temperature and humidity', supported: [DeviceType.ARDUINO, DeviceType.ESP32] },
  { name: 'LiquidCrystal I2C', header: '#include <LiquidCrystal_I2C.h>', description: 'Control LCD displays', supported: [DeviceType.ARDUINO, DeviceType.ESP32] },
  { name: 'PubSubClient', header: '#include <PubSubClient.h>', description: 'MQTT Client', supported: [DeviceType.ESP32] },
  { name: 'ArduinoJson', header: '#include <ArduinoJson.h>', description: 'Efficient JSON parsing', supported: [DeviceType.ARDUINO, DeviceType.ESP32] },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  device, 
  onChange, 
  onRun, 
  isRunning = false
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'diagram' | 'libraries'>('code');
  
  const code = device.code || '';
  const lineCount = code.split('\n').length;
  
  // Dynamic filename based on device type
  const fileName = device.type === DeviceType.ESP32 ? 'wifi-scan.ino' : 'sketch.ino';

  const toggleLibrary = (lib: typeof AVAILABLE_LIBRARIES[0]) => {
     if (code.includes(lib.header)) {
         // Remove library include logic
         const escapedHeader = lib.header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
         const regex = new RegExp(`${escapedHeader}\\s*\\n?`, 'g');
         const newCode = code.replace(regex, '');
         onChange(newCode);
     } else {
         // Add library include at the top
         onChange(`${lib.header}\n${code}`);
     }
  };

  const getDiagramJson = () => {
      const diagramData = {
          version: 1,
          author: "Anonymous",
          editor: "wokwi",
          parts: [
              {
                  type: device.type.toLowerCase(),
                  id: device.id,
                  top: Math.round(device.y),
                  left: Math.round(device.x),
                  attrs: {
                      value: device.sensorValue
                  }
              }
          ],
          connections: [] // In a real app, this would derive from links
      };
      return JSON.stringify(diagramData, null, 2);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-slate-300 border-r border-slate-700 font-mono text-sm w-full md:w-[400px] lg:w-[500px] shrink-0 z-20">
      
      {/* File Tabs Header */}
      <div className="flex items-center bg-[#2d2d2d] border-b border-black/20 overflow-x-auto hide-scrollbar select-none h-10">
        
        {/* Sketch Tab */}
        <button 
            onClick={() => setActiveTab('code')}
            className={`flex items-center px-4 h-full border-t-2 min-w-fit gap-2 transition-colors outline-none
            ${activeTab === 'code' ? 'bg-[#1e1e1e] border-blue-500 text-slate-100' : 'bg-[#2d2d2d] border-transparent text-slate-500 hover:bg-[#252526] hover:text-slate-300'}`}
        >
           <FileCode size={14} className={activeTab === 'code' ? 'text-blue-400' : ''} />
           <span className="truncate">{fileName}</span>
        </button>

        {/* Diagram Tab */}
        <button 
            onClick={() => setActiveTab('diagram')}
            className={`flex items-center px-4 h-full border-t-2 min-w-fit gap-2 transition-colors outline-none
            ${activeTab === 'diagram' ? 'bg-[#1e1e1e] border-yellow-500 text-slate-100' : 'bg-[#2d2d2d] border-transparent text-slate-500 hover:bg-[#252526] hover:text-slate-300'}`}
        >
           <FileJson size={14} className={activeTab === 'diagram' ? 'text-yellow-400' : ''} />
           <span>diagram.json</span>
        </button>

        {/* Library Manager Tab */}
        <button 
            onClick={() => setActiveTab('libraries')}
            className={`flex items-center px-4 h-full border-t-2 min-w-fit gap-2 transition-colors outline-none
            ${activeTab === 'libraries' ? 'bg-[#1e1e1e] border-emerald-500 text-slate-100' : 'bg-[#2d2d2d] border-transparent text-slate-500 hover:bg-[#252526] hover:text-slate-300'}`}
        >
           <span>Library Manager</span>
           <ChevronDown size={14} className="opacity-70"/>
        </button>

        <div className="flex-1 bg-[#252526] h-full border-b border-[#252526]"></div>
        
        {/* Actions */}
        <div className="flex bg-[#252526] h-full items-center">
            <button className="p-2 text-slate-400 hover:text-white transition-colors" title="More Actions">
                <MoreVertical size={16} />
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative flex overflow-hidden bg-[#1e1e1e]">
        
        {/* VIEW: CODE EDITOR */}
        {activeTab === 'code' && (
            <>
                {/* Line Numbers */}
                <div className="w-12 bg-[#1e1e1e] border-r border-slate-800 flex flex-col items-end pr-2 pt-4 text-slate-600 select-none leading-6 font-mono text-[13px]">
                {Array.from({ length: Math.max(lineCount, 25) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                ))}
                </div>

                {/* Text Area */}
                <div className="flex-1 relative">
                <textarea
                    value={code}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 pt-4 outline-none resize-none leading-6 font-mono text-[13px] whitespace-pre"
                    spellCheck={false}
                    style={{ tabSize: 2 }}
                />
                </div>
            </>
        )}

        {/* VIEW: DIAGRAM JSON */}
        {activeTab === 'diagram' && (
            <div className="flex-1 relative flex flex-col">
                 <div className="bg-[#1e1e1e] text-[#ce9178] p-4 overflow-auto font-mono text-[13px] h-full w-full">
                    <pre>{getDiagramJson()}</pre>
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur text-slate-400 text-xs px-3 py-1 rounded border border-slate-700 select-none">
                    Read-only
                </div>
            </div>
        )}

        {/* VIEW: LIBRARY MANAGER */}
        {activeTab === 'libraries' && (
            <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e] animate-in fade-in duration-200">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-slate-100 font-semibold flex items-center gap-2">
                        <BookOpen size={18} className="text-emerald-500"/>
                        Library Manager
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                        {AVAILABLE_LIBRARIES.length} libraries
                    </span>
                </div>
                
                <div className="space-y-3">
                    {AVAILABLE_LIBRARIES.map((lib, idx) => {
                        const isInstalled = code.includes(lib.header);
                        const isSupported = lib.supported.includes(device.type);
                        
                        if (!isSupported) return null;

                        return (
                            <div key={idx} className="bg-[#252526] border border-slate-700 rounded-lg p-3 hover:border-slate-600 transition-colors group">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-slate-200 flex items-center gap-2">
                                            {lib.name}
                                            {isInstalled && <Check size={14} className="text-emerald-500" />}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1 truncate">{lib.description}</div>
                                        <code className="text-[10px] text-blue-400 mt-2 inline-block bg-black/30 p-1 rounded font-mono">
                                            {lib.header}
                                        </code>
                                    </div>
                                    <button 
                                        onClick={() => toggleLibrary(lib)}
                                        className={`shrink-0 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 transition-all
                                        ${isInstalled 
                                            ? 'bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-900 border border-transparent hover:border-red-900/50' 
                                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'}`}
                                    >
                                        {isInstalled ? (
                                            <>
                                                <Trash2 size={12} /> <span className="hidden sm:inline">Remove</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={12} /> Add
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 p-4 border border-blue-900/30 bg-blue-900/10 rounded-lg flex gap-3">
                    <Settings size={18} className="text-blue-400 shrink-0"/>
                    <div className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-blue-300 font-semibold block mb-1">How it works</span>
                        Adding a library automatically inserts the <code>#include</code> directive at the top of your current sketch. Removing it deletes the line.
                    </div>
                </div>
            </div>
        )}

      </div>
      
      {/* Footer Status */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between select-none shrink-0 z-20">
         <div className="flex items-center gap-3">
             <span className="font-semibold">{device.name}</span>
             {isRunning ? (
                 <span className="flex items-center gap-1.5 text-green-200 bg-white/10 px-1.5 rounded">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></div> 
                     Running
                 </span>
             ) : (
                 <span className="opacity-70">Ready</span>
             )}
         </div>
         <div className="flex items-center gap-4 opacity-90">
             <span className="hidden sm:inline">Ln {lineCount}, Col 1</span>
             <span className="hidden sm:inline">UTF-8</span>
             <span>{activeTab === 'code' ? 'C++' : 'JSON'}</span>
         </div>
      </div>

    </div>
  );
};