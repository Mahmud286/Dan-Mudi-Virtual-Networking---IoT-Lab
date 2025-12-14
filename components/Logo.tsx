import React from 'react';

interface LogoProps {
  className?: string;
  primaryColor?: string; // The Flask color
  secondaryColor?: string; // The Circuit color
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
      {/* Circuit Traces (Behind/Inside) */}
      <g stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Top Trace */}
        <path d="M50 42 V 30" />
        <circle cx="50" cy="28" r="2.5" fill={secondaryColor} stroke="none" />
        
        {/* Bottom Left Trace */}
        <path d="M42 58 L 30 72" />
        <circle cx="28" cy="74" r="2.5" fill={secondaryColor} stroke="none" />
        <path d="M30 72 H 20" />
        <circle cx="18" cy="72" r="2" fill={secondaryColor} stroke="none" />

        {/* Bottom Right Trace */}
        <path d="M58 58 L 70 72" />
        <circle cx="72" cy="74" r="2.5" fill={secondaryColor} stroke="none" />
        <path d="M70 72 H 80" />
        <circle cx="82" cy="72" r="2" fill={secondaryColor} stroke="none" />

        {/* Side Traces */}
        <path d="M42 50 H 32 L 28 45" />
        <circle cx="28" cy="45" r="2" fill={secondaryColor} stroke="none" />

        <path d="M58 50 H 68 L 72 45" />
        <circle cx="72" cy="45" r="2" fill={secondaryColor} stroke="none" />
      </g>

      {/* Central Chip */}
      <rect 
        x="40" y="42" 
        width="20" height="20" 
        rx="2" 
        stroke={secondaryColor} 
        strokeWidth="4" 
        fill="none" 
      />
      <rect x="45" y="47" width="10" height="10" fill={secondaryColor} stroke="none" opacity="0.5" />

      {/* Flask Outline */}
      <path 
        d="M38 25 V 15 H 62 V 25 L 82 82 C 84 88 80 95 72 95 H 28 C 20 95 16 88 18 82 L 38 25 Z" 
        stroke={primaryColor} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Flask Rim */}
      <path d="M35 15 H 65" stroke={primaryColor} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};