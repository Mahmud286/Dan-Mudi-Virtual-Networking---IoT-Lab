import React from 'react';

interface LogoProps {
  className?: string;
  primaryColor?: string; // Chip Color
  secondaryColor?: string; // Traces Color
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-10 h-10", 
  primaryColor = "currentColor", 
  secondaryColor = "currentColor" 
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Circuit Traces (Nodes) */}
      <g stroke={secondaryColor} strokeWidth="3" strokeLinecap="round">
         {/* Top Left */}
         <line x1="34" y1="34" x2="22" y2="22" />
         <circle cx="22" cy="22" r="3.5" fill={secondaryColor} stroke="none" />
         
         {/* Left */}
         <line x1="32" y1="50" x2="15" y2="50" />
         <circle cx="15" cy="50" r="3.5" fill={secondaryColor} stroke="none" />

         {/* Bottom Left */}
         <line x1="34" y1="66" x2="22" y2="78" />
         <circle cx="22" cy="78" r="3.5" fill={secondaryColor} stroke="none" />

         {/* Top */}
         <line x1="50" y1="32" x2="50" y2="15" />
         <circle cx="50" cy="15" r="3.5" fill={secondaryColor} stroke="none" />
         
         {/* Top Right */}
         <line x1="66" y1="34" x2="78" y2="22" />
         <circle cx="78" cy="22" r="3.5" fill={secondaryColor} stroke="none" />

         {/* Bottom */}
         <line x1="50" y1="68" x2="50" y2="85" />
         <circle cx="50" cy="85" r="3.5" fill={secondaryColor} stroke="none" />

         {/* Bottom Right */}
         <line x1="66" y1="66" x2="78" y2="78" />
         <circle cx="78" cy="78" r="3.5" fill={secondaryColor} stroke="none" />
      </g>

      {/* Chip Pins */}
      <g stroke={primaryColor} strokeWidth="4" strokeLinecap="round">
        {/* N */}
        <line x1="41" y1="32" x2="41" y2="28" />
        <line x1="50" y1="32" x2="50" y2="28" />
        <line x1="59" y1="32" x2="59" y2="28" />
        {/* S */}
        <line x1="41" y1="68" x2="41" y2="72" />
        <line x1="50" y1="68" x2="50" y2="72" />
        <line x1="59" y1="68" x2="59" y2="72" />
        {/* W */}
        <line x1="32" y1="41" x2="28" y2="41" />
        <line x1="32" y1="50" x2="28" y2="50" />
        <line x1="32" y1="59" x2="28" y2="59" />
      </g>

      {/* Chip Body */}
      <rect 
        x="32" y="32" 
        width="36" height="36" 
        rx="6" 
        fill={primaryColor} 
      />
      
      {/* Inner Chip Square */}
      <rect 
        x="41" y="41" 
        width="18" height="18" 
        rx="3" 
        fill="white" 
        fillOpacity="0.25"
      />

      {/* Wifi Signals (East) */}
      <path 
        d="M 76 42 A 12 12 0 0 1 76 58" 
        stroke={primaryColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
      />
      <path 
        d="M 83 35 A 22 22 0 0 1 83 65" 
        stroke={primaryColor} 
        strokeWidth="4" 
        strokeLinecap="round" 
        fill="none" 
      />
    </svg>
  );
};