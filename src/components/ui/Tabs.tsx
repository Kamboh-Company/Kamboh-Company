import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'pills',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-white/10 gap-6 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 pb-3 font-medium text-sm transition-all border-b-2 -mb-px ${
                isActive
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center p-1 bg-[#0E131C] border border-white/10 rounded-xl gap-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-[#1F293D] text-white shadow-sm border border-white/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
