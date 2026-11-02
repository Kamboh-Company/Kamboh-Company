import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'emerald' | 'red' | 'blue' | 'purple' | 'amber' | 'neutral' | 'pro';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded font-medium',
    sm: 'text-xs px-2.5 py-1 rounded-full font-medium',
    md: 'text-sm px-3 py-1.5 rounded-full font-semibold',
  };

  const variantStyles = {
    emerald: 'bg-[#16C784]/15 text-[#16C784] border border-[#16C784]/30',
    red: 'bg-[#EA3943]/15 text-[#EA3943] border border-[#EA3943]/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    neutral: 'bg-white/5 text-slate-300 border border-white/10',
    pro: 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20',
  };

  const dotColors = {
    emerald: 'bg-[#16C784]',
    red: 'bg-[#EA3943]',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    amber: 'bg-amber-400',
    neutral: 'bg-slate-400',
    pro: 'bg-purple-400 animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
