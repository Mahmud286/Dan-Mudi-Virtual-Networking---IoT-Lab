import React, { useState, useEffect, useRef } from 'react';
import { Device, Link as NetworkLink, DeviceType } from '../types';
import { simulateNetworkCommand } from '../services/gemini';
import { Terminal as TerminalIcon, Loader2, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

interface TerminalProps {
  device?: Device;
  allDevices: Device[];
  links: NetworkLink[];
}

interface TerminalLine {
  type: 'input' | 'output' | 'error';
  text: string;
}

export const Terminal: React.FC<TerminalProps> = ({ device, allDevices, links }) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: 'output', text: 'NetSim AI Terminal v1.0.0' },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isIoT = device?.type === DeviceType.ARDUINO || device?.type === DeviceType.ESP32;

  // Reset history when switching devices
  useEffect(() => {
    if (device) {
      setHistory([
        { type: 'output', text: `Connected to ${device.name} (${device.type})` },
        { type: 'output', text: isIoT ? '--- SERIAL MONITOR STARTED ---' : 'Type "help" for available commands.' }
      ]);
    } else {
      setHistory([{ type: 'output', text: 'No device selected.' }]);
    }
  }, [device?.id, isIoT]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isOpen]);

  const executeCommand = async (cmd: string) => {
    if (!device) return;
    
    setHistory(prev => [...prev, { type: 'input', text: cmd }]);
    setIsProcessing(true);
    
    try {
      const output = await simulateNetworkCommand(cmd, device, allDevices, links);
      setHistory(prev => [...prev, { type: 'output', text: output }]);
    } catch (error) {
      setHistory(prev => [...prev, { type: 'error', text: 'Error executing command.' }]);
    } finally {
      setIsProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing && input.trim()) {
      const command = input.trim();
      setInput('');
      
      if (command.toLowerCase() === 'clear') {
        setHistory([]);
        return;
      }
      executeCommand(command);
    }
  };

  // Run Code Button for IoT
  const handleRunCode = () => {
    executeCommand('run');
  };

  return (
    <div className={`flex flex-col bg-slate-950 border-t border-slate-700 transition-all duration-300 ease-in-out ${isOpen ? 'h-[40vh] md:h-72' : 'h-8'}`}>
      
      {/* Header / Toggle Bar */}
      <div 
        className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 cursor-pointer hover:bg-slate-800 select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <TerminalIcon size={14} />
          <span>{isIoT ? 'SERIAL MONITOR' : 'TERMINAL'}</span>
          {device && <span className="text-blue-400">[{device.name}]</span>}
        </div>
        <div className="flex items-center space-x-2">
          {isOpen ? <ChevronDown size={14} className="text-slate-500"/> : <ChevronUp size={14} className="text-slate-500"/>}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        className="flex-1 flex flex-col p-4 overflow-hidden"
        onClick={() => !isProcessing && inputRef.current?.focus()}
      >
        <div className="flex-1 overflow-y-auto terminal-scroll pr-2 font-mono text-sm">
          {history.map((line, i) => (
            <div key={i} className={`mb-1 break-words ${line.type === 'error' ? 'text-red-400' : line.type === 'input' ? 'text-slate-500 italic' : 'text-green-500'}`}>
              {line.type === 'input' ? (
                <span className="flex">
                  <span className="mr-2 text-blue-500">{!isIoT ? `${device?.name}>` : ''}</span>
                  {line.text}
                </span>
              ) : (
                <span className="whitespace-pre-wrap">{line.text}</span>
              )}
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-center text-green-700 mt-2">
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Processing...
            </div>
          )}
          
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        {device && (
          <div className="flex items-center mt-2 border-t border-slate-800 pt-2 font-mono text-sm">
            
            {/* Run Button for IoT */}
            {isIoT && (
               <button 
                 onClick={(e) => { e.stopPropagation(); handleRunCode(); }}
                 className="mr-2 p-1 bg-green-900/40 text-green-400 rounded hover:bg-green-900/60 border border-green-800 flex items-center text-xs px-2 whitespace-nowrap"
                 disabled={isProcessing}
               >
                 <PlayCircle size={12} className="mr-1" /> RUN
               </button>
            )}

            {!isIoT && <span className="mr-2 text-blue-500 hidden sm:inline">{device.name}&gt;</span>}
            
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-700 min-w-0"
              placeholder={isIoT ? "Input..." : "Enter command..."}
              autoFocus={isOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
};