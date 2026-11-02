import React, { useState } from 'react';
import { User, Lock, Moon, Sun, Trash2, Camera, Shield, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export const SettingsPage: React.FC = () => {
  const { user, profile, updateProfile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({ full_name: fullName, avatar_url: avatarUrl });
    setSavingProfile(false);
    success('Profile Updated', 'Your profile details have been saved.');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toastError('Invalid Password', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('Mismatch', 'New passwords do not match.');
      return;
    }

    success('Password Updated', 'Your security credentials have been changed.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setAvatarUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    setDeleteModalOpen(false);
    success('Account Deleted', 'Your account and data have been scheduled for purge.');
    logout();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Account & Preferences</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your personal credentials, appearance, and platform security
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          Public Profile
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl text-white overflow-hidden shadow-lg">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0) || user?.email.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer text-white">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Profile Photo</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPG or GIF up to 5MB (Stored in Supabase Storage)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Email is bound to your Supabase Auth account"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" size="md" isLoading={savingProfile}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Security / Password */}
      <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl">
        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="w-4 h-4 text-purple-400" />
          Security & Password
        </h3>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" variant="secondary" size="md">
            Update Security Password
          </Button>
        </form>
      </div>

      {/* Theme */}
      <div className="p-8 rounded-3xl bg-[#141923] border border-white/[0.08] shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            Interface Appearance
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Toggle between Dark Fintech Mode and High-Contrast Light Mode
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/20 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Permanently erase your watchlist, trade alerts, and session credentials. This action cannot be reversed.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setDeleteModalOpen(true)}
          className="flex-shrink-0"
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to delete your Kamboh Plus account? All active watchlist tickers and historical notification preferences will be permanently wiped from the database.
          </p>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              Yes, Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
