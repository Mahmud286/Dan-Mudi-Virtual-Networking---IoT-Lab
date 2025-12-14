import React from 'react';
import { ArrowRight, Network, Activity, BrainCircuit } from 'lucide-react';
import { Logo } from './Logo';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center overflow-x-hidden selection:bg-blue-500/30 py-10 md:py-0">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center flex flex-col items-center">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-900/80 rounded-3xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] backdrop-blur-sm animate-in fade-in zoom-in duration-500">
             <Logo className="w-12 h-12 md:w-16 md:h-16" primaryColor="#60a5fa" secondaryColor="#34d399" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-xs md:text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          v2.0 System Online
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white mb-6">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
            Dan Mudi
          </span>
          <span className="block mt-2 md:mt-4 text-2xl md:text-4xl lg:text-5xl text-slate-200">
            Virtual Networking & IoT Lab
          </span>
        </h1>

        <p className="text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed px-4">
          The ultimate virtual environment for network engineering. Design complex topologies, configure devices, and master connectivity with an AI-powered assistant.
        </p>

        <button 
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-base md:text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]"
        >
          Enter Laboratory
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 text-left w-full">
          <div className="p-5 md:p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group">
            <div className="mb-4 p-3 bg-blue-900/20 rounded-lg inline-block text-blue-400 group-hover:text-blue-300 transition-colors">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Topology Designer</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Drag-and-drop interface to build complex network infrastructures in seconds.</p>
          </div>
          
          <div className="p-5 md:p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group">
            <div className="mb-4 p-3 bg-emerald-900/20 rounded-lg inline-block text-emerald-400 group-hover:text-emerald-300 transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time Simulation</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Execute CLI commands and visualize connectivity with instant feedback.</p>
          </div>

          <div className="p-5 md:p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group">
            <div className="mb-4 p-3 bg-purple-900/20 rounded-lg inline-block text-purple-400 group-hover:text-purple-300 transition-colors">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Tutor Support</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Integrated Gemini AI to guide you through configuration and troubleshooting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};