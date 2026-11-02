import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-[#141923] border border-white/[0.06] shadow-xl shadow-black/20',
    glass: 'bg-[#141923]/80 backdrop-blur-md border border-white/[0.08] shadow-2xl shadow-black/40',
    interactive:
      'bg-[#141923] hover:bg-[#19202E] border border-white/[0.06] hover:border-white/[0.15] cursor-pointer hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5',
    bordered: 'bg-transparent border border-white/10 hover:border-white/20',
  };

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
