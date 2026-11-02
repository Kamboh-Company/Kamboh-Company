import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle, CreditCard, DollarSign, Wallet, Check, X } from 'lucide-react';
import { userStorage, referralStorage } from '../../lib/supabase';
import { Profile, UserPlan, UserRole, PayoutRequest } from '../../types';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { formatTimestamp, formatTimeAgo } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const AdminUsersPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState<'users' | 'payouts'>('users');
  const [users, setUsers] = useState<Profile[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [search, setSearch] = useState('');

  const loadData = () => {
    setUsers(userStorage.getUsers());
    setPayouts(referralStorage.getAllPayouts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprovePayout = (payoutId: string) => {
    const randomTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    referralStorage.updatePayoutStatus(payoutId, 'paid', randomTx);
    loadData();
    success('Payout Approved', `Marked as PAID with TXID: ${randomTx.slice(0, 10)}...`);
  };

  const handleRejectPayout = (payoutId: string) => {
    referralStorage.updatePayoutStatus(payoutId, 'rejected');
    loadData();
    toastError('Payout Rejected', 'Request marked as rejected.');
  };

  const handleTogglePlan = (userId: string, currentPlan: UserPlan) => {
    const newPlan: UserPlan = currentPlan === 'pro' ? 'free' : 'pro';
    userStorage.updateUser(userId, { plan: newPlan });
    setUsers(userStorage.getUsers());
    success('Plan Updated', `User switched to ${newPlan.toUpperCase()}.`);
  };

  const handleToggleBan = (userId: string, banned: boolean | undefined) => {
    userStorage.updateUser(userId, { banned: !banned });
    setUsers(userStorage.getUsers());
    success(banned ? 'User Restored' : 'User Banned', `Access status modified.`);
  };

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.full_name && u.full_name.toLowerCase().includes(q))
    );
  });

  const columns: Column<Profile>[] = [
    {
      key: 'email',
      header: 'User Account',
      render: (u) => (
        <div>
          <span className="font-bold text-white block">{u.full_name || 'Anonymous Trader'}</span>
          <span className="text-xs text-slate-400 font-mono">{u.email}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (u) => (
        <Badge variant={u.role === 'admin' ? 'purple' : 'neutral'} size="xs">
          {u.role.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'plan',
      header: 'Active Plan',
      render: (u) => (
        <Badge variant={u.plan === 'pro' ? 'pro' : 'neutral'} size="xs">
          {u.plan === 'pro' ? 'PRO TRADER' : 'FREE TIER'}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Access Status',
      render: (u) => (
        <Badge variant={u.banned ? 'red' : 'emerald'} size="xs">
          {u.banned ? 'Suspended' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Admin Actions',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTogglePlan(u.id, u.plan)}
          >
            Switch to {u.plan === 'pro' ? 'Free' : 'Pro'}
          </Button>

          <Button
            size="sm"
            variant={u.banned ? 'success' : 'danger'}
            onClick={() => handleToggleBan(u.id, u.banned)}
          >
            {u.banned ? 'Unban' : 'Ban'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Users & Affiliates</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage registered accounts, plan entitlements, and process affiliate commission payouts
          </p>
        </div>

        {activeTab === 'users' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#141923] text-xs text-white rounded-xl pl-9 pr-3 py-2 border border-white/10 outline-none"
            />
          </div>
        )}
      </div>

      <Tabs
        tabs={[
          { id: 'users', label: `Registered Users (${users.length})` },
          { id: 'payouts', label: `Affiliate Payout Requests (${payouts.length})` },
        ]}
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as 'users' | 'payouts')}
      />

      {activeTab === 'users' ? (
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
          <Table
            columns={columns}
            data={filteredUsers}
            keyExtractor={(u) => u.id}
            emptyState={<div className="py-8 text-center text-slate-400 text-xs">No users found.</div>}
          />
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-white/10 pb-3">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">User ID</th>
                <th className="py-3 px-4">Amount ($)</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Destination Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No affiliate payout requests submitted.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-4 px-4 text-slate-400">{formatTimeAgo(p.created_at)}</td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-300">{p.user_id}</td>
                    <td className="py-4 px-4 font-bold text-emerald-400 text-sm">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[11px]">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-300 max-w-[220px] truncate" title={p.payout_details}>
                      {p.payout_details}
                    </td>
                    <td className="py-4 px-4">
                      {p.status === 'paid' ? (
                        <Badge variant="emerald" size="xs">
                          PAID
                        </Badge>
                      ) : p.status === 'pending' ? (
                        <Badge variant="amber" size="xs">
                          PENDING
                        </Badge>
                      ) : (
                        <Badge variant="red" size="xs">
                          {p.status.toUpperCase()}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {p.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApprovePayout(p.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleRejectPayout(p.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : p.status === 'paid' && p.tx_hash_or_ref ? (
                        <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px] inline-block">
                          {p.tx_hash_or_ref.slice(0, 10)}...
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

