import React, { useState, useRef, useEffect } from 'react';
import { TerminalMessage } from '../types';
import { getTutorResponse } from '../services/gemini';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface TutorChatProps {
  context?: string;
}

export const TutorChat: React.FC<TutorChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    { role: 'system', content: 'Hello! I\'m your Network Tutor. I can help you design topologies, configure subnets, or troubleshoot connectivity issues. What are you working on?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: TerminalMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Pass conversation history and current lab context
    const aiResponseText = await getTutorResponse([...messages, userMsg], context);
    
    setMessages(prev => [...prev, { role: 'system', content: aiResponseText }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700 w-80">
      <div className="p-4 border-b border-slate-700 bg-slate-800 flex items-center justify-between">
        <h2 className="font-semibold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          AI Tutor
        </h2>
        <span className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded border border-purple-800">Gemini Pro</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
              ${msg.role === 'system' ? 'bg-purple-900/50 text-purple-300 border border-purple-700' : 'bg-blue-900/50 text-blue-300 border border-blue-700'}
            `}>
              {msg.role === 'system' ? <Bot size={16} /> : <User size={16} />}
            </div>
            
            <div className={`
              rounded-lg p-3 text-sm max-w-[85%] leading-relaxed
              ${msg.role === 'system' 
                ? 'bg-slate-800 text-slate-200 border border-slate-700' 
                : 'bg-blue-600/20 text-blue-100 border border-blue-500/30'}
            `}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700 flex items-center justify-center flex-shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 bg-slate-800 border-t border-slate-700">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for help..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-3 pr-10 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-purple-500 outline-none resize-none h-12 scrollbar-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};