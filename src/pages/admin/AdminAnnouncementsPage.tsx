import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Mail, Users, CheckCircle2 } from 'lucide-react';
import { announcementStorage, notificationStorage, userStorage } from '../../lib/supabase';
import { Announcement } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { formatTimestamp } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const AdminAnnouncementsPage: React.FC = () => {
  const { success } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'pro' | 'free'>('all');
  const [sendEmail, setSendEmail] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setAnnouncements(announcementStorage.getAnnouncements());
  }, []);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsSending(true);

    setTimeout(() => {
      // 1. Add announcement
      announcementStorage.addAnnouncement({
        title,
        message,
        target_audience: targetAudience,
        sent_email: sendEmail,
        created_by: 'Staff Administrator',
      });

      // 2. Dispatch in-app notification to all matching users
      const users = userStorage.getUsers();
      users.forEach((u) => {
        if (targetAudience === 'all' || u.plan === targetAudience) {
          notificationStorage.addNotification({
            id: 'anc-notif-' + Date.now() + '-' + u.id,
            user_id: u.id,
            title: `📢 Announcement: ${title}`,
            message,
            type: 'announcement',
            read: false,
            created_at: new Date().toISOString(),
          });
        }
      });

      setAnnouncements(announcementStorage.getAnnouncements());
      setTitle('');
      setMessage('');
      setIsSending(false);
      success(
        'Broadcast Dispatched',
        `Announcement sent to ${targetAudience.toUpperCase()} users with in-app alerts ${sendEmail ? 'and Resend email triggers' : ''}.`
      );
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Platform Announcements</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Broadcast global system updates, strategy adjustments, and research alerts via in-app & Resend email
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Broadcast Form */}
        <form onSubmit={handleBroadcast} className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-purple-400" />
            Compose Broadcast
          </h3>

          <Input
            label="Announcement Title"
            placeholder="e.g. Engine Update: New Bybit Redundancy Deployed"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full bg-[#0E131C] text-xs text-white rounded-xl px-3 py-2.5 border border-white/10 outline-none"
            >
              <option value="all">All Members (Free & Pro)</option>
              <option value="pro">Pro Subscribers Only</option>
              <option value="free">Free Tier Members Only</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Message Body
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the full broadcast message..."
              required
              className="w-full bg-[#0E131C] text-xs text-white rounded-xl p-3 border border-white/10 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-white/20 bg-[#0E131C] text-purple-600 focus:ring-0"
            />
            <label htmlFor="sendEmail" className="text-xs text-slate-300">
              Also dispatch email delivery via Resend API
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSending}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send Broadcast
            </Button>
          </div>
        </form>

        {/* Previous Announcements Log */}
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4">Broadcast History</h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {announcements.map((anc) => (
              <div
                key={anc.id}
                className="p-4 rounded-2xl bg-[#0E131C] border border-white/5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{anc.title}</span>
                  <Badge variant="purple" size="xs">
                    {anc.target_audience.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-slate-300 leading-relaxed">{anc.message}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-white/5">
                  <span>By: {anc.created_by}</span>
                  <span>{formatTimestamp(anc.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
