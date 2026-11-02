import React, { useState, useEffect } from 'react';
import { Inbox, Mail, CheckCircle2, MessageSquare, Clock } from 'lucide-react';
import { contactStorage } from '../../lib/supabase';
import { ContactMessage } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatTimestamp } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const AdminInboxPage: React.FC = () => {
  const { success } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    setMessages(contactStorage.getMessages());
  }, []);

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
  };

  const columns: Column<ContactMessage>[] = [
    {
      key: 'name',
      header: 'Sender',
      render: (m) => (
        <div>
          <span className="font-bold text-white block">{m.name}</span>
          <span className="text-xs text-slate-400 font-mono">{m.email}</span>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject & Preview',
      render: (m) => (
        <div>
          <span className="font-semibold text-slate-200 block">{m.subject}</span>
          <span className="text-xs text-slate-400 truncate max-w-xs block">{m.message}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (m) => (
        <Badge variant={m.status === 'unread' ? 'blue' : 'neutral'} size="xs">
          {m.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      render: (m) => (
        <span className="text-slate-400 text-xs font-mono">{formatTimestamp(m.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (m) => (
        <Button size="sm" variant="outline" onClick={() => handleOpenMessage(m)}>
          Read Ticket
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Contact Messages Inbox</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          View inquiries and customer support requests submitted to the contact_messages table
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <Table
          columns={columns}
          data={messages}
          keyExtractor={(m) => m.id}
          emptyState={
            <div className="py-8 text-center text-slate-400 text-xs">
              No contact tickets received yet.
            </div>
          }
        />
      </div>

      {/* Ticket Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title="Inquiry Details"
      >
        {selectedMessage && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#0E131C] border border-white/5 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <span className="font-bold text-white">{selectedMessage.name} ({selectedMessage.email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-300 font-mono">{formatTimestamp(selectedMessage.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="font-semibold text-blue-400">{selectedMessage.subject}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Message Content:
              </span>
              <p className="p-4 rounded-xl bg-[#0E131C] border border-white/5 text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMessage(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.open(`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`);
                  setSelectedMessage(null);
                }}
              >
                Reply via Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
