import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Mail, Radio, Shield, Settings2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationStorage } from '../../lib/supabase';
import { NotificationItem, NotificationPreferences } from '../../types';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { Badge } from '../../components/ui/Badge';
import { formatTimestamp, formatTimeAgo } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    user_id: user?.id || 'demo',
    email_notifications: true,
    in_app_notifications: true,
    new_signals: true,
    tp_hit_alerts: true,
    sl_hit_alerts: true,
    marketing_emails: false,
  });

  useEffect(() => {
    if (!user) return;
    setNotifications(notificationStorage.getNotifications(user.id));
    const saved = localStorage.getItem(`signalpulse_prefs_${user.id}`);
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch {}
    }
  }, [user]);

  const handleMarkAllRead = () => {
    if (!user) return;
    notificationStorage.markAsRead(user.id);
    setNotifications(notificationStorage.getNotifications(user.id));
    success('Updated', 'All notifications marked as read.');
  };

  const handleTogglePref = (key: keyof NotificationPreferences) => {
    if (!user) return;
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    localStorage.setItem(`signalpulse_prefs_${user.id}`, JSON.stringify(updated));
    success('Preferences Saved', 'Your dispatch alert rules have been updated.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Alerts & Communications
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Notifications Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure real-time Resend email dispatch and in-app execution alert feeds
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            leftIcon={<Check className="w-4 h-4 text-[#16C784]" />}
          >
            Mark All Read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notifications Feed */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Activity History
          </h3>

          {notifications.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#141923] border border-white/5 text-center text-slate-400 text-xs">
              No notifications yet. New signal and execution events will appear here.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.signal_id) navigate(`/dashboard/signals/${n.signal_id}`);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-[#141923] border-white/5 text-slate-400'
                    : 'bg-[#171E2D] border-blue-500/30 text-slate-100 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatTimeAgo(n.created_at)}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Preferences Panel */}
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Settings2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Delivery Preferences</h3>
          </div>

          <div className="space-y-4">
            <Toggle
              checked={preferences.email_notifications}
              onChange={() => handleTogglePref('email_notifications')}
              label="Resend Email Notifications"
              description="Deliver immediate email alerts when high-confidence signals trigger."
            />

            <Toggle
              checked={preferences.in_app_notifications}
              onChange={() => handleTogglePref('in_app_notifications')}
              label="In-App Sound & Popups"
              description="Play sound and display desktop notifications."
            />

            <div className="border-t border-white/5 pt-4 space-y-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Signal Event Triggers
              </span>

              <Toggle
                checked={preferences.new_signals}
                onChange={() => handleTogglePref('new_signals')}
                label="New Algorithmic Setups"
              />

              <Toggle
                checked={preferences.tp_hit_alerts}
                onChange={() => handleTogglePref('tp_hit_alerts')}
                label="Take Profit Target Hits"
              />

              <Toggle
                checked={preferences.sl_hit_alerts}
                onChange={() => handleTogglePref('sl_hit_alerts')}
                label="Stop Loss Invalidation Alerts"
              />

              <Toggle
                checked={preferences.marketing_emails}
                onChange={() => handleTogglePref('marketing_emails')}
                label="Product Changelogs & Research"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
