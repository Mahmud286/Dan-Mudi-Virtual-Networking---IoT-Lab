import React, { useState, useEffect } from 'react';
import { Device } from '../types';
import { X, Share2, Lock, Unlock, Send, Radio, ShieldCheck, Activity, Globe, FileText, Paperclip } from 'lucide-react';

interface SharingModalProps {
  devices: Device[];
  onClose: () => void;
}

interface MessageLog {
  id: string;
  time: string;
  from: string;
  content: string;
  type: 'text' | 'file';
  status: 'sent' | 'blocked';
}

export const SharingModal: React.FC<SharingModalProps> = ({ devices, onClose }) => {
  const [activeTab, setActiveTab] = useState<'access' | 'broadcast'>('access');
  // State to track which devices have "Sharing Access" enabled (default: all enabled)
  const [accessMap, setAccessMap] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Initialize access map
  useEffect(() => {
    const initialMap: Record<string, boolean> = {};
    devices.forEach(d => {
      // Preserve existing state if re-opening, otherwise default to true
      initialMap[d.id] = true;
    });
    setAccessMap(prev => ({ ...initialMap, ...prev }));
  }, []); // Run once on mount, logic could be improved to sync with external state if needed

  const toggleAccess = (id: string) => {
    setAccessMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAttachFile = () => {
    // Simulating file selection
    const mockFiles = ['network_config.json', 'topology_report.pdf', 'firmware_v2.bin', 'data_log.csv'];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setAttachedFile(randomFile);
  };

  const handleBroadcast = () => {
    if (!message.trim() && !attachedFile) return;

    setIsTransmitting(true);
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    const content = attachedFile 
        ? `Transferred File: ${attachedFile}${message ? ` | Note: ${message}` : ''}`
        : message;
    
    const msgType = attachedFile ? 'file' : 'text';
    
    setMessage('');
    setAttachedFile(null);

    // Simulate Network Delay
    setTimeout(() => {
      const activeDevices = devices.filter(d => accessMap[d.id]);
      const blockedDevices = devices.filter(d => !accessMap[d.id]);
      
      const newLogs: MessageLog[] = [];

      // Log success
      if (activeDevices.length > 0) {
        newLogs.push({
          id: Math.random().toString(),
          time: timestamp,
          from: 'System Broadcast',
          content: `Sent to ${activeDevices.length} devices: "${content}"`,
          type: msgType,
          status: 'sent'
        });
      }

      // Log blocked
      if (blockedDevices.length > 0) {
        newLogs.push({
          id: Math.random().toString(),
          time: timestamp,
          from: 'Firewall/ACL',
          content: `Blocked for ${blockedDevices.length} devices (Access Denied)`,
          type: msgType,
          status: 'blocked'
        });
      }

      setLogs(prev => [...newLogs, ...prev]);
      setIsTransmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-slate-700/50 h-[600px]">
        
        {/* Header */}
        <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-lg">Network Sharing Center</h2>
              <p className="text-xs text-slate-400">File & Message Distribution Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-950 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('access')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'access' ? 'border-indigo-500 text-indigo-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <ShieldCheck size={16} /> Access Control
          </button>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'broadcast' ? 'border-indigo-500 text-indigo-400 bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Radio size={16} /> Broadcast & Files
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-slate-900 relative">
          
          {/* TAB: ACCESS CONTROL */}
          {activeTab === 'access' && (
            <div className="h-full overflow-y-auto p-6 space-y-4 animate-in slide-in-from-left-4 duration-300">
              <div className="bg-indigo-900/10 border border-indigo-900/30 p-4 rounded-lg mb-6">
                <p className="text-sm text-indigo-200 flex gap-2">
                  <Globe size={18} className="shrink-0" />
                  Grant or revoke permissions for devices to participate in the global sharing protocol. Disabled devices will not receive broadcast packets or files.
                </p>
              </div>

              <div className="space-y-2">
                {devices.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 italic">No devices in the topology.</div>
                ) : (
                  devices.map(device => {
                    const hasAccess = accessMap[device.id] ?? true;
                    return (
                      <div 
                        key={device.id} 
                        onClick={() => toggleAccess(device.id)}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${hasAccess ? 'bg-slate-800 border-indigo-500/30' : 'bg-slate-950/50 border-slate-800 opacity-70'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${hasAccess ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                          <div>
                            <div className="text-sm font-semibold text-slate-200">{device.name}</div>
                            <div className="text-xs text-slate-500 font-mono">{device.type} | {device.id.slice(0, 8)}</div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${hasAccess ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {hasAccess ? <Unlock size={12} /> : <Lock size={12} />}
                          {hasAccess ? 'ACCESS GRANTED' : 'RESTRICTED'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
              {/* Log Window */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0f1115] shadow-inner">
                {logs.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
                      <Activity size={40} className="opacity-20" />
                      <p className="text-sm">No messages or files shared yet.</p>
                   </div>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className={`mt-1 w-2 h-full rounded-full shrink-0 ${log.status === 'sent' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1 bg-slate-800/50 rounded p-3 border border-slate-800">
                       <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                             <span className={`text-xs font-bold ${log.status === 'sent' ? 'text-emerald-400' : 'text-red-400'}`}>{log.from}</span>
                             {log.type === 'file' && <FileText size={12} className="text-slate-400" />}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                       </div>
                       <p className="text-sm text-slate-300">{log.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-slate-800 border-t border-slate-700">
                
                {/* File Attachment Indicator */}
                {attachedFile && (
                    <div className="mb-2 flex items-center gap-2 bg-indigo-900/30 text-indigo-300 text-xs px-3 py-1.5 rounded-lg border border-indigo-500/30 w-fit">
                        <Paperclip size={12} />
                        <span>{attachedFile}</span>
                        <button onClick={() => setAttachedFile(null)} className="hover:text-white ml-2"><X size={12}/></button>
                    </div>
                )}

                <div className="relative flex gap-2">
                   <button 
                    onClick={handleAttachFile}
                    title="Attach File"
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors border border-slate-600"
                   >
                     <Paperclip size={18} />
                   </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={attachedFile ? "Add a note..." : "Enter message to broadcast..."}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg pl-4 pr-4 py-3 text-sm text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleBroadcast()}
                    disabled={isTransmitting}
                  />
                  <button 
                    onClick={handleBroadcast}
                    disabled={isTransmitting || (!message.trim() && !attachedFile)}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isTransmitting ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 flex justify-between px-1">
                   <span>Protocol: UDP Broadcast (Simulated)</span>
                   <span>Target: All Online & Granted Devices</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};