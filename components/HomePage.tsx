import React from 'react';
import { ArrowRight, Network, Activity, BrainCircuit } from 'lucide-react';
import { Logo } from './Logo';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    // Main container must handle scrolling because body is overflow-hidden
    <div className="relative h-screen w-full bg-slate-950 overflow-y-auto overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Background Effects (Fixed) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Grid Pattern (Fixed) */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{ 
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Content Container - Min height ensures vertical centering on desktop, but allows scroll on mobile */}
      <div className="relative z-10 min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          {/* Logo Section */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-slate-900/80 rounded-2xl md:rounded-3xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] backdrop-blur-sm animate-in fade-in zoom-in duration-500">
               <Logo className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" primaryColor="#60a5fa" secondaryColor="#34d399" />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300 text-[10px] sm:text-xs font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            v2.0 System Online
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 text-center">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 pb-2">
              Dan Mudi
            </span>
            <span className="block mt-1 sm:mt-2 text-xl sm:text-2xl md:text-4xl lg:text-5xl text-slate-200">
              Virtual Networking & IoT Lab
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed text-center px-2">
            The ultimate virtual environment for network engineering. Design complex topologies, configure devices, and master connectivity with an AI-powered assistant.
          </p>

          {/* CTA Button */}
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] active:scale-95"
          >
            Enter Laboratory
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group text-left">
              <div className="mb-3 p-2.5 bg-blue-900/20 rounded-lg inline-block text-blue-400 group-hover:text-blue-300 transition-colors">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Topology Designer</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Drag-and-drop interface to build complex network infrastructures.</p>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group text-left">
              <div className="mb-3 p-2.5 bg-emerald-900/20 rounded-lg inline-block text-emerald-400 group-hover:text-emerald-300 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Real-time Simulation</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Execute CLI commands and visualize connectivity instantly.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors backdrop-blur-sm group text-left sm:col-span-2 md:col-span-1">
              <div className="mb-3 p-2.5 bg-purple-900/20 rounded-lg inline-block text-purple-400 group-hover:text-purple-300 transition-colors">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">AI Tutor Support</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Integrated Gemini AI to guide you through configuration.</p>
            </div>
          </div>
          
          {/* Footer Copyright */}
          <div className="mt-12 text-xs text-slate-600">
            © Dan Mudi Digital Hub 2025
          </div>

        </div>
      </div>
    </div>
  );
};