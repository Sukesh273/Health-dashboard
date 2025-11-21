import React from 'react';

interface TrendGraphProps {
  data: number[];
  min: number;
  max: number;
  color: string;
}

export const TrendGraph: React.FC<TrendGraphProps> = ({ data, min, max, color }) => {
  if (!data || data.length < 2) return null;

  const width = 100;
  const height = 40;
  const padding = 2;

  // Generate SVG points
  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const range = max - min;
    // Clamp value to ensure it stays within graph bounds
    const clampedVal = Math.min(Math.max(val, min), max);
    // Normalize (0 to 1)
    const normalized = (clampedVal - min) / (range || 1);
    // Invert Y (SVG coords start from top)
    const y = height - (normalized * (height - padding * 2)) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-16 mt-2 relative overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full" 
        preserveAspectRatio="none"
      >
        <defs>
          {/* Create a unique ID for the gradient based on color to avoid conflicts if multiple graphs are used */}
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area Fill */}
        <path 
          d={`M 0,${height} L ${points} L ${width},${height} Z`} 
          fill={`url(#gradient-${color.replace('#', '')})`} 
        />
        
        {/* Line */}
        <polyline 
          points={points} 
          fill="none" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};