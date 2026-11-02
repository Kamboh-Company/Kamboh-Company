import React from 'react';

export interface ConfidenceMeterProps {
  score: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  showLabel?: boolean;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  score,
  size = 64,
  strokeWidth = 6,
  showLabel = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#16C784'; // emerald
    if (score >= 70) return '#3B82F6'; // blue
    if (score >= 60) return '#F59E0B'; // amber
    return '#EA3943'; // red
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg] transition-all">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-bold text-white tracking-tight leading-none">
            {score}
          </span>
          <span className="text-[9px] text-slate-400 font-medium scale-90">CONF</span>
        </div>
      )}
    </div>
  );
};
